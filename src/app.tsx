import { useEffect, useState } from 'preact/hooks'
import { Animated } from './animated'
import { positionAndSizeAnimator } from './position-and-size-animator'
import { positionAnimator } from './position-animator'

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
  // const [items, setItems] = useState([1, 2, 3, 4])
  const [items, setItems] = useState([1, 2])

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
        animators={[positionAndSizeAnimator]}
        style={
          position ? {} : { gridColumn: '2 / span 2', gridRow: '2 / span 2' }
        }
      />
    </div>
  )
}

export const App = () => {
  return [
    <WidthExample />,
    // <PositionExample />,
  ]
}
