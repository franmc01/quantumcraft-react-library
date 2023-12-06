import {createBuildsForFolder, createConfig} from "./rollup.base.config.mjs";

const hookBuilds = createBuildsForFolder("./src/utils", "utils");

export default [
    createConfig("src/utils/index.ts", [
        {file: "dist/utils/index.esm.js", format: "esm", sourcemap: true, exports: "named"},
        {file: "dist/utils/index.cjs.js", format: "cjs", sourcemap: true, exports: "named"},
    ]),
    ...hookBuilds,
];
