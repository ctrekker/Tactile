const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: true,
        allowedHosts: [
            'localhost',
            '.ngrok.io'
        ],
        port: 9000
    }
};
