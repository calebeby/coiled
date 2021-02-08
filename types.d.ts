import preact from 'preact'

declare global {
  const h: typeof preact.h
  const Fragment: typeof preact.Fragment

  namespace JSX {
    // @ts-ignore
    interface IntrinsicElements extends preact.JSX.IntrinsicElements {}
    // @ts-ignore
    interface IntrinsicAttributes extends preact.JSX.IntrinsicAttributes {}
    // @ts-ignore
    interface Element extends preact.JSX.Element {}
    // @ts-ignore
    interface ElementClass extends preact.JSX.ElementClass {}
    interface ElementAttributesProperty
      extends preact.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute
      extends preact.JSX.ElementChildrenAttribute {}
    interface CSSProperties extends preact.JSX.CSSProperties {}
    interface SVGAttributes extends preact.JSX.SVGAttributes {}
    interface PathAttributes extends preact.JSX.PathAttributes {}
    interface TargetedEvent extends preact.JSX.TargetedEvent {}
    interface DOMAttributes<Target extends EventTarget>
      extends preact.JSX.DOMAttributes<Target> {}
    interface HTMLAttributes<RefType extends EventTarget = EventTarget>
      extends preact.JSX.HTMLAttributes<RefType> {}
  }
}
export {}
