import fs from "fs";
import pkg from "../package.json" assert { type: "json" };
import crt from "./crt.js";

const themes = pkg.config.themes;

pkg.contributes.themes = [];

for (let t in themes) {
  fs.writeFileSync(
    `themes/${t}.json`,
    JSON.stringify(
      crt.crtTemplate(t, themes[t].type, themes[t].fg, themes[t].bg),
      null,
      2
    )
  );

  pkg.contributes.themes.push({
    label: t,
    path: `themes/${t}.json`,
    uiTheme: "vs-dark",
  });
}

fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
