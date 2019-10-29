import GhostV, {
    useReducer,
    useContext,
    useState,
    useEffect,
    useRef,
    ghostVApp,
} from "@ghostv/ghostv"

GhostV.render(<div>
    {{
        // $$typeof: Symbol.for("ghost.element"),
        type: 'div',
        props: {
            children: [
                "Hello World!"
            ],
        },
        key: null,
    }}
</div>, "#app")

import App from "./App"
import EffectDemo from "./EffectDemo"

//GhostV.render(<App />, "#app")
//let unmount = GhostV.render(<App />, "#app")
//if (module.hot) {
//    module.hot.accept(["./App.jsx"], () => {
//        console.log("TODO")
//        unmount()
//        const App = require("./App.jsx")
//        unmount = GhostV.render(<App />, "#app")
//    })
//}

function GG({ children, ...props }) {
    const [v, setV] = app.useState(0)
    // console.log("GG", props, children, v, setV)
    return <div data-g>
        GG: {v}
        <button onClick={() => setV(v + 1)}>++</button>
    </div>
}
const app = ghostVApp(<div id="happ">
    <GG />
    <GG />
</div>)
function H({ children, ...props }) {
    // console.log("H", props, children)
    return <div data-h>
        <button onClick={() => app.mount("#happ")}>mount</button>
        <button onClick={() => app.unmount()}>unmount</button>
        <div id="happ"></div>
    </div>
}

function G({ children, ...props }) {
    const [v, setV] = useState(0)
    console.log("G", props, children, v, setV)
    return <div data-g>
        G: {v}
        <button onClick={() => setV(v + 1)}>++</button>
    </div>
}
const ctx = GhostV.createContext(0);
function EE({ value: { v, setV } }) {
    return <button onClick={() => setV(v + 1)}>++</button>
}
function E({ children, ...props }) {
    console.log("E", props, children)
    return <div data-e>
        <F />
    </div>
}
function F({ children, ...props }) {
    console.log("F", props, children)
    const FF = ({ value: { v } }) => {
        // console.log("FF", v)
        return <div data-ff={v}>
            {`value: ${v}`}
        </div>
    }
    return <ctx.Consumer>
        <FF />
        {({ value: { v } }) => v}
    </ctx.Consumer>
}
function D({ children, ...props }) {
    console.log("D", props, children)
    const [v, setV] = useState(10)
    return <ctx.Provider value={{ v, setV }}>
        <div>---------------createContext----------------------</div>
        <E />
        <ctx.Consumer>
            <EE />
        </ctx.Consumer>
        <div>--------------------------------------------------</div>
    </ctx.Provider>
}

function A({ children, ...props }) {
    // console.log("A", props, children)
    return <button className="A" data-a onClick={props.onClick}>
        A {children}
    </button>
}
function B({ children, ...props }) {
    // console.log("B", props, children)
    return [
        <div key="b1" className="B" data-b>
            B1
        </div>,
        <div key="b2" className="B" data-b>
            B2
        </div>,
    ]
}
function C({ children, ...props }) {
    // console.log("C", props, children)
    return <div className="C" style={props.style} data-c>
        <div>111111111111</div>
        {children}
        <div>222222222222</div>
        {children[2]}
        <div>111111111111</div>
        {children[1]}
        <div>222222222222</div>
        {children[0]}
        <div>111111111111</div>
    </div>
}

// GhostV.render(<div id="app">
//     <H />
//     <G />
//     <G />
//     <D />
//     xx<br />
//     <A key={1} onClick={(e) => console.log("A1", e)} >111</A>
//     <A key={2} onClick={(e) => console.log("A2", e)} >222</A>
//     <B hookInit={console.log("init B")} >
//         Hello World!
//     </B>
//     <C style="width: 100%" >
//         <span style={{ minWidth: "100px" }}>Hello</span>
//         <span className={{ cc: true }}>World</span>
//         <B></B>
//     </C>
// </div>, "#app")
