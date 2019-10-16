let state = []
let cursor = -1

function useContext(context) {
  return { state: {}, dispatch: () => { } }
  const current = cursor++
  const store = state[current] = (state[current] || context)
  return { state: store.getState(), dispatch: store.dispatch.bind(store) }
}

useContext.flush = () => cursor = -1

export default useContext
