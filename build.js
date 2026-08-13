// 预渲染：把 js/data.js 的内容静态填进 index.html 的 #app，
// 让搜索引擎和不执行 JS 的抓取工具（含各类 AI 工具）能直接读到正文。
// 改过 js/data.js 或 js/components/ 后必须重新跑：node build.js
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { education } from "./js/components/education.js";
import { elsewhere } from "./js/components/elsewhere.js";
import { experience } from "./js/components/experience.js";
import { footer } from "./js/components/footer.js";
import { header } from "./js/components/header.js";
import { hero } from "./js/components/hero.js";
import { projectsSection } from "./js/components/projects.js";
import { siteContent } from "./js/data.js";

const root = dirname(fileURLToPath(import.meta.url));
const indexPath = join(root, "index.html");

// 与 js/main.js 的 renderPage 保持同一拼装顺序；去掉行尾空白以通过 git diff --check
const markup = `${header()}<main>${hero()}${education()}${experience()}${projectsSection()}${elsewhere()}</main>${footer()}`
  .split("\n").map((line) => line.trimEnd()).join("\n");

// main.js 里设在 documentElement 上的样式变量，静态版设在 #app 上等效继承
const { accentColor, cardRadius, sectionSpace } = siteContent.style;
const styleVars = `--editor-accent:${accentColor};--editor-card-radius:${cardRadius}px;--editor-section-space:${sectionSpace}px`;

const startMark = "<!-- prerender:start -->";
const endMark = "<!-- prerender:end -->";
const appDiv = `<div id="app" style="${styleVars}">${startMark}${markup}${endMark}</div>`;

const html = readFileSync(indexPath, "utf8");
const pattern = /<div id="app"[^>]*>[\s\S]*?<\/div>\s*(?=<script)/;
if (!pattern.test(html)) {
  console.error("index.html 里没找到 #app 挂载点，检查文档结构是否变了");
  process.exit(1);
}
writeFileSync(indexPath, html.replace(pattern, `${appDiv}\n    `));
console.log(`已预渲染 ${markup.length} 字符进 index.html`);
