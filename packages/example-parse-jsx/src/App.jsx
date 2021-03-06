import GhostV, {
    useState,
    useRef,
} from "@ghostv/ghostv"

const Input = ({ add }) => {
    const [v, setV] = useState('')
    return <div>
        <input value={v} onChange={({ target: { value } }) => setV(value)} />
        <button onClick={() => {
            add({ v, done: false })
            setV('')
        }}>+</button>
    </div>
}

export default () => {
    const [list, update] = useState([])
    const add = (item) => {
        update([...list, item])
    }
    
    const [mode, setMode] = useState(0)
    const showList = ((list) => {
        switch (mode) {
            case 0: return list
            case 1: return list.filter(e => e.done)
            case 2: return list.filter(e => !e.done)
        }
    })(list.map((item, index) => ({index, ...item})))

    const todoList = showList.map(({index, ...item}) => {
        return <li>
            <span onClick={() => {
                list[index].done = true
                update(list)
            }}>{item.done ? '[x]' : '[ ]'} {item.v}</span>
            <span onClick={() => {
                list.splice(index, 1)
                update(list)
            }} style="border: 1px solid red;border-radius: 50%;margin-left: 20px;">X</span>
        </li>
    })
    return <div id="app" style="margin-top: 100px;margin-left: 50px;">
        <Input add={add} />
        <button onClick={() => { setMode(0) }}>All</button>
        <button onClick={() => { setMode(1) }}>Done</button>
        <button onClick={() => { setMode(2) }}>TODO</button>
        <ul>
            {todoList}
        </ul>
    </div>
}
