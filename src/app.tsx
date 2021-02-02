import {
  h,
  Fragment,
  JSX,
  Ref,
  createContext,
  Component,
  createRef,
} from 'preact'
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'preact/hooks'

export const App = () => {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [items, setItems] = useState(['first', 'second', 'third'])

  return (
    <AnimateSharedLayout>
      <h1>Coiled</h1>
      {openItem === null ? (
        <>
          <ul>
            {items.map((item) => {
              return (
                <Item key={item} name={item} onOpen={() => setOpenItem(item)} />
              )
            })}
          </ul>
          <button
            onClick={() => setItems((items) => [...items.slice(1), items[0]])}
          >
            Shuffle
          </button>
        </>
      ) : (
        <div class="item">
          <h1>{openItem}</h1>
          <p>Random contents</p>
          <button onClick={() => setOpenItem(null)}>Close</button>
        </div>
      )}
    </AnimateSharedLayout>
  )
}

const Item = ({ name, onOpen }: { name: string; onOpen: () => void }) => {
  return (
    <Animate layoutId={name}>
      {(ref) => (
        <li ref={ref}>
          <button onClick={onOpen}>{name}</button>
        </li>
      )}
    </Animate>
  )
}

const SharedLayoutContext = createContext(new Map<string, null>())

const AnimateSharedLayout = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element
}) => {
  const snapshots = new Map<string, null>()
  return (
    <SharedLayoutContext.Provider value={snapshots}>
      {children}
    </SharedLayoutContext.Provider>
  )
}

interface MeasureProps {
  children: (ref: Ref<HTMLElement>) => JSX.Element
  layoutId: string
}

class Measure extends Component<MeasureProps> {
  ref = createRef<HTMLElement>()

  getSnapshotBeforeUpdate() {
    console.log('getSnapshotBeforeUpdate')
  }

  render({ children }: MeasureProps) {
    return children(this.ref)
  }
}

const Animate = () => {
  return <Measure>{children(this.ref)}</Measure>
}
