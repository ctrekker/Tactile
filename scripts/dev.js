'use strict';

const WebpackDevServer = require('webpack-dev-server');
const config           = require('../webpack.config.js');
const webpack          = require('webpack');

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
    clientLogLevel    : 'warn',
    compress          : true,
    contentBase       : 'public',
    filename          : config.output.filename,
    historyApiFallback: true,
    hot               : true,
    inline            : true,
    lazy              : false,
    noInfo            : true,
    publicPath        : '/',
    quiet             : true,
    stats             : 'errors-only',
    watchOptions      : {
        aggregateTimeout: 300,
        poll            : 1000
    }
});

server.listen(8080, 'localhost', () => {
    console.log('Listening on port 8080');
});