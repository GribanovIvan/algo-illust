// Built modules live under <deployment>/assets/, development entry under <deployment>/src/.
// Resolve from the module URL, so refreshing a nested route keeps the deployment prefix.
export function getRouterBase(moduleUrl: string) {
  const pathname = new URL(moduleUrl).pathname;
  const marker = pathname.lastIndexOf('/assets/') >= 0 ? '/assets/' : '/src/';
  const index = pathname.lastIndexOf(marker);
  return index < 0 ? '/' : pathname.slice(0, index) || '/';
}

export const routerBase = getRouterBase(import.meta.url);
