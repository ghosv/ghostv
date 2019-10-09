import { init, h, thunk } from 'snabbdom'
import toVNode from 'snabbdom/tovnode'
import { VNode, VNodeData } from 'snabbdom/vnode'

import moduleClass from 'snabbdom/modules/class'
import moduleProps from 'snabbdom/modules/props'
import moduleStyle from 'snabbdom/modules/style'
import moduleAttributes from 'snabbdom/modules/attributes'
import moduleEventListeners from 'snabbdom/modules/eventlisteners'

const patch = init([
    moduleClass,
    moduleProps,
    moduleStyle,
    moduleAttributes,
    moduleEventListeners
]);

interface ComponentArgs extends VNodeData {
    children: VNode[]
}
type FunctionalComponent = (args: ComponentArgs) => VNode

//abstract class Component {
//    abstract render(): VNode
//}
type GhostComponent = FunctionalComponent //| Component
interface GhostNode {
    sel: string;
    children: GhostElement[] | undefined;
}
type GhostElement = GhostNode | string

function render(comp: GhostComponent, el: any) {
    const dom = document.querySelector(el)
    if (!dom) {
        throw `Selector(${el}) not found`
    }
    const node = comp()//createElement(comp, {})
    console.log(node)
    patch(toVNode(dom), node)
}

function createElement(comp: GhostComponent | string, props: VNodeData | VNodeData[], ...children: VNode[]): VNode {
    if (props.reduce) {
        props = (<VNodeData[]>props).reduce<VNodeData>((o: VNodeData, v: VNodeData) => {
            // TODO: namespace 智能合并
            // var modulesNS = [<'hook'>,
            // 'on', 'style', 'class', 'props', 'attrs', 'dataset'];
            /**
             * class
             * props
             * attrs
             * dataset
             * style
             * on
             */
            const { on: oOn = {}, ...os } = o
            const { on: vOn = {}, ...vs } = v
            return Object.assign(os, vs, {
                on: Object.assign(oOn, vOn)
            });
        }, {})
    }
    if (typeof comp === 'string') {
        const sel = <string>comp
        return h(sel, props, children)
    }
    if (typeof comp === 'function') {
        const Component = <FunctionalComponent>comp
        return Component({ ...props, children })
    }
    throw `Component(${comp}) is undefined`
}

export default {
    createElement,

    render
}
