'use strict';

var path = require('path'),
  webpack = require('webpack'),
  globals = require('./lib/globals/global-vars');

module.exports = {
  mode: 'none',
  entry: {
    backbrace: ['./packages/backbrace-core/src/backbrace.js']
  },
  devtool: 'source-map',
  devServer: {},
  output: {
    library: 'backbrace',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      'jquery': 'modules/jquery/dist/jquery.js',
      'moment': 'modules/moment/moment.js',
      'sweetalert': 'modules/sweetalert/dist/sweetalert-dev.js',
      'modules': path.join(__dirname, './node_modules')
    }
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(globals.get(true)),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
};
