import html from "@web/rollup-plugin-html";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

const isProduction = process.env.ROLLUP_WATCH !== "true";

export default {
  input: "app.tsx",
  output: { dir: "dist" },
  plugins: [
    html({
      input: "index.html",
      minify: isProduction,
      transformAsset: async (content, path) => {
        if (path.endsWith(".sass")) {
          let result = sass.compile(path).css;
          result = postcss([autoprefixer()]).process(result);
          return result.css;
        }
        return content;
      },
    }),
    typescript({ sourceMap: !isProduction }),
    resolve(),
    commonjs(),
    isProduction && terser(),
    !isProduction && serve({ contentBase: "dist", port: 3000 }),
    !isProduction && livereload("dist"),
  ],
};
