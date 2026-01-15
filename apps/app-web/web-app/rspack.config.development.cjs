const { merge } = require('webpack-merge');
const path = require("path");
const config = require('./rspack.config.cjs');
const { TsCheckerRspackPlugin } = require('ts-checker-rspack-plugin');
const ReactRefreshRspackPlugin = require("@rspack/plugin-react-refresh");

module.exports = () => {
    return merge(config(), {
        mode: 'development',
        devtool: 'source-map',
        entry: {
            machine: {
                import: path.resolve('./src/index.tsx'),
                dependOn: ['react-vendors']
            },
            apparatus: {
                import: path.resolve('../../packages/apparatus/src/index.ts'),
                dependOn: ['react-vendors']
            },
            ['tinker-chest']: {
                import: path.resolve('../../packages/tinker-chest/src/index.ts'),
                dependOn: ['react-vendors']
            },
            gears: {
                import: path.resolve('../../packages/gears/src/index.ts'),
                dependOn: ['react-vendors']
            },
            ui: {
                import: path.resolve('../../ui/src/index.ts'),
                dependOn: ['react-vendors']
            },
            ['web-ui']: {
                import: path.resolve('../web-ui/src/index.ts'),
                dependOn: ['react-vendors']
            },
            'react-vendors': ['react', 'react-dom']
        },
        module: Object.assign({}, config.module, {
            rules: [
                {
                    test: /\.module\.css$/,
                    exclude: /node_modules/,
                    use: [
                        'style-loader',
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                modules: {
                                    mode: "local",
                                    localIdentName: "[name]---[local]---[hash:base64:5]",
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    exclude: [/node_modules/, /\.module\.css$/],
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                modules: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    include: /node_modules/,
                    use: ['style-loader', 'css-loader'],
                }
            ]
        }),
        stats: {
            errorDetails: true
        },
        plugins: [
            new ReactRefreshRspackPlugin({
                include: [/\.jsx$/, /\.tsx$/],
                exclude: [/node_modules/]
            }),
            new TsCheckerRspackPlugin(),
        ],
        devServer: {
            port: process.env.PORT || 3000,
            open: true,
            historyApiFallback: true,
            proxy: [
                {
                    context: ['/api'],
                    target: 'http://localhost:5000',
                    pathRewrite: { '^/api': '' },
                    secure: false,
                    changeOrigin: true,
                },
            ]
        },
    });
};
