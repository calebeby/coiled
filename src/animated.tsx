import { useEffect, useLayoutEffect, useRef } from 'preact/hooks'

export interface Animator<State> {
  getInitialState(now: number, alpha: number, beta: number): State
  onTargetChange(el: HTMLElement, state: State, now: number): void
  applyFrame(el: HTMLElement, state: State, now: number): void
}
type ElementProps<El extends keyof JSX.IntrinsicElements> = Omit<
  JSX.IntrinsicElements[El],
  'ref' | 'as' | 'key'
>
type AnimatedProps<
  El extends keyof JSX.IntrinsicElements
> = ElementProps<El> & {
  el: El
  animators: Animator<any>[]
}

export type ODEParameters = [
  /** Starting time */
  t0: number,
  /** Target value */
  target: number | undefined,
  /** Equation Parameter: Alpha */
  alpha: number,
  /** Equation Parameter: Beta */
  beta: number,
  /** Equation Parameter: c1 */
  c1: number,
  /** Equation Parameter: c2 */
  c2: number,
]

/** To be called when the target changes (or may have changed) */
export const computeODEParameters = (
  target: number,
  oldParams: ODEParameters,
): ODEParameters => {
  const now = performance.now()
  let x0 = 0
  let v0 = 0
  const [, oldTarget, alpha, beta] = oldParams
  if (oldTarget !== undefined) {
    x0 = oldTarget + computePositionAtTime(now, oldParams) - target
    v0 = computeVelocityAtTime(now, oldParams)
  }
  return [
    now, // t0
    target,
    alpha,
    beta,
    x0, // c1
    (v0 - alpha * x0) / beta, // c2
  ]
}

export const computePositionAtTime = (
  time: number,
  [t0, _target, alpha, beta, c1, c2]: ODEParameters,
) => {
  const t = (time - t0) / 1000
  return (
    Math.exp(alpha * t) * (c1 * Math.cos(beta * t) + c2 * Math.sin(beta * t))
  )
}

export const computeVelocityAtTime = (
  time: number,
  [t0, _target, alpha, beta, c1, c2]: ODEParameters,
) => {
  const t = (time - t0) / 1000
  return (
    Math.exp(alpha * t) *
    (Math.sin(beta * t) * (alpha * c2 - beta * c1) +
      Math.cos(beta * t) * (alpha * c1 + beta * c2))
  )
}

export const Animated = <El extends keyof JSX.IntrinsicElements>({
  el,
  animators,
  ...props
}: AnimatedProps<El>) => {
  const elRef = useRef<HTMLElement>()
  const El = el as any
  const animatorStates = useRef<any[]>(new Array(animators.length)).current

  const b = 27.8
  const m = 1
  const k = 200

  // const b = 0.0001
  // const m = 0.00003
  // const k = 0.99

  const alpha = -b / (2 * m)
  const beta = (b ** 2 - 4 * m * k) / (2 * m)

  if (beta >= 0) throw new Error('spring is overdamped, try increasing k')

  // Whenever it rerenders set the target
  useLayoutEffect(() => {
    let i = 0,
      animator,
      now = performance.now()
    while ((animator = animators[i])) {
      if (animatorStates[i] === undefined)
        animatorStates[i] = animator.getInitialState(now, alpha, beta)
      animator.onTargetChange(elRef.current, animatorStates[i], now)
      i++
    }
  })

  useLayoutEffect(() => {
    elRef.current.style.transform = `translate(var(--translate-x), var(--translate-y)) scale(var(--scale-x), var(--scale-y))`
    elRef.current.style.setProperty('--translate-x', '0')
    elRef.current.style.setProperty('--translate-y', '0')
    elRef.current.style.setProperty('--scale-x', '1')
    elRef.current.style.setProperty('--scale-y', '1')
  }, [])

  useEffect(() => {
    const animate: FrameRequestCallback = (time) => {
      let i = 0,
        animator,
        now = performance.now()
      while ((animator = animators[i])) {
        animator.applyFrame(elRef.current, animatorStates[i], now)
        i++
      }

      rafId = requestAnimationFrame(animate)
    }
    let rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return <El {...props} ref={elRef} />
}
