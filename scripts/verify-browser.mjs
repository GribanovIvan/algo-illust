import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { resolve } from 'node:path';

const profile = await mkdtemp(resolve('node_modules/.browser-check-'));
const deadline = setTimeout(() => { throw new Error('Browser verification timed out'); }, 60000);
let browser;
let socket;
let prefix = '/';
const missing = [];
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : null;
  try {
    if (!file || file.includes('..')) throw new Error('Not a file');
    const body = await readFile(resolve('dist', file));
    const type = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'image/x-icon';
    response.writeHead(200, {'Content-Type': type}).end(body);
  } catch {
    if (pathname.startsWith(prefix) && request.headers.accept?.includes('text/html')) {
      response.writeHead(200, {'Content-Type': 'text/html'}).end(await readFile('dist/index.html'));
    } else {
      missing.push(pathname);
      response.writeHead(404).end('Not found');
    }
  }
});

try {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = spawn(process.env.CHROMIUM || '/usr/bin/chromium', [
    '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking',
    '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, 'about:blank',
  ], {env: {...process.env, HOME: profile, XDG_CONFIG_HOME: profile, XDG_CACHE_HOME: profile}, stdio: ['ignore', 'ignore', 'pipe']});
  const endpoint = await new Promise((resolveEndpoint, reject) => {
    let output = '';
    browser.once('error', reject);
    browser.once('exit', code => reject(new Error(`Chromium exited: ${code}\n${output}`)));
    browser.stderr.on('data', chunk => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) resolveEndpoint(new URL(match[1]));
    });
  });
  const targets = await (await fetch(`http://${endpoint.host}/json/list`)).json();
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await once(socket, 'open');
  let sequence = 0;
  const pending = new Map();
  const failures = [];
  const errors = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const callbacks = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) callbacks.reject(new Error(JSON.stringify(message.error)));
      else callbacks.resolve(message.result);
    }
    if (message.method === 'Network.loadingFailed') failures.push(message.params);
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) failures.push(message.params.response);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry);
  });
  const send = (method, params = {}) => new Promise((resolveCommand, reject) => {
    const id = ++sequence;
    pending.set(id, {resolve: resolveCommand, reject});
    socket.send(JSON.stringify({id, method, params}));
  });
  await Promise.all(['Network.enable', 'Runtime.enable', 'Page.enable', 'Log.enable'].map(method => send(method)));
  await send('Network.setCacheDisabled', {cacheDisabled: true});
  for (prefix of ['/asd/', '/qwe/', '/']) {
    const missingResponse = await fetch(`${origin}${prefix}missing.css`);
    assert.equal(missingResponse.status, 404);
    missing.length = 0;
    for (const route of ['', 'sort/bubble']) {
      // Start each direct navigation from a blank document, without a warm application cache.
      await send('Page.navigate', {url: 'about:blank'});
      failures.length = 0;
      errors.length = 0;
      await send('Page.navigate', {url: `${origin}${prefix}${route}`});
      const {result, exceptionDetails} = await send('Runtime.evaluate', {
        expression: `new Promise((resolve, reject) => {
          const started = Date.now();
          const check = () => {
            const root = document.getElementById('root');
            const input = document.querySelector('[name="arrayLength"]');
            if (root?.textContent && (${Boolean(route)} ? input : root.querySelector('h1'))) {
              setTimeout(() => {
                const form = input?.closest('form');
                const button = form?.querySelector('[type="submit"]');
                resolve({path: location.pathname, hash: location.hash, text: root.textContent,
                  visible: root.getBoundingClientRect().height > 0,
                  form: form && {display: getComputedStyle(form).display, gap: getComputedStyle(form).gap,
                    radius: getComputedStyle(input).borderRadius, padding: getComputedStyle(input).padding,
                    background: getComputedStyle(button).backgroundColor,
                    border: getComputedStyle(button).borderTopStyle}});
              }, 300);
            } else if (Date.now() - started > 10000) reject(new Error('Content did not render'));
            else setTimeout(check, 30);
          };
          check();
        })`, awaitPromise: true, returnByValue: true,
      });
      assert.equal(exceptionDetails, undefined, JSON.stringify(exceptionDetails));
      const state = result.value;
      assert.equal(state.path, `${prefix}${route}`);
      assert.equal(state.hash, '');
      assert(state.visible);
      if (route) {
        assert(state.text.includes('Array Length:'));
        if (process.argv.includes('--check-styles')) {
          assert.deepEqual(state.form, {display: 'flex', gap: '8px', radius: '9.6px', padding: '8px', background: 'rgb(0, 0, 0)', border: 'solid'});
        }
      }
      assert.deepEqual(failures, [], JSON.stringify(failures));
      assert.deepEqual(errors, [], JSON.stringify(errors));
      assert.deepEqual(missing, []);
      console.log(JSON.stringify({path: state.path, visible: state.visible, hash: state.hash, failedRequests: failures, consoleErrors: errors, form: state.form}));
    }
  }
} finally {
  clearTimeout(deadline);
  socket?.close();
  if (browser && browser.exitCode === null) {
    const exited = once(browser, 'exit');
    browser.kill();
    await exited;
  }
  server.closeAllConnections();
  await new Promise(resolveClose => server.close(resolveClose));
  await rm(profile, {recursive: true, force: true});
}
