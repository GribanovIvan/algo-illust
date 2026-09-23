import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { Worker } from 'node:worker_threads';

const html = await readFile('dist/index.html', 'utf8');
const bootstrap = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const template = html.match(/<template id="app-resources">([\s\S]*?)<\/template>/)[0];
assert(!/<(?:link|script)\b[^>]*(?:href|src)=/.test(html.replace(template, '')));
for (const [pathname, prefix] of [
  ['/', '/'], ['/sort/bubble', '/'], ['/asd/', '/asd/'], ['/qwe/', '/qwe/'],
  ['/asd/sort/bubble', '/asd/'], ['/qwe/sort/bubble', '/qwe/'], ['/course/demo/', '/course/demo/'],
  ['/course/demo/sort/heap', '/course/demo/'],
  ['/asd/search/kmp', '/asd/'], ['/asd/ds/stack', '/asd/'],
]) {
  const dom = new JSDOM(html, {url: `https://example.test${pathname}`, runScripts: 'outside-only'});
  dom.window.eval(bootstrap);
  const assets = [...dom.window.document.head.querySelectorAll('link, script[src]')];
  assert(assets.length >= 4);
  for (const asset of assets) {
    const url = new URL(asset.href || asset.src);
    assert(url.pathname.startsWith(prefix));
    await access(`dist/${url.pathname.slice(prefix.length)}`);
  }
  dom.window.close();
  console.log(`Relative assets verified: ${pathname}`);
}

const workerFile = (await readdir('dist/assets')).find(name => name.startsWith('benchmark.worker-'));
assert(workerFile, 'Worker must be a separate built asset');
const workerCode = await readFile(`dist/assets/${workerFile}`, 'utf8');
// Run the actual Vite worker bundle on a separate Node thread with browser message adapters.
const worker = new Worker(`
  const { parentPort } = require('node:worker_threads');
  globalThis.postMessage = data => parentPort.postMessage(data);
  ${workerCode}
  parentPort.on('message', data => globalThis.onmessage({ data }));
`, { eval: true });
try {
  const ids = ['bubble', 'selection', 'shell', 'quick', 'merge', 'counting', 'heap'];
  const stats = await new Promise((resolve, reject) => {
    const received = [];
    const timeout = setTimeout(() => reject(new Error('Worker did not finish')), 10000);
    worker.once('error', error => { clearTimeout(timeout); reject(error); });
    worker.on('message', stat => {
      received.push(stat);
      if (received.length === ids.length) { clearTimeout(timeout); resolve(received); }
    });
    worker.postMessage({length: 100, sorts: ids});
  });
  assert.deepEqual(stats.map(stat => stat.sortId), ids);
  assert(stats.every(stat => stat.sorted && Number.isFinite(stat.steps) && stat.time >= 0));
  console.log(`Built worker verified: ${stats.length} algorithms, including heap; all results sorted.`);
} finally {
  await worker.terminate();
}
