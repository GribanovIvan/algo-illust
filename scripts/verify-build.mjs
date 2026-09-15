import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import vm from 'node:vm';
import { Worker } from 'node:worker_threads';

const html = await readFile('dist/index.html', 'utf8');
const bootstrap = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const assets = [...html.matchAll(/(?:href|src)="(\.[^"]+)"/g)].map(match => match[1]);
assert(assets.length >= 4);
for (const [pathname, prefix] of [
  ['/', '/'], ['/asd/', '/asd/'], ['/course/demo/', '/course/demo/'],
  ['/course/demo/sort/heap', '/course/demo/'],
  ['/asd/search/kmp', '/asd/'], ['/asd/ds/stack', '/asd/'],
]) {
  let base;
  vm.runInNewContext(bootstrap, {
    window: { location: { pathname } },
    document: { createElement: () => ({}), head: { appendChild: element => { base = element.href; } } },
  });
  assert.equal(base, prefix);
  for (const asset of assets) {
    const url = new URL(asset, `https://example.test${base}`);
    assert(url.pathname.startsWith(prefix));
    await access(`dist/${url.pathname.slice(prefix.length)}`);
  }
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
