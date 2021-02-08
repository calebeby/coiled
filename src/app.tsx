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

type ElementProps<El extends keyof JSX.IntrinsicElements> = Omit<
  JSX.IntrinsicElements[El],
  'ref' | 'as' | 'key'
>
type AnimatedProps<
  El extends keyof JSX.IntrinsicElements
> = ElementProps<El> & { el: El }

const Animated = <El extends keyof JSX.IntrinsicElements>({
  el,
  ...props
}: AnimatedProps<El>) => {
  const elRef = useRef<HTMLElement>()
  const El = el as any

  // Whenever it rerenders set the target
  useLayoutEffect(() => {
    elRef.current.style.transform = `translateX(0px)`
    const targetRect = elRef.current.getBoundingClientRect()
    setTarget(targetRect.x)
  })

  const setTarget = (target: number) => {
    if (targetRef.current === target) return
    const now = performance.now()
    const oldTarget = targetRef.current
    let x0 = 0
    let v0 = 0
    if (oldTarget !== undefined) {
      x0 = oldTarget + computePositionAtTime(now) - target
      v0 = computeVelocityAtTime(now)
    }
    c1Ref.current = x0
    c2Ref.current = (v0 - alpha * x0) / beta
    t0Ref.current = now
    targetRef.current = target
  }

  const b = 28
  const m = 1
  const k = 200

  const alpha = -b / (2 * m)
  const beta = (b ** 2 - 4 * m * k) / (2 * m)

  if (beta >= 0) throw new Error('spring is overdamped, try increasing k')

  const t0Ref = useRef(0)
  const c1Ref = useRef(0)
  const c2Ref = useRef(0)
  const targetRef = useRef<number>()

  const computePositionAtTime = (time: number) => {
    // TODO: not divide by 1000?
    const t = (time - t0Ref.current) / 1000
    const c1 = c1Ref.current
    const c2 = c2Ref.current
    return (
      Math.exp(alpha * t) * (c1 * Math.cos(beta * t) + c2 * Math.sin(beta * t))
    )
  }

  const computeVelocityAtTime = (time: number) => {
    // TODO: not divide by 1000?
    const t = (time - t0Ref.current) / 1000
    const c1 = c1Ref.current
    const c2 = c2Ref.current
    return (
      Math.exp(alpha * t) *
      (Math.sin(beta * t) * (alpha * c2 - beta * c1) +
        Math.cos(beta * t) * (alpha * c1 + beta * c2))
    )
  }

  useEffect(() => {
    const animate: FrameRequestCallback = (time) => {
      let x = computePositionAtTime(time)
      if (Math.abs(x) < 0.1) x = 0
      elRef.current.style.transform = `translateX(${x}px)`

      rafId = requestAnimationFrame(animate)
    }
    let rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return <El {...props} ref={elRef} />
}
