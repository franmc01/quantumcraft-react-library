import postcss from 'rollup-plugin-postcss';

import {createBuildsForFolder, createConfig} from "./rollup.base.config.mjs";

const componentBuilds = createBuildsForFolder("./src/components", "components");

const additionalPlugins = [
    postcss({
        extensions: ['.css', '.scss'],
        use: ['sass']
    })
]

export default [
    createConfig("src/components/index.ts", [
        {file: "dist/components/index.esm.js", format: "esm", sourcemap: true, exports: "named"},
        {file: "dist/components/index.cjs.js", format: "cjs", sourcemap: true, exports: "named"},
    ], additionalPlugins),
    ...componentBuilds.map((build) => ({
        ...build,
        plugins: [...build.plugins, ...additionalPlugins]
    }))
];
