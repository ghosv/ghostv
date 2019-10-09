// https://segmentfault.com/a/1190000018365511
// https://www.webpackjs.com/configuration/devtool/#devtool
// 如果是开发环境，即 mode: 'development'，用 devtool: 'cheap-module-eval-source-map' 比较好，
// 如果是生产环境，即 mode: 'production'，用 devtool: 'cheap-module-source-map' 比较好。

module.exports = {
    mode: 'production',
    devtool: 'source-map',

    entry: './src/index.jsx',

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
}