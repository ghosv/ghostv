import GhostV from "@ghostv/ghostv"

//class A extends GhostV.Component {
//    render() {
//        return <button style={{"color": "red"}} />
//    }
//}
function A() {
    return <button style={{"color": "red"}} />
}
A.comp = (props, children) => {
    console.log(children, props)
    return <div onClick={props["on-click"]}>Comp{children}</div>
}

function Comp() {
    const scope = {
        list: [
            <A></A>,
            "xxoo",
            <A.comp x on-click={() => alert(5)}>1</A.comp>,
            <A.comp y>2</A.comp>,
        ],
        tAttrs: {
            "data-a": true,
        },
        styles: {
            width: "100%"
        }
    }
    const listeners = {
        mousemove: () => {
            console.log(1)
        }
    }
    
    
    /*
        on-click={() => alert(0)} */
    return <div
        className="a b"
        on={listeners}
        data-value={"id"+0}
        data-abc
        style={scope.styles}
        {...scope.tAttrs}
    >
        <input value="666"/>
        <h1 data-d="line">Hello World!</h1>
        <span className="good">--- --- ---</span>
        { scope.list }
    </div>
}

GhostV.render(<div id="app">
    <Comp />
</div>, "#app") // TODO: replace with mount/unmount
