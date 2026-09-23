import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const bootstrap = html.match(/<script>([\s\S]*?)<\/script>/)![1];

test.each(['/', '/asd/', '/qwe/', '/course/demo/'].flatMap(prefix =>
  ['', 'sort/bubble', 'search/kmp', 'ds/stack'].map(route => [prefix + route, prefix])
))('resolves resources before inserting them at %s', (pathname, prefix) => {
  window.history.replaceState({}, '', `${pathname}?example=1`);
  const template = document.createElement('template');
  template.id = 'app-resources';
  template.innerHTML = '<link rel="icon" href="./favicon.ico">' +
    '<link rel="stylesheet" href="./root.css">' +
    '<link rel="stylesheet" href="./assets/index-test.css">' +
    '<script type="module" crossorigin src="./assets/index-test.js"></script>';
  document.body.appendChild(template);
  const inserted: HTMLElement[] = [];
  jest.spyOn(document.head, 'appendChild').mockImplementation(element => {
    inserted.push(element as HTMLElement);
    return element;
  });
  try {
    new Function(bootstrap)();
    expect(inserted.map(element => element.getAttribute('href') || element.getAttribute('src'))).toEqual(
      ['favicon.ico', 'root.css', 'assets/index-test.css', 'assets/index-test.js']
        .map(file => `${window.location.origin}${prefix}${file}`)
    );
    expect(inserted[3]).toHaveAttribute('type', 'module');
    expect(inserted[3]).toHaveAttribute('crossorigin');
    expect(window.location.pathname).toBe(pathname);
    expect(window.location.hash).toBe('');
  } finally {
    template.remove();
  }
});

test('development HTML does not need the built resource template', () => {
  expect(() => new Function(bootstrap)()).not.toThrow();
});
