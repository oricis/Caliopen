const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

const DASHBOARD = process.env.DASHBOARD ? JSON.parse(process.env.DASHBOARD) : true;

const initialConfig = {
  entry: [],
  plugins: [],
  module: {
    preLoaders: [],
    loaders: [],
  },
};

const configureStylesheet = (config, filename = 'client.css', outputPath = 'assets/') => {
  const extractTextPlugin = new ExtractTextPlugin(outputPath + filename);
  const cfg = Object.assign({}, config, {
    sassLoader: {
      includePaths: [
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../node_modules/foundation-sites/scss'),
        path.resolve(__dirname, '../node_modules/font-awesome/scss'),
        path.resolve(__dirname, '../node_modules/react-redux-notify/src'),
      ],
    },
    sasslint: {
      configFile: path.resolve(__dirname, '../.sass-lint.yml'),
    },
  });
  cfg.plugins.push(
    extractTextPlugin,
    new OptimizeCssAssetsPlugin({
      canPrint: false,
    })
  );
  cfg.module.loaders.push(
    {
      test: /\.css$/,
      loader: extractTextPlugin.extract('style-loader', 'css-loader?sourceMap'),
    },
    {
      test: /\.scss$/,
      loader: extractTextPlugin.extract('style-loader', 'css-loader?sourceMap!sass-loader'),
    }
  );

  cfg.module.preLoaders.push({
    test: /\.scss$/,
    include: path.join(__dirname, '../src/'),
    loader: 'sasslint',
  });

  return cfg;
};

const configureAssets = (config, outputPath = 'assets/') => {
  config.module.loaders.push(
    {
      test: /\.(jpe?g|png|gif)$/i,
      loaders: [
        `file-loader?hash=sha512&digest=hex&name=[name].[ext]&outputPath=${outputPath}`,
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
      ],
    },
    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: `file-loader?mimetype=image/svg+xml&name=[name].[ext]&outputPath=${outputPath}` },
    { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: `file-loader?mimetype=application/font-woff&name=[name].[ext]&outputPath=${outputPath}` },
    { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: `file-loader?mimetype=application/font-woff&name=[name].[ext]&outputPath=${outputPath}` },
    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: `file-loader?mimetype=application/octet-stream&name=[name].[ext]&outputPath=${outputPath}` },
    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: `file-loader?name=[name].[ext]&outputPath=${outputPath}` }
  );

  return config;
};

module.exports = {
  configureStylesheet,
  configureAssets,
  getBase: (buildTarget) => {
    const plugins = [
      new webpack.DefinePlugin({
        BUILD_TARGET: JSON.stringify(buildTarget),
        HAS_HMR: process.env.HAS_HMR || true,
        HAS_SSR: process.env.HAS_SSR || true,
        CALIOPEN_ENV: JSON.stringify(process.env.NODE_ENV),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ];
    if (DASHBOARD) {
      plugins.push(new DashboardPlugin());
    }

    return Object.assign(initialConfig, {
      plugins,
      module: Object.assign(initialConfig.module, {
        loaders: [
          {
            test: /\.jsx?$/,
            include: path.join(__dirname, '../src/'),
            loaders: ['babel-loader', 'eslint-loader'],
          },
        ],
      }),
      resolve: {
        extensions: ['', '.js', '.jsx'],
      },
    });
  },
};
