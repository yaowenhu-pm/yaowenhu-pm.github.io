// 生成三个独立页面；#app 中的正文由 js/pages.js 与浏览器共用。
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { pages, pageMarkup } from "./js/pages.js";
import { siteContent } from "./js/data.js";

const root = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(root, "index.html"), "utf8");
const appPattern = /<div id="app"[^>]*>[\s\S]*?<\/div>\s*(?=<script)/;
if (!appPattern.test(template)) throw new Error("index.html 里没找到 #app 挂载点");
const { accentColor, cardRadius, sectionSpace } = siteContent.style;
const styleVars = `--editor-accent:${accentColor};--editor-card-radius:${cardRadius}px;--editor-section-space:${sectionSpace}px`;

for (const [page, config] of Object.entries(pages)) {
  const markup = pageMarkup(page).split("\n").map((line) => line.trimEnd()).join("\n");
  const app = `<div id="app" style="${styleVars}"><!-- prerender:start -->${markup}<!-- prerender:end --></div>`;
  const html = template
    .replace(appPattern, () => `${app}\n    `)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${config.title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, () => `<meta name="description" content="${config.description}" />`)
    .replace(/<body[^>]*>/, () => `<body data-page="${page}">`)
    .replace(/href="\/?styles\/main\.css"/, 'href="/styles/main.css"')
    .replace(/src="\/?js\/main\.js"/, 'src="/js/main.js"');
  const path = join(root, config.file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
  console.log(`已预渲染 ${config.file}`);
}
