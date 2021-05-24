import { useEffect, useState } from 'preact/hooks'
import { Animated } from './animated'
import { positionAnimator, sizeAnimator } from './position-and-size-animator'

const useSpacebar = (cb: () => void) => {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const { key } = event
      if (key === ' ') {
        event.preventDefault()
        cb()
      }
    }

    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [])
}

const PositionExample = () => {
  const [items, setItems] = useState([1, 2, 3, 4])
  // const [items, setItems] = useState([1, 2])

  useSpacebar(() => {
    // setItems((i) => i.slice().reverse())
    setItems((i) => {
      i.unshift(i.pop()!)
      return i.slice()
    })
  })

  return (
    <div class="example position-example">
      {items.map((item) => {
        return (
          <Animated
            el="div"
            key={item}
            class="square"
            animators={[positionAnimator]}
            style={{
              '--color':
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
    </div>
  )
}

const WidthExample = () => {
  const [position, setPosition] = useState(false)

  useSpacebar(() => {
    setPosition((p) => !p)
  })

  return (
    <div class="example width-example">
      <Animated
        el="div"
        animators={[positionAnimator, sizeAnimator]}
        style={
          position
            ? { gridColumn: '1 / span 1', gridRow: '1 / span 1' }
            : { gridColumn: '2 / span 2', gridRow: '2 / span 2' }
        }
      >
        <h1>This is some text</h1>

        <p>
          We choose to go to the moon. We choose to go to the moon in this
          decade and do the other things, not because they are easy, but because
          they are hard, because that goal will serve to organize and measure
          the best of our energies and skills, because that challenge is one
          that we are willing to accept, one we are unwilling to postpone, and
          one which we intend to win, and the others, too.
        </p>
      </Animated>
    </div>
  )
}

export const App = () => {
  return ([<WidthExample />, <PositionExample />] as any) as JSX.Element
}
