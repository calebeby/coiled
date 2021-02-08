import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'

export const App = () => {
  const [items, setItems] = useState([1, 2, 3, 4])
  // const [items, setItems] = useState([1, 2])

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const { key } = event
      if (key === ' ') {
        // setItems((i) => i.slice().reverse())
        setItems((i) => {
          i.unshift(i.pop()!)
          return i.slice()
        })
      }
    }

    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [])

  return (
    <>
      {items.map((item) => {
        return (
          <Animated
            el="div"
            key={item}
            class="square"
            animators={[positionAnimator]}
            style={{
              background:
                item === 1
                  ? 'red'
                  : item === 2
                  ? 'green'
                  : item === 3
                  ? 'purple'
                  : 'blue',
            }}
          >
            {item}
          </Animated>
        )
      })}
    </>
  )
}

const positionAnimator: Animator<[number, number]> = {
  measureTarget(el) {
    el.style.transform = `translate(0, 0)`
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

interface Animator<AnimateAxes extends number[]> {
  measureTarget(element: HTMLElement): AnimateAxes
  applyFrame(element: HTMLElement, axes: AnimateAxes): void
  numAxes: AnimateAxes['length']
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

const Animated = <El extends keyof JSX.IntrinsicElements>({
  el,
  animators,
  ...props
}: AnimatedProps<El>) => {
  const elRef = useRef<HTMLElement>()
  const El = el as any

  // Whenever it rerenders set the target
  useLayoutEffect(() => {
    let i = 0
    for (const animator of animators) {
      const targets = animator.measureTarget(elRef.current)
      for (const target of targets) {
        setTarget(target, i++)
      }
    }
  })

  const setTarget = (target: number, i: number) => {
    if (targetRef.current[i] === target) return
    const now = performance.now()
    const oldTarget = targetRef.current[i]
    let x0 = 0
    let v0 = 0
    if (oldTarget !== undefined) {
      x0 = oldTarget + computePositionAtTime(now, i) - target
      v0 = computeVelocityAtTime(now, i)
    }
    c1Ref.current[i] = x0
    c2Ref.current[i] = (v0 - alpha * x0) / beta
    t0Ref.current[i] = now
    targetRef.current[i] = target
  }

  const b = 27.8
  const m = 1
  const k = 200

  const alpha = -b / (2 * m)
  const beta = (b ** 2 - 4 * m * k) / (2 * m)

  if (beta >= 0) throw new Error('spring is overdamped, try increasing k')

  const t0Ref = useRef<number[]>([])
  const c1Ref = useRef<number[]>([])
  const c2Ref = useRef<number[]>([])
  const targetRef = useRef<number[]>([])

  const computePositionAtTime = (time: number, i: number) => {
    const t = (time - t0Ref.current[i]) / 1000
    const c1 = c1Ref.current[i]
    const c2 = c2Ref.current[i]
    return (
      Math.exp(alpha * t) * (c1 * Math.cos(beta * t) + c2 * Math.sin(beta * t))
    )
  }

  const computeVelocityAtTime = (time: number, i: number) => {
    const t = (time - t0Ref.current[i]) / 1000
    const c1 = c1Ref.current[i]
    const c2 = c2Ref.current[i]
    return (
      Math.exp(alpha * t) *
      (Math.sin(beta * t) * (alpha * c2 - beta * c1) +
        Math.cos(beta * t) * (alpha * c1 + beta * c2))
    )
  }

  useEffect(() => {
    const animate: FrameRequestCallback = (time) => {
      let i = 0
      for (const animator of animators) {
        const tweened = []
        while (tweened.length < animator.numAxes) {
          tweened.push(computePositionAtTime(time, i++))
        }
        animator.applyFrame(elRef.current, tweened)
      }

      rafId = requestAnimationFrame(animate)
    }
    let rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return <El {...props} ref={elRef} />
}
