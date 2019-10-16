import {
  useReducer,
  useContext,
  useState,
  newStateStorage,
  useEffect,
  useRef,
} from "./hooks"
export {
  useReducer,
  useContext,
  useState,
  useEffect,
  useRef,
}

import { VNode } from 'snabbdom/vnode'
import toVNode from 'snabbdom/tovnode'

import {
  createElement,
} from './pragma'
import {
  Component,
  GhostVElement,
} from './pragma/define'
import elToVNode from './pragma/transform'
import { patch } from './pragma/init'

export function ghostVApp<P extends {}>(element: GhostVElement<P>) {
  const point: any = {
    sel: "",
    origin: null,
    node: null,
  }
  const updateGhostV = () => {
    const { node: old } = point
    const node = <VNode>elToVNode(element)
    // console.log("updating", old, "=>", node)
    point.node = patch(old, node)
    // console.log("updated")
  }
  const useState = newStateStorage(updateGhostV)

  const unmount = () => {
    if (point.sel === "") {
      return
    }
    patch(point.node, toVNode(point.origin))
    point.sel = ""
    useState.flush()
  }
  const mount = (sel: string) => {
    if (point.sel !== "") {
      unmount()
    }
    const origin = document.querySelector(sel)
    if (!origin) {
      return `Selector(${sel}) not found`
    }
    point.sel = sel
    point.origin = origin
    const node = <VNode>elToVNode(element)
    point.node = patch(toVNode(origin), node)
  }
  return {
    updateGhostV,
    useState,
    mount,
    unmount,
  }
}

function render<P extends {}>(element: GhostVElement<P>, sel: string) {
  const { updateGhostV, mount } = ghostVApp(element);
  (<any>window).updateGhostV = updateGhostV
  mount(sel)
}

function createContext(defaultValue: any) {
  let v = defaultValue
  const Provider: Component<any> = ({ value, children, ...props }) => {
    console.log("Provider", value, children)
    v = value
    return !children ? [] : children.map((child: any) => {
      //child.props = {
      //  dispatch: store.dispatch,
      //  state: store.getState(),
      //  ...child.props
      //}
      return child
    })
  }
  const Consumer: Component<any> = ({ children, ...props }) => {
    console.log("Consumer", children)
    return !children ? [] : children.map((child: any) => {
      child.props = {
        ...child.props,
        value: v,
      }
      return child
    })
  }
  return {
    Provider,
    Consumer,
  }
}
export default {
  createElement,
  createContext,

  render,
  ghostVApp,
}
