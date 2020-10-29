export function sleep(ms: number) {
  return ms ? new Promise<void>(r => setTimeout(r, ms)) : null;
}
