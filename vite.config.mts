import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// The preload scanner resolves relative asset paths against the page address, so on a directly
// opened nested page it would look for them in the route folder. That is why the built tags are
// written by the bootstrap of index.html, when the runtime <base> is already in place.
const runtimeAssets = (): Plugin => ({
  name: 'runtime-assets',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html: string) {
      const tags: string[] = [];
      const withoutTags = html.replace(
        /[ \t]*<(?:link[^>]*|script[^>]*\ssrc="[^"]*"[^>]*)>(?:<\/script>)?\n?/g,
        (tag) => {
          tags.push(tag.trim());
          return '';
        }
      );
      // "</" is escaped, otherwise the written </script> would close the writing script itself
      const written = JSON.stringify(tags.join('')).replace(/<\//g, '<\\/');
      return withoutTags.replace('</head>', `  <script>document.write(${written})</script>\n  </head>`);
    },
  },
});

export default defineConfig({
  // relative asset paths, as "homepage": "." did in Create React App
  base: './',
  plugins: [react(), runtimeAssets()],
  server: { port: 3000 },
  build: { outDir: 'build' },
});
