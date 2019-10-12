import GhostV from "@ghostv/ghostv"

//class A extends GhostV.Component {
//    render() {
//        return <button style={{"color": "red"}} />
//    }
//}
function A() {
    return <button style="min-width: 100px; max-height: 20px" />
}
A.comp = (props, children) => {
    console.log(children, props)
    return <div onClick={props.on ? props.on.click : null}>Comp{children}</div>
}

function Comp() {
    const scope = {
        list: [
            <A></A>,
            <span className={{c: true}}>666</span>,
            "xxoo",
            <A.comp x onClick={() => alert(5)}>1</A.comp>,
            <A.comp y on-click={() => alert(21)}>2</A.comp>,
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
    
    return <div
        className="a b"
        on={listeners}
        on-click={() => alert(0)}
        data-value={"id"+0}
        data-abc
        hook-init={() => {console.log("init")}}
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
