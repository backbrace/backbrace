'use strict';

var path = require('path'),
  webpack = require('webpack'),
  globals = require('./lib/globals/global-vars'),
  versionInfo = require('./lib/version-info/version-info.js'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  CopyPlugin = require('copy-webpack-plugin'),
  replace = require('buffer-replace'),
  MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

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
        'highlight.js': 'npm/highlight.js/lib/highlight.js',
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
        include: 'backbrace.min.js'
      }),
      new webpack.DefinePlugin(globals.get(devmode)),
      new MiniCssExtractPlugin({
        filename: 'styles/[name].css',
        chunkFilename: 'styles/[name].css'
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }),
      new MonacoWebpackPlugin({
        languages: ['typescript', 'javascript', 'css']
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
          from: './node_modules/@types/jquery/*', to: 'typings', flatten: true
        }
      ])
    ]
  };
};
