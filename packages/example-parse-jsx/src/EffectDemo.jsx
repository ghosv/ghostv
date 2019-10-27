import GhostV, {
    useState,
    useEffect,
} from "@ghostv/ghostv"

// Virtual API
let STATUS = false
let FN = null
const API = {
    subscribe(fn) {
        FN = fn
        console.log("subscribing")
        setTimeout(() => {
            console.log("subscribed")
            FN && FN(STATUS)
        }, 3000)
    },
    unsubscribe() {
        FN(null)
        FN = undefined
    },
    publish(status) {
        STATUS = status ? true : false
        console.log("publish")
        setTimeout(() => {
            console.log("published")
            FN && FN(STATUS)
        }, 3000)
    }
}

function useStatus() {
    const [isOnline, setIsOnline] = useState(null)
    const handleStatusChange = (status) => {
        setIsOnline(status)
    }
    useEffect(() => {
        API.subscribe(handleStatusChange)
        return () => {
            console.log(cleanup)
            API.unsubscribe()
        }
    })
    if (isOnline === null) {
        return 'Loading...'
    }
    return isOnline ? 'Online' : 'Offline'
}

const Display = () => {
    const tips = useStatus()
    return <div>
        <div>Tips: {tips}</div>
    </div>
}
export default () => {
    return <div>
        <Display />
        <button onClick={API.publish(true)}>Set Online</button>
        <button onClick={API.publish(false)}>Set Offline</button>
    </div>
}
