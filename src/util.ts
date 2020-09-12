export class Delay {
  c: null | ((r: () => void) => void);
  constructor(time: number) {
    this.c =
      time > 0
        ? (r: () => void) => {
            setTimeout(r, time);
          }
        : null;
  }
  sleep() {
    return this.c && new Promise(this.c);
  }
}
