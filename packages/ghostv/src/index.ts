import { init, h, thunk } from 'snabbdom'
import toVNode from 'snabbdom/tovnode'
import { VNode, VNodeData } from 'snabbdom/vnode'

import moduleHero from 'snabbdom/modules/hero'
import moduleClass from 'snabbdom/modules/class'
import moduleProps from 'snabbdom/modules/props'
import moduleStyle from 'snabbdom/modules/style'
import moduleAttributes from 'snabbdom/modules/attributes'
import moduleEventListeners from 'snabbdom/modules/eventlisteners'

const patch = init([
    moduleHero,
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

function handleClassName(classNames: string | object): object {
    let cns = classNames
    if (typeof classNames === "string") {
        const a = classNames.split(" ")
        cns = {}
        a.forEach(v => (<any>cns)[v] = true)
    }
    return <object>cns
}

function createElement(comp: GhostComponent | string, props: VNodeData | VNodeData[] | VNode[] = {}, children: VNode[] = []): VNode {
    if (props.reduce && props.length > 0 && (props[0].vnode || typeof props[0] === "string")) {
        children = props
        props = {}
    }
    if (props.reduce) {
        props = (<VNodeData[]>props).reduce<VNodeData>((o: VNodeData, v: VNodeData) => {
            const {
                hero: oHero = {},
                class: oClass = {},
                style: oStyle = {},
                // props: oProps = {},
                attrs: oAttrs = {},
                on: oOn = {},
                hook: oHook = {},
                dataset: oData = {},
            }: any = o // TODO: use type check
            const {
                id: vID, // string | undefined
                class: vClass1,
                className: vClass2,
                style: vStyle = {},
                attrs: vAttrs = {},
                on: vOn = {},
                hook: vHook = {},
                data: vData1 = {},
                "data-": vData2 = {},
                dataset: vData3 = {},
                ...vs
            } = v
            return {
                hero: {
                    id: vID ? vID : oHero.id,
                },
                class: Object.assign(
                    oClass,
                    vClass1 ? handleClassName(vClass1) : {},
                    vClass2 ? handleClassName(vClass2) : {},
                ),
                style: Object.assign(oStyle, vStyle),
                attrs: Object.assign(oAttrs, vAttrs, vs),
                on: Object.assign(oOn, vOn),
                hook: Object.assign(oHook, vHook),
                dataset: Object.assign(oData, vData1, vData2, vData3),
            }
        }, {})
    }
    console.log(props)
    let c = undefined
    switch (typeof comp) {
        case "string":
            const sel = <string>comp
            c = h(sel, props, children)
            break
        case "function":
            const Component = <FunctionalComponent>comp
            c = Component({ ...props, children })
            break
        default:
            throw `Component(${comp}) is undefined`
    }
    c.vnode = true
    return c
}

export default {
    createElement,

    render
}
