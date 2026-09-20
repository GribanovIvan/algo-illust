import fs from 'fs';
import path from 'path';
import basePath from './basePath';

// the same bootstrap that runs in the browser before the assets are requested
const bootstrap = fs
  .readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
  .match(/<script>([\s\S]*?)<\/script>/)?.[1] as string;

const openAt = (pathname: string) => {
  document.head.innerHTML = '';
  window.history.replaceState({}, '', pathname);
  new Function(bootstrap)();
  return document.querySelector('base')?.getAttribute('href');
};

afterEach(() => {
  document.head.innerHTML = '';
  window.history.replaceState({}, '', '/');
});

describe('index.html bootstrap', () => {
  test('is inlined in index.html, so it runs before any asset is requested', () => {
    const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
    expect(html.indexOf('<script>')).toBeLessThan(html.indexOf('<link'));
    expect(bootstrap).not.toContain('/asd');
  });

  test.each([
    ['/', '/'],
    ['/index.html', '/'],
    ['/sort/bubble', '/'],
    ['/asd/', '/asd/'],
    ['/asd/index.html', '/asd/'],
    ['/asd/sort/bubble', '/asd/'],
    ['/asd/sort/compare', '/asd/'],
    ['/qwe/search/binary', '/qwe/'],
    ['/qwe/ds/stack', '/qwe/'],
    ['/asd/unknown', '/asd/'],
    ['/one/two/asd/sort/heap', '/one/two/asd/'],
  ])('takes the base of "%s" as "%s"', (pathname, expected) => {
    expect(openAt(pathname)).toBe(expected);
  });
});

describe('basePath', () => {
  test('returns the folder the app is served from', () => {
    openAt('/asd/sort/bubble');
    expect(basePath()).toBe('/asd/');
  });

  test('returns the site root when the app is served from it', () => {
    openAt('/sort/bubble');
    expect(basePath()).toBe('/');
  });
});
