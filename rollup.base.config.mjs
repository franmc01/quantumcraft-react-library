import fs from "fs";
import path from "path";

import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import json  from "@rollup/plugin-json";

const isProd = process.env.NODE_ENV === "production";

export const external = ["react", "react-dom", "form-data"];
export const createConfig = (input, output, additionalPlugins = []) => ({
  input,
  output,
  plugins: [...plugins, ...additionalPlugins],
  external,
});

export const plugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  typescript({ tsconfig: "./tsconfig.json", useTsconfigDeclarationDir: true }),
  json(),
  isProd && terser(),
].filter(Boolean);

export const createBuildsForFolder = (folderPath, outputFolder) => {
  const isDirectory = (source) => fs.lstatSync(source).isDirectory();
  const getDirectories = (source) =>
    fs
      .readdirSync(source)
      .map((name) => path.join(source, name))
      .filter(isDirectory);

  const folders = getDirectories(folderPath);

  return folders.map((folder) => {
    const nameFileModule = path.basename(folder).toLowerCase();
    return createConfig(
      `${folder}/index.ts`,
      ["cjs", "esm"].map((format) => ({
        file: `dist/${outputFolder}/${nameFileModule}/${nameFileModule}.${format}.js`,
        format,
        sourcemap: true,
        exports: "named",
      }))
    );
  });
};
