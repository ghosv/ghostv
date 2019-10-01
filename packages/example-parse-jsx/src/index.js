import GhostV from "@ghostv/ghostv"

//class A {
//
//}
function A() {
    return <button style="color: red;" />
}

function comp() {
    return <div id="app">
        <h1 data-d="line">Hello World!</h1>
        <span className="good">--- --- ---</span>
        {/*
        <A onClick=""></A>
        */}
    </div>
}

GhostV.render(comp, "#app")
