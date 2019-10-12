// https://segmentfault.com/a/1190000018365511
// https://www.webpackjs.com/configuration/devtool/#devtool
// 如果是开发环境，即 mode: 'development'，用 devtool: 'cheap-module-eval-source-map' 比较好，
// 如果是生产环境，即 mode: 'production'，用 devtool: 'cheap-module-source-map' 比较好。

const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'production',
    devtool: 'source-map',

    devServer: {
        port: 3000
    },

    entry: './src/index.jsx',

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },

    plugins: [
        new HTMLPlugin({ // 打包输出HTML
            title: 'Example',
            minify: { // 压缩HTML文件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true, // 删除空白符与换行符
                minifyCSS: true// 压缩内联css
            },
            filename: 'index.html',
            template: 'index.html'
        }),
    ],
}