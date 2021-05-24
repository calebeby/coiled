import {
  Animator,
  computeODEParameters,
  computePositionAtTime,
  ODEParameters,
} from './animated'

interface SizeAnimatorState {
  width: ODEParameters
  height: ODEParameters
}

export const sizeAnimator: Animator<SizeAnimatorState> = {
  getInitialState(now, alpha, beta) {
    return {
      width: [now, undefined, alpha, beta, 0, 0, 0],
      height: [now, undefined, alpha, beta, 0, 0, 0],
    }
  },
  onTargetChange(el, state) {
    el.style.setProperty('--scale-x', '')
    el.style.setProperty('--scale-y', '')
    const rect = el.getBoundingClientRect()
    const targetWidth = rect.width
    const targetHeight = rect.height
    state.width = computeODEParameters(targetWidth, state.width)
    state.height = computeODEParameters(targetHeight, state.height)
  },
  isDone(now, state) {
    return now > state.height[6] && now > state.width[6]
  },
  applyFrame(el, state, now) {
    const targetWidth = state.width[1]!
    const targetHeight = state.height[1]!
    const currentWidth = computePositionAtTime(now, state.width) + targetWidth
    const currentHeight =
      computePositionAtTime(now, state.height) + targetHeight

    // el.style.transform = `
    //   scale(${currentWidth / targetWidth},${currentHeight / targetHeight})`

    el.style.setProperty('--scale-x', String(currentWidth / targetWidth))
    el.style.setProperty('--scale-y', String(currentHeight / targetHeight))

    for (const child of el.children) {
      if (child instanceof HTMLElement) {
        child.style.transform = `scale(${targetWidth / currentWidth},${
          targetHeight / currentHeight
        })`
        child.style.transformOrigin = `top left`
      }
    }
  },
}

interface PositionAnimatorState {
  x: ODEParameters
  y: ODEParameters
  parentX: number
  parentY: number
}

export const positionAnimator: Animator<PositionAnimatorState> = {
  getInitialState(now, alpha, beta) {
    return {
      x: [now, undefined, alpha, beta, 0, 0, 0],
      y: [now, undefined, alpha, beta, 0, 0, 0],
      parentX: 0,
      parentY: 0,
    }
  },
  onTargetChange(el, state) {
    el.style.setProperty('--translate-x', '')
    el.style.setProperty('--translate-y', '')
    const parentRect = el.parentElement!.getBoundingClientRect()
    // Using the parent's bounding box
    // so that if you scroll, the scroll offset is handled correctly
    // This is a little naive, it probably doesn't work for:
    // - Nested scrolling containers
    // - Animations which change which parent an element has
    // - Nested animated elements
    const parentX = parentRect.x
    const parentY = parentRect.y
    const rect = el.getBoundingClientRect()
    const targetX = rect.x + rect.width / 2 - parentX
    const targetY = rect.y + rect.height / 2 - parentY
    state.parentX = parentX
    state.parentY = parentY
    state.x = computeODEParameters(targetX, state.x)
    state.y = computeODEParameters(targetY, state.y)
  },
  isDone(now, state) {
    return now > state.x[6] && now > state.y[6]
  },
  applyFrame(el, state, now) {
    const currentX = computePositionAtTime(now, state.x)
    const currentY = computePositionAtTime(now, state.y)

    el.style.setProperty('--translate-x', `${currentX}px`)
    el.style.setProperty('--translate-y', `${currentY}px`)
  },
}
