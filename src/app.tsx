import { useEffect, useState } from 'preact/hooks'
import { Animated, AnimateParent } from './animated'
import { positionAnimator, sizeAnimator } from './position-and-size-animator'

const useKey = (expectedKey: string, cb: () => void) => {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const { key } = event
      if (key === expectedKey) {
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

  useKey(' ', () => {
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

  useKey(() => {
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

interface Card {
  title: string
  content: string
}

interface CardProps extends Card {
  onClick: () => void
  expanded: boolean
  animateId?: any
}

const Card = ({ title, content, onClick, expanded, animateId }: CardProps) => {
  return (
    <Animated
      el={expanded ? 'div' : 'button'}
      animators={[positionAnimator, sizeAnimator]}
      class={`card ${expanded ? 'expanded' : ''}`}
      onClick={onClick}
      animateId={animateId}
    >
      <h1>{title}</h1>
      {expanded && <p>{content}</p>}
    </Animated>
  )
}

const cards: Card[] = [
  { title: 'Hello', content: 'This is some text for hello' },
  { title: 'Goodbye', content: 'This is some text for goodbye' },
  { title: '1234', content: 'no text here' },
  { title: 'hi', content: 'who said what?' },
  { title: 'hmmmm', content: 'what is a day' },
]

const CardExpandExample = () => {
  const [expandedCard, setExpandedCard] = useState<Card | null>(null)
  return (
    <AnimateParent>
      <div class="example card-example">
        <div class="card-list">
          {cards.map((card) =>
            expandedCard === card ? (
              <div class="card placeholder" />
            ) : (
              <Card
                expanded={false}
                key={card.title}
                title={card.title}
                content={card.content}
                onClick={() => setExpandedCard(card)}
                animateId={card}
              />
            ),
          )}
        </div>
        {expandedCard && (
          <Card
            expanded
            title={expandedCard.title}
            content={expandedCard.content}
            animateId={expandedCard}
            onClick={() => setExpandedCard(null)}
            key={expandedCard.title}
          />
        )}
      </div>
    </AnimateParent>
  )
}

const TransformCompositionExample = () => {
  const [toggle, setToggle] = useState(false)
  useKey('k', () => setToggle((t) => !t))
  return (
    <div class="example transformation-composition-example">
      <Animated
        el="div"
        animators={[]}
        class={`box ${toggle ? 'toggled' : ''}`}
        onClick={() => setToggle((t) => !t)}
      >
        Contents
      </Animated>
    </div>
  )
}

export const App = () => {
  return (
    <>
      {/*<WidthExample />,
      <PositionExample />,
      <CardExpandExample />*/}
      <TransformCompositionExample />
    </>
  )
}
