/**
 * Generates themes/<name>.json for every entry of `config.themes` in
 * package.json (theme name -> foreground colour), lists the themes under
 * `contributes.themes` and in README.md. Run from the package root:
 * `npm run build`.
 */
import fs from "fs";
import crtTheme from "./crt.js";

const BACKGROUND = "#000000";
const README_LIST = /(<!-- themes:start -->\n)[^]*(<!-- themes:end -->)/;
const README_COLUMNS = 3;

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const themes = Object.entries(pkg.config.themes);

fs.mkdirSync("themes", { recursive: true });
pkg.contributes.themes = themes.map(([name, fg]) => {
  const path = `themes/${name}.json`;
  fs.writeFileSync(
    path,
    JSON.stringify(crtTheme(name, fg, BACKGROUND), null, 2),
  );
  return { label: name, path, uiTheme: "vs-dark" };
});
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

// One table row holds README_COLUMNS themes, each as a name and a colour cell.
const cells = themes.map(
  ([name, fg]) => `${name.replace("OhLED_", "")} | \`${fg.toLowerCase()}\``,
);
const rows = [
  Array(README_COLUMNS).fill("Theme | Colour"),
  Array(README_COLUMNS).fill("--- | ---"),
];
for (let i = 0; i < cells.length; i += README_COLUMNS) {
  rows.push(cells.slice(i, i + README_COLUMNS));
}
const table = rows.map((row) => `| ${row.join(" | ")} |\n`).join("");

const readme = fs.readFileSync("README.md", "utf8");
if (!README_LIST.test(readme)) {
  throw new Error("README.md: theme list markers not found");
}
fs.writeFileSync(
  "README.md",
  readme.replace(README_LIST, (_, start, end) => start + table + end),
);
