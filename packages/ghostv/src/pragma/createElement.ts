import {
  GhostVElement,
  GhostVNode,
  Component,
  Attributes,
} from './define'

export default function createElement<P extends {}>(
  type: Component<P> | string,
  props?: Attributes & P | null,
  ...children: (GhostVNode | Component<any>)[]): GhostVElement<P> {
  // console.log(type, props, children)
  const {
    key = null,
    ...ps
  } = props ? props : {}
  return {
    type,
    props: {
      children: children.map(child => {
        if (typeof child === 'function') {
          return createElement(<Component<any>>child)
        }
        return child
      }),
      ...<P>ps,
    },
    key,
  }
}
