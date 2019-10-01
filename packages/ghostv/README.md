# @ghostv/ghostv

ghostv frontend framework

## Usage

```jsx
import G, { useState } from 'ghostv'

const C = () => {
    const [ v, setV ] = useState(0)
    return <div>
        <span title={v}>times</span>
        <button onClick={() => setV(v+1)}>Click me!</button>
    </div>
}

G.render("#app", () => <div>
    <h1>Hello World!</h1>
    <C />
</div>)
```
