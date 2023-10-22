import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/theme/index.scss',
    output: {
        dir: 'dist/theme',
        format: 'esm',
    },
    plugins: [
        postcss({
            extract: true, // Extrae a un archivo .css
            modules: true, // No uses módulos CSS
            use: ['sass'],  // Utiliza SASS
        }),
    ],
};
