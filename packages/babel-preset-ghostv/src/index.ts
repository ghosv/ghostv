import babelPluginTransformGhostvJsx from "@ghostv/babel-plugin-transform-ghostv-jsx"

export default (_, { jsx = false } = {}) => {
    return {
        plugins: [
            jsx && babelPluginTransformGhostvJsx,
        ].filter(Boolean),
    }
}
