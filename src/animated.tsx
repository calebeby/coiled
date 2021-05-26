import { createContext } from 'preact'
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'preact/hooks'

export interface Animator<State> {
  getInitialState(now: number, alpha: number, beta: number): State
  onTargetChange(el: HTMLElement, state: State): void
  isDone(now: number, state: State): boolean
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
  animateId?: any
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
  /** Time after which oscillation stops */
  endTime: number,
]

/**
 * After the oscillations decrease to below this threshold,
 * stop the oscillations entirely. Units are the same as the positional units (usualy px)
 */
const oscillationEndThreshold = 0.4

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
  const c1 = x0
  const c2 = (v0 - alpha * x0) / beta

  const endTime =
    c1 === 0
      ? 0
      : (1000 *
          Math.log(
            Math.abs(
              oscillationEndThreshold / (c1 * Math.sqrt(c2 ** 2 / c1 ** 2 + 1)),
            ),
          )) /
          alpha +
        now
  return [
    now, // t0
    target,
    alpha,
    beta,
    c1,
    c2,
    endTime,
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

const globalState = new Map<any, any[]>()

// TODO: memory leak, never cleaned up
const makeStateGetter = (state: Map<any, any[]>) => (
  animateId: any,
  numAnimators: number,
) => {
  return (
    state.get(animateId) ||
    state.set(animateId, new Array(numAnimators)).get(animateId)
  )
}

const animateContext = createContext(makeStateGetter(globalState))

export const AnimateParent = ({ children }: { children: any }) => {
  const getter = useMemo(() => makeStateGetter(new Map<any, any[]>()), [])
  return (
    <animateContext.Provider value={getter}>{children}</animateContext.Provider>
  )
}

export const Animated = <El extends keyof JSX.IntrinsicElements>({
  el,
  animators,
  animateId,
  ...props
}: AnimatedProps<El>) => {
  const elRef = useRef<HTMLElement>()
  const El = el as any
  const symbol = useMemo(() => Symbol(), [])
  const id = animateId === undefined ? symbol : animateId
  const animatorStates = useContext(animateContext)(id, animators.length)!

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
      animator.onTargetChange(elRef.current, animatorStates[i])
      i++
    }
  })

  useLayoutEffect(() => {
    elRef.current.style.transform = `translate(var(--translate-x, 0), var(--translate-y, 0)) scale(var(--scale-x, 1), var(--scale-y, 1))`

    // TODO: see if these properties actually improve anything
    elRef.current.style.willChange = 'transform'
  }, [])

  useEffect(() => {
    const animate: FrameRequestCallback = () => {
      let i = 0,
        animator,
        now = performance.now()
      while ((animator = animators[i])) {
        const state = animatorStates[i]
        if (!animator.isDone(now, state))
          animator.applyFrame(elRef.current, state, now)
        i++
      }

      rafId = requestAnimationFrame(animate)
    }
    let rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return <El {...props} ref={elRef} />
}
