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
    const listeners = {}
    const props = {
        abc: "123",
        class: {
            b: true
        }
    }
    const handle = () => console.log("handle")
    const init = () => console.log("init")
    return <div
    on={listeners}
        id="demo"
        className="a n"
        style={{width: "100px"}}
        test={{...props}}
        onClick={handle}
        hookInit={init}
        data-v="666"
        { ...props }
    >
        <div>
            <span>1.1cccvbb</span>
            <span>1.2</span>
            <span>1.3</span>
        </div>
        <div>2</div>
        <div>3</div>
    </div>
    /* want:
        createElement("A#demo.a", {
            id: "demo", // direct
            className: { // 合并
                b: true
            },
            style: { // direct

            },

            props: {
                test: {...props}
            },
            //attrs: {},

            on: { // onClick, etc...
                click: handle
            },
            hook: { // hookInit, etc...
                init: init
            },
            dataset: { // data-v, etc...
                v: "666"
            }
        }, ["xxx"])
    */

    /*
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
    */
}

GhostV.render(comp, "#app") // TODO: replace with mount/unmount
