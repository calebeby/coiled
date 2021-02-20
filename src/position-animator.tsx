import { Animator } from './animated'

// TODO: getBoundingClientRect() doesn't handle scrolling well

export const positionAnimator: Animator<[x: number, y: number]> = {
  measureTarget(el) {
    el.style.transform = ''
    const targetRect = el.getBoundingClientRect()
    return [targetRect.x, targetRect.y]
  },
  applyFrame(el, [x, y]) {
    if (Math.abs(x) < 0.1) x = 0
    if (Math.abs(y) < 0.1) y = 0
    el.style.transform = `translate(${x}px, ${y}px)`
  },
  numAxes: 2,
}
