'use strict';

var path = require('path'),
  webpack = require('webpack'),
  globals = require('./lib/globals/global-vars'),
  versionInfo = require('./lib/version-info/version-info.js'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.get = function(devmode) {
  return {
    cache: !devmode,
    mode: devmode ? 'none' : 'production',
    entry: {
      backbrace: ['./packages/backbrace-core/src/backbrace.js']
    },
    devtool: 'source-map',
    devServer: {},
    resolve: {
      alias: {
        'jquery': 'npm/jquery/dist/jquery.js',
        'jquery-ui': 'npm/jquery-ui-dist/jquery-ui.js',
        'moment': 'npm/moment/moment.js',
        'sweetalert': 'npm/sweetalert/dist/sweetalert-dev.js',
        'npm': path.join(__dirname, './node_modules'),
        'modules': path.join(__dirname, './modules')
      }
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|png)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash].[ext]',
              publicPath: '../'
            }
          }]
        },
        (!devmode ?
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {
                  'targets': {
                    'browsers': [
                      'last 2 versions',
                      'ie >= 9'
                    ]
                  },
                  'useBuiltIns': 'usage'
                }]],
                plugins: [
                  '@babel/plugin-transform-runtime',
                  '@babel/plugin-syntax-dynamic-import'
                ]
              }
            }
          } : {})
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'async',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: function(module) {
              var packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return packageName.replace('@', '');
            }
          }
        }
      }
    },
    plugins: [
      new webpack.BannerPlugin({
        banner:
          '@license ' + versionInfo.currentPackage.name + ' v' + versionInfo.currentVersion.full +
          '\n' + versionInfo.currentPackage.author +
          '\nLicense: ' + versionInfo.currentPackage.license,
        entryOnly: true,
        include: 'backbrace.js'
      }),
      new webpack.DefinePlugin(globals.get(devmode)),
      new webpack.HashedModuleIdsPlugin(),
      new MiniCssExtractPlugin({
        filename: 'styles/[name].css',
        chunkFilename: 'styles/[name].[contenthash:8].css'
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  };
};
