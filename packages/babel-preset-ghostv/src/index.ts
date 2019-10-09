import babelPluginTransformGhostvJsx from "@ghostv/babel-plugin-transform-snabbdom-jsx"

export default (_, { jsx = false } = {}) => {
    return {
        plugins: [
            jsx && babelPluginTransformGhostvJsx,
        ].filter(Boolean),
    }
}
