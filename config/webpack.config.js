var webpack = require('webpack');
var path = require('path');
var WriteFilePlugin = require('write-file-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BASE_DIR = path.resolve('/var', 'lib', 'eventkit', 'eventkit_cloud', 'ui', 'static', 'ui')
var BUILD_DIR = path.resolve(BASE_DIR, 'build');
var APP_DIR = path.resolve(BASE_DIR, 'app');

var PROD = JSON.parse(process.env.PROD || false);
var devtool = 'inline-source-map';
var plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin(),
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js', Infinity),
];
if(PROD) {
    plugins.push(new webpack.optimize.AggressiveMergingPlugin());
    plugins.push(new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}}));
    plugins.push(new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}));
    devtool = 'source-map';
}

var config = {
    devtool: devtool,
    entry: {
        app: [
            'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
            'webpack/hot/dev-server', // "only" prevents reload on syntax errors
            APP_DIR + '/index.js'
        ],
        vendor: ['material-ui', 'openlayers']
    },
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: '/static/ui/build/'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /staticfiles/],
                loader: ['babel-loader'],
                query: {
                    presets: ["es2015", "react", "stage-0"]
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file'
            },
            {
                test: /\.css$/,
                loader: 'style-loader'
            }, {
                test: /\.css$/,
                loader: 'css-loader',
                query: {
                    modules: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                }
            },
            {
                test: /\.(woff2?|ttf|eot|svg)$/,
                loader: 'url-loader?limit=100000',
                options: {
                    name: 'fonts/[hash].[ext]',
                }
            }
        ],
    },
    plugins: plugins,
    devServer: {
        hot: true,
        contentBase: BASE_DIR,
        outputPath: BUILD_DIR,
        host: "0.0.0.0",
        port: 8080,
        historyApiFallback: true,
    },
    watchOptions: {
        poll: true
    },
};

module.exports = config;