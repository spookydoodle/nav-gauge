const path = require("path");
const { merge } = require('webpack-merge');
const config = require('./rspack.config.cjs');
const rspack = require("@rspack/core");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => merge(config(env, argv), {
    mode: 'production',
    entry: {
        machine: path.resolve('./src/index.tsx')
    },
    target: 'web',
    module: Object.assign({}, config.module, {
        rules: [
            {
                test: /\.module\.css$/,
                exclude: /node_modules/,
                type: 'javascript/auto',
                use: [
                    {
                        loader: rspack.CssExtractRspackPlugin.loader,
                        options: {
                            esModule: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: process.env.NODE_ENV === "production" ? {
                                localIdentName: "[hash:base64:5]",
                            } : {
                                mode: "local",
                                localIdentName: "[name]---[local]---[hash:base64:5]"
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                exclude: [/node_modules/, /\.module\.css$/],
                type: 'javascript/auto',
                use: [
                    {
                        loader: rspack.CssExtractRspackPlugin.loader,
                        options: {
                            esModule: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
        ]
    }),
    optimization: {
        moduleIds: 'deterministic',
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'vendors-react',
                    priority: 2
                },
                maplibre: {
                    test: /[\\/]node_modules[\\/](maplibre-gl)[\\/]/,
                    name: 'vendors-maplibre',
                    priority: 2
                },
                node_modules: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors-node-modules',
                },
                apparatus: {
                    test: /[\\/]apparatus[\\/]src[\\/]/,
                    name: 'apparatus',
                },
                ['tinker-chest']: {
                    test: /[\\/]tinker-chest[\\/]src[\\/]/,
                    name: 'tinker-chest',
                },
                gears: {
                    test: /[\\/]gears[\\/]src[\\/]/,
                    name: 'gears',
                },
                ui: {
                    test: /[\\/](ui|ui-web)[\\/]src[\\/]/,
                    name: 'ui',
                },
            },
        },
        minimize: true,
        minimizer: [
            new rspack.SwcJsMinimizerRspackPlugin(),
            new rspack.LightningCssMinimizerRspackPlugin()
        ],
    },
    plugins: [
        new rspack.CssExtractRspackPlugin({ filename: "[name].[contenthash].css" }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
        })
    ],
    output: {
        publicPath: '/',
        filename: "[name].[contenthash].bundle.js",
        chunkFilename: '[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
});
