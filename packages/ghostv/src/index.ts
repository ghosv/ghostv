import { init, h, thunk } from 'snabbdom'
import toVNode from 'snabbdom/tovnode'
import { VNode } from 'snabbdom/vnode'

import moduleClass from 'snabbdom/modules/class'
import moduleProps from 'snabbdom/modules/props'
import moduleStyle from 'snabbdom/modules/style'
import moduleEventListeners from 'snabbdom/modules/eventlisteners'

const patch = init([
    moduleClass,
    moduleProps,
    moduleStyle,
    moduleEventListeners
]);

//type H = typeof h

type FunctionalComponent = (/*h: H*/) => VNode

//abstract class Component {
//    abstract render(/*h: H*/): any
//}

type GhostComponent = FunctionalComponent //| Component

function buildVNode(comp: GhostComponent): VNode | undefined {
    if (comp as FunctionalComponent) {
        return (comp as FunctionalComponent)(/*h*/)
    }
}

function render(comp: GhostComponent, sel: any) {
    const dom = document.querySelector(sel)
    if (!dom) {
        throw `Selector(${sel}) not found`
    }
    const vnode = buildVNode(comp)
    if (vnode === undefined) {
        throw `Component is undefined`
    }
    console.log(vnode)
    patch(toVNode(dom), vnode)
}

export default {
    h,

    //Component,

    render
}
