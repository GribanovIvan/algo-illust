import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function dynamicBasePlugin(): Plugin {
  return {
    name: 'dynamic-base-loader',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      const cssFiles: string[] = [];
      const scriptFiles: string[] = [];

      // Extract stylesheets (e.g. ./root.css, ./assets/index-xxx.css)
      const linkRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi;
      let linkMatch: RegExpExecArray | null;
      while ((linkMatch = linkRegex.exec(html)) !== null) {
        const tag = linkMatch[0];
        const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
        if (hrefMatch) {
          const file = hrefMatch[1].replace(/^\.\//, '').replace(/^\//, '');
          if (!cssFiles.includes(file)) {
            cssFiles.push(file);
          }
        }
      }

      // Extract module scripts (e.g. ./assets/index-xxx.js)
      const scriptRegex = /<script\s+[^>]*type=["']module["'][^>]*><\/script>/gi;
      let scriptMatch: RegExpExecArray | null;
      while ((scriptMatch = scriptRegex.exec(html)) !== null) {
        const tag = scriptMatch[0];
        const srcMatch = tag.match(/src=["']([^"']+)["']/i);
        if (srcMatch) {
          const file = srcMatch[1].replace(/^\.\//, '').replace(/^\//, '');
          if (!scriptFiles.includes(file)) {
            scriptFiles.push(file);
          }
        }
      }

      // Remove static stylesheet and module script tags to prevent speculative preload 404s
      let transformedHtml = html
        .replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*>\s*/gi, '')
        .replace(/<script\s+[^>]*type=["']module["'][^>]*><\/script>\s*/gi, '');

      // Script to compute base from runtime URL and inject assets dynamically
      const loaderScript = `<script>
      (function () {
        var p = window.location.pathname.replace(/\\/index\\.html$/, '');
        var match = p.match(/^(.*?)(\\/(sort|search|ds)(\\/.*)?)?$/);
        var base = (match && match[1]) ? match[1] : '';
        if (!base.endsWith('/')) base += '/';

        var baseEl = document.createElement('base');
        baseEl.href = base;
        document.head.appendChild(baseEl);

        var cssFiles = ${JSON.stringify(cssFiles)};
        for (var i = 0; i < cssFiles.length; i++) {
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = base + cssFiles[i];
          document.head.appendChild(link);
        }

        var jsFiles = ${JSON.stringify(scriptFiles)};
        for (var j = 0; j < jsFiles.length; j++) {
          var s = document.createElement('script');
          s.type = 'module';
          s.crossOrigin = '';
          s.src = base + jsFiles[j];
          document.head.appendChild(s);
        }
      })();
    </script>`;

      // Insert loader into <head>
      transformedHtml = transformedHtml.replace('<head>', '<head>\n    ' + loaderScript);

      return transformedHtml;
    },
  };
}

export default defineConfig({
  plugins: [react(), dynamicBasePlugin()],
  base: './',
  build: {
    outDir: 'dist',
  },
  worker: {
    format: 'es',
  },
});

