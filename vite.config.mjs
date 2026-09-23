import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react(), {
    name: 'runtime-assets',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const resources = [];
        const page = html.replace(/<script\b[^>]*\bsrc="[^"]+"[^>]*><\/script>|<link\b[^>]*\bhref="[^"]+"[^>]*>/g, tag => {
          resources.push(tag);
          return '';
        });
        return page.replace('</head>', `<template id="app-resources">${resources.join('\n')}</template></head>`);
      },
    },
  }],
  build: { outDir: 'dist' },
});
