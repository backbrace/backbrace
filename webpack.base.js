'use strict';

var webpack = require('webpack'),
  globals = require('./tools/utils/global-vars'),
  versionInfo = require('./tools/utils/package-info.js'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  CopyPlugin = require('copy-webpack-plugin'),
  replace = require('buffer-replace'),
  EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');

exports.get = function(devmode) {
  return {
    cache: !devmode,
    mode: devmode ? 'development' : 'production',
    entry: {
      Backbrace: ['./packages/backbrace-core/src/backbrace.js']
    },
    devtool: 'source-map',
    devServer: {},
    output: {
      library: 'LIB',
      libraryTarget: 'var',
      filename: '[name].js',
      chunkFilename: '[name].js'
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
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              publicPath: '../'
            }
          }]
        },
        {
          test: /\.(svg|png)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
              publicPath: '../'
            }
          }]
        },
        !devmode ?
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env',
                  {
                    'targets': {
                      'esmodules': true
                    }
                  }]]
              }
            }
          } : {}
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'async',
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
      new EsmWebpackPlugin({
        exclude: function(fileName, chunk) {
          return fileName !== 'Backbrace.js';
        }
      }),
      new webpack.BannerPlugin({
        banner:
          '@license ' + versionInfo.currentPackage.name + ' v' + versionInfo.currentVersion.full +
          '\n' + versionInfo.currentPackage.author +
          '\nLicense: ' + versionInfo.currentPackage.license,
        entryOnly: true,
        include: 'Backbrace.js'
      }),
      new webpack.DefinePlugin(globals.get(devmode)),
      new MiniCssExtractPlugin({
        filename: 'styles/[name].css',
        chunkFilename: 'styles/[name].css'
      }),
      new CopyPlugin([
        {
          from: './packages/backbrace-core/include/*', flatten: true, transform: function(content, path) {
            return replace(content, 'FULLVERSION', versionInfo.currentVersion.full);
          }
        },
        {
          from: './packages/backbrace-devkit/typings/*', to: 'typings', flatten: true
        },
        {
          from: './node_modules/cash-dom/dist/cash.d.ts', to: 'typings', flatten: true
        }
      ])
    ]
  };
};
