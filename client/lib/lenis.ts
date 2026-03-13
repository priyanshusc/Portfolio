import Lenis from "@studio-freight/lenis";

export const lenis = new Lenis({
  duration: 1.2,
  wheelMultiplier: 1,
  // smoothTouch: true,
  touchMultiplier: 2,
  //  smoothWheel: false,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
