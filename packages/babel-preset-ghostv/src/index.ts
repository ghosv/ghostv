// import babelPluginTransformGhostvJsx from "@ghostv/babel-plugin-transform-snabbdom-jsx"
import transformJsx from "@babel/plugin-transform-react-jsx"

export default (_, { jsx = false } = {}) => {
    return {
        plugins: [
            jsx && [transformJsx, {
                pragma: 'GhostV.createElement'
            }], //babelPluginTransformGhostvJsx,
        ].filter(Boolean),
    }
}
