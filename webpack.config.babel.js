import * as path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import SystemBellPlugin from 'system-bell-webpack-plugin'
import merge from 'webpack-merge'
import packageImporter from 'node-sass-package-importer'
import autoprefixer from 'autoprefixer'

const pkg = require('./package.json')

const TARGET = process.env.npm_lifecycle_event || ''
const ROOT_PATH = __dirname
const config = {
  paths: {
    dist: path.join(ROOT_PATH, 'dist'),
    src: path.join(ROOT_PATH, 'src'),
    docs: path.join(ROOT_PATH, 'docs')
  },
  filename: 'react-component',
  library: 'ReactComponent',
  autoprefix: {
    browsers: ['> 5%', 'last 2 versions', 'ie > 9']
  }
}

process.env.BABEL_ENV = TARGET

const common = {
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss', '.png']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: [
          config.paths.docs,
          config.paths.src
        ],
        options: {
          configFile: path.resolve('./.eslintrc')
        }
      },
      {
        test: /\.md$/,
        loaders: ['catalog/lib/loader', 'raw-loader']
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000&mimetype=image/png',
        include: config.paths.docs
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader',
        include: config.paths.docs
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        include: path.join(ROOT_PATH, 'package.json')
      }
    ]
  },
  plugins: [
    new SystemBellPlugin()
  ]
}

const siteCommon = {
  plugins: [
    new HtmlWebpackPlugin({
      template: require('html-webpack-template'),
      inject: false,
      mobile: true,
      title: pkg.name,
      appMountId: 'app'
    }),
    new webpack.DefinePlugin({
      NAME: JSON.stringify(pkg.name),
      USER: JSON.stringify(pkg.user),
      VERSION: JSON.stringify(pkg.version)
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer(config.autoprefix)
        ]
      }
    })
  ]
}

if (TARGET === 'start') {
  module.exports = merge(common, siteCommon, {
    devtool: 'source-map',
    entry: {
      docs: [config.paths.docs]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"'
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          use: [
            {loader: 'style-loader'},
            {loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {loader: 'postcss-loader'},
            {loader: 'sass-loader',
              options: {
                importer: packageImporter(),
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.jsx?$/,
          loaders: 'babel-loader?cacheDirectory',
          include: [
            config.paths.docs,
            config.paths.src
          ],
          exclude: /node_modules/
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      host: process.env.HOST,
      port: process.env.PORT,
      stats: 'errors-only',
      watchOptions: {
        ignored: /node_modules/
      }
    }
  })
}

const distCommon = {
  devtool: 'source-map',
  output: {
    path: config.paths.dist,
    libraryTarget: 'umd',
    library: config.library
  },
  entry: config.paths.src,
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: 'babel-loader',
        include: config.paths.src
      }
    ]
  },
  plugins: [
    new SystemBellPlugin()
  ]
}

if (TARGET === 'dist') {
  module.exports = merge(distCommon, {
    output: {
      filename: `${config.filename}.js`
    }
  })
}

if (TARGET === 'dist:min') {
  module.exports = merge(distCommon, {
    output: {
      filename: `${config.filename}.min.js`
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  })
}

if (!TARGET) {
  module.exports = common
}
