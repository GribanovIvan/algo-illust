// Cancelling rejects the pending frame so the algorithm exits at its next await.
export default function createAnimation(delay: number) {
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let rejectFrame: ((error: Error) => void) | undefined;
  let waiting = 0;
  return {
    get cancelled() { return cancelled; },
    get waiting() { return waiting; },
    async wait() {
      if (cancelled) throw new Error('Animation cancelled');
      const start = performance.now();
      await new Promise<void>((resolve, reject) => {
        rejectFrame = reject;
        timer = setTimeout(resolve, Math.max(0, delay));
      });
      waiting += performance.now() - start;
    },
    cancel() {
      cancelled = true;
      clearTimeout(timer);
      rejectFrame?.(new Error('Animation cancelled'));
    },
  };
}
