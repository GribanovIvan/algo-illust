# Algorithms and data structures visualizer

![image](https://github.com/cupoftea4/algo-illust/assets/90093980/a4d07d11-3351-44f0-b0d6-d57ddcad0377)
![image_2023-05-18_14-26-14](https://github.com/cupoftea4/algo-illust/assets/90093980/680c5bc0-f291-4179-82be-26e0ee51a7d4)

## What's inside

- **Sorting**: bubble, selection, shell, merge, quick, counting and heap sort, animated in either direction, with adjustable speed and numbered data variants.
- **Custom arrays**: type 2–200 numbers separated by commas or spaces; negative and decimal numbers work, invalid input shows a message instead of starting the animation.
- **Comparison**: every algorithm sorts the same array in a background worker and the table shows steps, time and whether the result is sorted.
- **Searching**: binary search, Knuth–Morris–Pratt, Boyer–Moore and hashing.
- **Data structures**: stack, queue, deque, singly, doubly and circular linked lists, red-black tree.

## Available scripts

Requires Node.js 22.12 or newer.

| Command | What it does |
|---|---|
| `npm ci` | install dependencies |
| `npm start` | development server at http://localhost:5173 |
| `npm run build` | type-check and build the static site into `dist` |
| `npm run preview` | serve the built `dist` locally |
| `npm test` | run the Jest + React Testing Library suite once |
| `npm run test:coverage` | the same with a coverage report |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check of the app and the tests (`npm run build` checks the app only) |
| `npm run verify:build` | check that the built `dist` resolves its assets under any folder and that the worker sorts correctly |

## Deployment

The build is plain static files and is not tied to a folder: copy the **contents** of `dist` to the site root or to any subfolder such as `/asd/`. The server should answer unknown paths inside that folder with its `index.html`, as usual for single-page apps, so links like `/asd/sort/bubble` can be opened directly. The app works out its folder from the address, so the folder itself must not be named `sort`, `search` or `ds`. On Netlify the included `netlify.toml` sets the build, the `dist` folder and this fallback.

Variants that generate names and cities use built-in word lists and the font is bundled with the app, so it makes no requests to third-party servers and works offline once loaded.
