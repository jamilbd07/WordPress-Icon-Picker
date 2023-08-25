import builtins from "rollup-plugin-node-builtins";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import scss from "rollup-plugin-scss";
import { uglify } from "rollup-plugin-uglify";

import postcssPlugins from "@wordpress/postcss-plugins-preset";

const extensions = [".js", ".jsx"];

const isProduction = process.env.NODE_ENV === "production";

const globalKeys = {
    react: "React",
    "react-dom": "ReactDOM",
    "@wordpress/components": "wpComponents",
    "@wordpress/hooks": "wpHooks",
    "@wordpress/i18n": "wpI18n"
};

export default {
    input: "src/index.js",
    output: [
        {
            file: `dist/index.min.js`,
            format: "esm",
        }
    ],
    external: Object.keys(globalKeys),
    plugins: [
        peerDepsExternal(),
        builtins(),
        nodeResolve({
            mainFields: ["module", "main"],
            extensions,
        }),
        babel({
            exclude: "node_modules/**",
            extensions,
            babelHelpers: "runtime",
            presets: ['@babel/env', '@babel/preset-react'],
            plugins: [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-proposal-class-properties"
            ],
        }),
        scss({
            fileName: 'style.css',
            sourceMap: !isProduction,
            include: ["**/*.scss", "*.css", "node_modules/**/*.css"],
            failOnError: true,
            sass: require("node-sass"),
            plugins: postcssPlugins,
            outputStyle: isProduction ? 'compressed' : null
            // processor: () => postcss([autoprefixer({ overrideBrowserslist: "Edge 18" })]),
        }),
        isProduction ? uglify() : null,
    ],
};