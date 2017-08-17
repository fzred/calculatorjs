const webpack = require('webpack')
const join = require('path').join

const product = process.env.BABEL_ENV === 'product'

let filename = 'calc.js';
let path = join(__dirname, 'dist');
const plugins = []
const uglify = new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false, drop_console: true } })

if (product) {
    plugins.push(uglify)
    filename = 'calc.min.js'
    path = join(__dirname, 'dist')
}

const config = {
    context: __dirname,
    entry: join(__dirname, 'src', 'index.js'),
    output: {
        path: path,
        filename: filename,
        library: 'calc',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: plugins,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: { // 参数
                    presets: ['es2015', 'stage-2'],
                    plugins: ['transform-runtime'],
                }
            }
        ]
    },
}

module.exports = config
