import GhostV from "@ghostv/ghostv"

//class A extends GhostV.Component {
//    render() {
//        return <button style="color: red;" />
//    }
//}
//function A() {
//    return <button style="color: red;" />
//}

function comp() {
    const scope = {
        list: [
            <A onClick=""></A>,
            "xxoo",
            //<A.comp></A.comp>
        ],
        tAttrs: {
            "data-a": true,
        },
        styles: {
            width: "100%"
        }
    }
    const listeners = {
        mouseMove: () => {
            alert(1)
        }
    }
    return <div
        id="app"
        className="a b"
        on={listeners}
        onClick={() => alert(0)}
        data-value={"id"+0}
        data-abc
        style={scope.styles}
        {...scope.tAttrs}
    >
        <input value="666"/>
        <h1 data-d="line">Hello World!</h1>
        <span className="good">--- --- ---</span>
        { ...scope.list }
    </div>
}

GhostV.render(comp, "#app") // TODO: replace with mount/unmount
