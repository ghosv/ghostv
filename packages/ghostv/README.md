# @ghostv/ghostv

ghostv frontend framework

## Usage

```jsx
import GhostV, { useState } from '@ghostv/ghostv' // GhostV must be imported !

const C = () => {
    const [ v, setV ] = useState(0)
    return <div>
        <span title={v}>times</span>
        <button onClick={() => setV(v+1)}>Click me!</button>
    </div>
}

GhostV.render(<div>
    <h1>Hello World!</h1>
    <C />
</div>, "#app")
```

TODO: 
+ [x] style string 支持
+ [x] comp
+ [ ] ctx
    + [x] 基本功能
    + [ ] 获取最近 Provider
+ [ ] hook in snabbdom
    + [x] useState
