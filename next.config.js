// next.config.js
const path = require('path');
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const withCSS = require('@zeit/next-css');

const config = {
  webpack: config => {
    config.module.rules.push({
      test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 8192,
          publicPath: "/_next/static/",
          outputPath: "static/",
          name: "[name].[ext]"
        }
      }
    });
    return config;
  }
};

module.exports = withPlugins(
  [withImages, withFonts, withCSS({
    webpack: function (config, { isServer }) {
      config.resolve.alias["server"] = path.join(__dirname, "server");
      config.module.rules.push({
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif|ico)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]'
          }
        }
      });
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty',
          net: 'empty'
        }
      }
      return config
    }
  })],
  config
);