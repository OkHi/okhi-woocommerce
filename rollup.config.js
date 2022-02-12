const rollupTypescript = require('@rollup/plugin-typescript');
import minify from 'rollup-plugin-babel-minify';

export default {
    input: './src/assets/ts/index.ts',
    output: {
        file: './src/assets/js/okhi-actions.js',
        format: 'esm',
        compact: true
    },
    sourcemap: true,
    plugins: [
        rollupTypescript({
            tsconfig: './tsconfig.json'
        }),
        minify({
            // Options for babel-minify.
        })
    ],
    external: ['jquery']
};
