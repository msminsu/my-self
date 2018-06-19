const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const promoConfig = require('./promo.config');

function banner() {
    let date = new Date();
    return [
        `@project: ${__dirname.split('/').pop()}`,
        `@author: NCSOFT`,
        '@update: ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    ].join('\n');
}

let config = {
    entry: {
        app: `${__dirname}/_src/js/${promoConfig.entry.js}`
    },

    output: {
        filename: '[name].js',
        path: `${__dirname}/js`
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-object-assign']
                },
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ]
            }
        ]
    },

    watchOptions: {
        poll: true,
        aggregateTimeout: 1000
    },

    plugins: [
        new webpack.BannerPlugin({
            banner: banner()
        }),
        new UglifyJSPlugin({
            sourceMap: true
        })
    ],

    devtool: 'source-map'
};

fs.readdirSync(`${__dirname}/_src/js`).forEach(file => {
    config.entry[file.replace(/\.js$/, '')] = `${__dirname}/_src/js/${file}`;
});

module.exports = config;