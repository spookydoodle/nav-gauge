const ReactCompilerConfig = {
};

module.exports = {
    plugins: [
        ['babel-plugin-react-compiler', ReactCompilerConfig],
        '@babel/plugin-syntax-jsx',
        ['@babel/plugin-syntax-typescript', { isTSX: true }],
    ],
};