import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import flexbugs from 'postcss-flexbugs-fixes'
import postcssPresetEnv from 'postcss-preset-env'
import terser from '@rollup/plugin-terser'

const addPlugins = () => [
    postcss({
        extract: true,
        minimize: true,
        use: ['sass'],
        plugins: [flexbugs(), postcssPresetEnv()],
    }),
];

// rollup.config.js
export default [
    {
        input: './src/sass/main.scss',
        output: {
            name: 'MainStyles',
            file: './build/styles.min.css',
            format: 'es',
        },
        plugins: addPlugins(),
    },
    {
        input: './src/scripts/index.js',
        output: {
            file: './build/index.min.js',
            name: 'MainScript',
            format: 'iife',
        },
        plugins: [babel({ babelHelpers: 'bundled' }), terser()],
    },
];
