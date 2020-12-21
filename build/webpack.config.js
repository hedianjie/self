
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const resolve = (url) => {
    return path.join(__dirname, url);
}


const optionConfig = (() => {
    const entryInfo = {};
    const htmlInfo = [];
    
    const handler = (url, name) => {
        const dirArr = fs.readdirSync(resolve(url));
        if(dirArr.indexOf('index.js') != -1 && dirArr.indexOf('index.html') != -1) {

            entryInfo[name] = resolve(`${url}/index.js`);
            htmlInfo.push(
                new HtmlWebpackPlugin({
                    filename: 'view/' + name + '.html',
                    template: resolve(`${url}/index.html`),
                    inject: true,
                    hash: true,
                    chunks: ['vendors','common', name]
                })
            )
        }
    
        for(let i = 0 ; i < dirArr.length; i++) {
            const splitUrl = `${url}/${dirArr[i]}`;
            const splitName = name ? `${name}/${dirArr[i]}` : dirArr[i];
            const stat = fs.lstatSync(resolve(splitUrl));
            if(stat.isDirectory()) {
                handler(splitUrl, splitName)
            }
            continue;
        }
    }

    handler('../src/view')

    return {
        entryInfo,
        htmlInfo
    }
    
})();

module.exports = {

    entry: optionConfig.entryInfo,
    output: {
        filename: 'js/[name].js',
        path: resolve('../dist'),
        publicPath: '/'
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
            minChunks: 2,
            minSize: 10,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: -10
                },
                default: {
                    name: 'common',
                    minChunks: 2,
                    priority: -20
                }
            }
        }
    },

    module: {
        rules: [
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'images/[name]-[hash:5].[ext]',
                            limit: 10240
                        }
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name]-[hash:5].[ext]',
                            limit: 10240
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract( {
                    fallback: 'style-loader',
                    use: [
                        {loader: 'css-loader'},
                        {loader: 'postcss-loader'}
                    ]
                } )
            },
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /[\\/]node_module[\\/]/
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': resolve('../src')
        }
    },

    devServer: {
        contentBase: resolve('../'),
        hot: true,
        port: '8877',
        host: 'localhost',
        open: true,
        publicPath: '/'
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                resolve('../dist')
            ]
        }),
        ...optionConfig.htmlInfo,
        new CopyWebpackPlugin(
            [
                {
                    from: resolve('../src/assets/'),
                    to: resolve('../dist/assets/')
                }
            ]
        ),

        new ExtractTextWebpackPlugin('css/[name].css')
    ]

}