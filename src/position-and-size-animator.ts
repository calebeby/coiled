import { Animator } from './animated'

// TODO: getBoundingClientRect() doesn't handle scrolling well

export const positionAndSizeAnimator: Animator<
  [x: number, y: number, scaleX: number, scaleY: number]
> = {
  measureTarget(el, [, , oldWidth = 1, oldHeight = 1]) {
    el.style.transform = ''
    const targetRect = el.getBoundingClientRect()
    return [targetRect.x, targetRect.y, el.offsetWidth, el.offsetHeight]
  },
  applyFrame(el, [x, y, widthPx, heightPx]) {
    if (Math.abs(x) < 0.1) x = 0
    if (Math.abs(y) < 0.1) y = 0
    const currentRect = el.getBoundingClientRect()
    let width = currentRect.width / widthPx
    if (Math.abs(width) < 0.1) width = 0
    // console.log(`translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`)
    el.style.transform = `translate(${x}px, ${y}px) scale(${width}, ${1})`
  },
  numAxes: 4,
}
