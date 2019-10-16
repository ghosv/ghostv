import createStore from './createStore'

let state = []
let cursor = -1

function useReducer(reducer, initialState) {
  const current = cursor++
  const store = state[current] = (state[current] || initialState.dispatch ? initialState : createStore(reducer, initialState))
  return [store.getState(), store.dispatch.bind(store)]
}

useReducer.flush = () => cursor = -1

export default useReducer
