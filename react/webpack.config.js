var webpack = require('webpack');

module.exports = {

    devtool: "source-map",
    entry:'./src/App.js',


    output:{
        path:__dirname+'/public/',
        filename:"bundle.js"
    },

    devServer:{
        hot: true,  // 파일이 수정될때 마다 리로딩
        inline: true,  // 핫로딩 에서 필요한 웹팩 데브서브의 클라이언트를 번들에 같이 넣어주는거
        host:'0.0.0.0',  // 서버 리슨 주소
        port: 4000,
        contentBase:__dirname +'/public/',
    },

    module:{
        loaders:[{
            test:/\.jsx?$/,
            loader:'babel-loader',
            exclude: /node_modules/,

            query:{
                cacheDirectory: true,
                presets: ['es2015','stage-0','react'],
                plugins: ["react-hot-loader/babel"]
            }
        }]
    },

    plugins : [
        new webpack.HotModuleReplacementPlugin()    //webpack HMR 지원 플러그인
    ]
};
