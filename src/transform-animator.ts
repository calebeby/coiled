import {
  Animator,
  computeODEParameters,
  computePositionAtTime,
  ODEParameters,
} from './animated'

interface TransformAnimatorState {
  /** Top left */
  tl: ODEParameters
  /** Top right */
  tr: ODEParameters
  /** Bottom left */
  bl: ODEParameters
  /** Bottom right */
  br: ODEParameters
}

export const transformAnimator: Animator<TransformAnimatorState> = {
  getInitialState(now, alpha, beta) {
    return {
      tl: [now, undefined, alpha, beta, 0, 0, 0],
      tr: [now, undefined, alpha, beta, 0, 0, 0],
      bl: [now, undefined, alpha, beta, 0, 0, 0],
      br: [now, undefined, alpha, beta, 0, 0, 0],
    }
  },
  onTargetChange(el, state) {
    const el = $0 // TODO: remove
    el.style.transform = ''
    // We will find the position of the four corners (after transformations) and apply springs to them

    // TODO: This doesn't account for parents' transformations (esp. rotate, skew)
    const computedStyle = getComputedStyle(el)
    const transformationMatrix = new DOMMatrix(computedStyle.transform)
    const transformationOrigin = computedStyle.transformOrigin
    // where the transformations are applied from, relative to the top left
    const [x0, y0] = transformationOrigin.split(' ').map(parseFloat)
    // reset the transforms, measure the position
    const originalTransform = el.style.transform
    el.style.transform = 'none'
    const rect = el.getBoundingClientRect()
    el.style.transform = originalTransform
    // apply the transformations on the four corner points, relative to the transform origin
    const tl = transformationMatrix.transformPoint({
      x: -x0,
      y: -y0,
    })
    const tr = transformationMatrix.transformPoint({
      x: rect.width - x0,
      y: -y0,
    })
    const bl = transformationMatrix.transformPoint({
      x: -x0,
      y: rect.height - y0,
    })
    const br = transformationMatrix.transformPoint({
      x: rect.width - x0,
      y: rect.height - y0,
    })
    const origin_absolute_x = rect.x + x0
    const origin_absolute_y = rect.y + y0
    const origin_absolute = { x: origin_absolute_x, y: origin_absolute_y }
    // Why are x and y flipped?
    const tl_final = {
      y: tl.x + origin_absolute_x,
      x: tl.y + origin_absolute_y,
    }
    const tr_final = {
      y: tr.x + origin_absolute_x,
      x: tr.y + origin_absolute_y,
    }
    const bl_final = {
      y: bl.x + origin_absolute_x,
      x: bl.y + origin_absolute_y,
    }
    const br_final = {
      y: br.x + origin_absolute_x,
      x: br.y + origin_absolute_y,
    }
  },
  isDone(now, state) {
    return false
  },
  applyFrame(el, state, now) {
    const targetWidth = state.width[1]!
    const targetHeight = state.height[1]!
    const currentWidth = computePositionAtTime(now, state.width) + targetWidth
    const currentHeight =
      computePositionAtTime(now, state.height) + targetHeight
  },
}
