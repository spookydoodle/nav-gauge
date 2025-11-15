const path = require("path");
const rspack = require("@rspack/core");

module.exports = () => ({
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        fallback: {
            url: require.resolve("url"),
        }
    },
    module: {
        rules: [
            {
                test: /\.[jt]s?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                                tsx: true,
                            },
                            transform: {
                                react: {
                                    runtime: 'automatic',
                                },
                            },
                        },
                    },
                },
            },
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'builtin:swc-loader',
                        options: {
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    tsx: true,
                                },
                                transform: {
                                    react: {
                                        runtime: 'automatic',
                                    },
                                },
                            },
                        }
                    },
                    {
                        loader: 'babel-loader'
                    }
                ],
            },
            {
                test: /\.(json|xml|ttf|woff|woff2|otf|eot)$/,
                exclude: /node_modules/,
                type: "asset/resource",
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                exclude: /node_modules/,
                type: "asset/resource",
            },
            {
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                oneOf: [
                    {
                        resourceQuery: /react/,
                        use: [
                            {
                                loader: '@svgr/webpack',
                                options: {
                                    exportType: 'default',
                                },
                            },
                        ],
                    },
                    {
                        type: 'asset/resource',
                    },
                ],
            },
            {
                test: /\.m?js$/,
                type: 'javascript/auto',
                resolve: {
                    fullySpecified: false
                },
            },
        ],
    },
    plugins: [
        new rspack.HtmlRspackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            favicon: "./public/favicon.ico",
            inject: 'body'
        }),
        new rspack.CopyRspackPlugin({
            patterns: [
                { from: "./public" },
            ],
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        assetModuleFilename: 'static/[name]-[contenthash][ext][query]',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    }
});
