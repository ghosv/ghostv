import {
  VNode,
  VNodeData,
} from 'snabbdom/vnode'
import {
  Key,
  GhostVElement,
  GhostVPortal,
  GhostVNode,
} from './define'

const modules: any = {
  attrs: '',
  props: '',
  class: '',
  data: 'dataset',
  style: '',
  hook: '',
  on: ''
}

import * as fn from './fn'

function flatten<P>(arr: (P | P[])[]): P[] {
  const ret: P[] = []
  arr.forEach(el => {
    if (Array.isArray(el)) {
      ret.push(...el)
      return
    }
    ret.push(el)
  })
  return ret
}

function elsToVNodeArray(arr: GhostVNode[]): VNode[] {
  const tmp = <(VNode | VNode[])[]>(arr
    .map(el => elToVNode(el))
    .filter(e => e !== undefined))
  return flatten<VNode>(tmp)
}
export default function elToVNode(el: GhostVNode): VNode | VNode[] | undefined {
  // console.log("elToVNode", el)
  if (el === undefined || el === null /*|| Object.keys(el).length === 0*/) {
    return undefined
  }
  if (typeof el === 'number' || typeof el === 'string' || typeof el === 'boolean') {
    return createTextElement(el)
  }
  if (Array.isArray(el)) {
    const arr = el.map(e => elToVNode(e))
    return <VNode[]>arr.filter(e => e !== undefined)
  }

  return transformElement(<GhostVElement | GhostVPortal>el)
}
function transformElement(el: GhostVElement): VNode | VNode[] | undefined {
  const { type, props: { children: arr, ...props }, key } = el
  // console.log("comp", type, props, arr, key)
  if (typeof type === "function") {
    const comp = type({ children: arr, ...props })
    if (!comp) {
      return undefined
    }
    if (Array.isArray(comp)) {
      const tmp = <(VNode | VNode[])[]>(comp
        .map(c => transformComp(c))
        .filter(e => e !== undefined))
      return flatten<VNode>(tmp)
    }
    return transformComp(comp, key)
  }
  const children = elsToVNodeArray(<GhostVNode[]>arr)
  const text = sanitizeText(<any[]>children)
  return considerSvg({
    sel: type,
    data: transformData(props),
    children: text ? undefined : sanitizeChildren(<any[]>children),
    text,
    elm: undefined,
    key: key ? key : undefined,
  })
}
function transformComp(comp: GhostVElement, key?: Key | null) {
  if (typeof comp === 'object') {
    comp.key = key ? key : null
  }
  return elToVNode(comp)
  //const { children, ...ps } = comp.props
  //return {
  //  sel: <string>comp.type,
  //  data: transformData(ps),
  //  children: elsToVNodeArray(children),
  //  text: undefined,
  //  elm: undefined,
  //  key: key ? key : (comp.key ? comp.key : undefined),
  //}
}
function transformData(props: any): VNodeData {
  if (props) {
    const keys = Object.keys(props)
    keys.forEach(k => {
      let prop = k
      const prefix = ["on", "hook"].find(el => prop.startsWith(el))
      if (prefix && prefix !== prop) {
        prop = prop.replace(new RegExp(`^${prefix}\-?`), '')
        prop = prop[0].toLowerCase() + prop.substr(1)
        if (k !== prop) {
          props[prefix] || (props[prefix] = {})
          props[prefix][prop] = props[k]
          delete props[k]
        }
      }
    });

    if (typeof props.className !== "string") {
      props.class = props.className
      delete props.className
    }

    if (typeof props.style === "string") {
      const styles = (<string>props.style).split(";")
      const style: any = {}
      styles.forEach(el => {
        const [k, v] = el.trim().split(":")
        if (k && v) {
          let keys = k.trim().split("-")
          keys = keys.map((v, i) => {
            if (i === 0) {
              return v
            }
            return v[0].toUpperCase() + v.substr(1)
          })
          style[keys.join("")] = v.trim()
        }
      })
      props.style = style
    }
  }
  const data = props ? sanitizeData(props) : {}
  // console.log("transform", props, "=>", data)
  return data ? data : {}
}

const createTextElement = (text: any): VNode | undefined => {
  // console.log('createTextElement', `<${typeof text}>${text}`)
  return !(typeof text === 'number' || typeof text === 'string' || typeof text === 'boolean')
    ? undefined
    : {
      sel: undefined,
      data: undefined,
      children: undefined,
      elm: undefined,
      text: `${text}`,
      key: undefined,
    }
}

interface VVNode {
  sel: string
  data: VNodeData
  children: Array<VNode | string>
  text: string
}
const isVNode = (vnode: any): VVNode | undefined =>
  typeof vnode === 'object' &&
    vnode !== null &&
    'sel' in vnode &&
    'data' in vnode &&
    'children' in vnode &&
    'text' in vnode
    ? vnode
    : undefined
const svgPropsMap = {
  svg: 1, circle: 1, ellipse: 1, line: 1, polygon: 1,
  polyline: 1, rect: 1, g: 1, path: 1, text: 1
}
const isSVG = (v: any): VVNode | undefined => v.sel in svgPropsMap ? v : undefined

const considerSvg = (vnode: VNode): VNode => <VNode>_considerSvg(vnode)
const _considerSvg = (node: VNode | string): VNode | string => {
  const vnode = isSVG(node)
  // console.log("_considerSvg", vnode)
  if (vnode && vnode.data === undefined) {
    console.warn("数据异常", vnode) // TODO:
  }
  return vnode && vnode.data !== undefined
    ? fn.assign(vnode,
      {
        data: fn.omit('props', fn.extend(vnode.data,
          {
            ns: 'http://www.w3.org/2000/svg', attrs: fn.omit('className', fn.extend(vnode.data.props,
              { class: vnode.data.props ? vnode.data.props.className : undefined }
            ))
          }
        ))
      },
      {
        children: vnode.children === undefined ? undefined :
          vnode.children.map((child) => _considerSvg(child))
      }
    )
    : node
}

const rewrites: any = {
  for: 'attrs',
  role: 'attrs',
  tabindex: 'attrs',
  'aria-*': 'attrs',
  key: null
}

const rewriteModules = (data: VNode, modules: any) => fn.mapObject(data, (key, val) => {
  const inner = { [key]: val }
  if (rewrites[key] && modules[rewrites[key]] !== undefined) {
    return { [rewrites[key]]: inner }
  }
  if (rewrites[key] === null) {
    return {}
  }
  const keys = Object.keys(rewrites)
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]
    if (k.charAt(k.length - 1) === '*' && key.indexOf(k.slice(0, -1)) === 0 && modules[rewrites[k]] !== undefined) {
      return { [rewrites[k]]: inner }
    }
  }
  if (modules[key] !== undefined) {
    return { [modules[key] ? modules[key] : key]: val }
  }
  if (modules.props !== undefined) {
    return { props: inner }
  }
  return inner
})

const sanitizeData = (data: VNodeData) => considerSvg(rewriteModules(fn.deepifyKeys(data, modules), modules))
//const sanitizeData = (data: VNodeData) => {
//  const step1 = fn.deepifyKeys(data, modules)
//  const step2 = rewriteModules(step1, modules)
//  const step3 = considerSvg(step2)
//  console.log("sanitizeData", data, modules, step1, step2, step3)
//  return step3
//}

const sanitizeText = (children: any[]) =>
  children.length > 1 ||
    !(typeof children[0] === 'string' || typeof children[0] === 'number')
    ? undefined
    : `${children[0]}`

const sanitizeChildren = (children: any[]) =>
  fn.reduceDeep(children, (acc, child) => {
    const vnode = isVNode(child) ? child : createTextElement(child)
    acc.push(vnode)
    return acc
  }, [])
