export function newStateStorage(updateGhostV: Function) {
  const state: any[] = []
  let cursor = -1

  function useState(initialState: any) {
    const current = ++cursor
    // console.log(state, cursor)
    const setter = (value: any) => {
      state[current] = typeof value === 'function' ? value() : value
      Promise
        .resolve(state[current])
        .then(() => useState.flush() && updateGhostV())
    }
    return [state[current] || initialState, setter]
  }
  useState.flush = () => cursor = -1

  return useState
}

export default newStateStorage(() => {
  const { updateGhostV: fn } = <any>window
  fn && fn()
})
