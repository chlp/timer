const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            jquery: './jquery-3.1.1.js'
        }
    }
};
