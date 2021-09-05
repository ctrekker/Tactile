const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        // static: {
        //     directory: path.join(__dirname, 'public')
        // },
        compress: true,
        allowedHosts: [
            'localhost',
            '.ngrok.io'
        ],
        port: 9000
    }
});
