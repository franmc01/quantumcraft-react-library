import {createBuildsForFolder, createConfig} from "./rollup.base.config.mjs";

const hookBuilds = createBuildsForFolder("./src/hooks", "hooks");

export default [
    createConfig("src/hooks/index.ts", [
        {file: "dist/hooks/index.esm.js", format: "esm", sourcemap: true, exports: "named"},
        {file: "dist/hooks/index.cjs.js", format: "cjs", sourcemap: true, exports: "named"},
    ]),
    ...hookBuilds,
];
