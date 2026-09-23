// 生成三个独立页面；#app 中的正文由 js/pages.js 与浏览器共用。
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
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

function versionedUrl(path) {
  const hash = createHash("sha256").update(readFileSync(join(root, path))).digest("hex").slice(0, 12);
  return `/${path}?v=${hash}`;
}

function scriptFiles(directory) {
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? scriptFiles(path) : path.endsWith(".js") ? [path] : [];
  }).sort();
}

// Version every dependency, not just the entry. Note content stays independent
// so a Thoughts-only update changes neither other pages nor their asset tags.
const imports = Object.fromEntries(scriptFiles("js")
  .filter((path) => path !== "js/thoughts-data.js")
  .map((path) => [`/${path}`, versionedUrl(path)]));
const styleManifest = readFileSync(join(root, "styles/main.css"), "utf8");
const styles = [...styleManifest.matchAll(/@import url\("\.\/([^"/]+\.css)"\);/g)]
  .map((match) => `styles/${match[1]}`);
if (!styles.length || styleManifest.replace(/@import url\("\.\/([^"/]+\.css)"\);/g, "").trim()) {
  throw new Error("styles/main.css 必须只按顺序列出本地样式文件");
}
const assets = `<!-- assets:start -->\n${styles.map((path) => `    <link rel="stylesheet" href="${versionedUrl(path)}" />`).join("\n")}
    <script type="importmap">${JSON.stringify({ imports })}</script>
    <!-- assets:end -->`;
const assetPattern = /<!-- assets:start -->[\s\S]*?<!-- assets:end -->|<link rel="stylesheet" href="\/?styles\/main\.css" \/>/;
if (!assetPattern.test(template)) throw new Error("index.html 里没找到资源区块");

for (const [page, config] of Object.entries(pages)) {
  const markup = pageMarkup(page).split("\n").map((line) => line.trimEnd()).join("\n");
  const app = `<div id="app" style="${styleVars}"><!-- prerender:start -->${markup}<!-- prerender:end --></div>`;
  const html = template
    .replace(appPattern, () => `${app}\n    `)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${config.title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, () => `<meta name="description" content="${config.description}" />`)
    .replace(/<body[^>]*>/, () => `<body data-page="${page}">`)
    .replace(assetPattern, () => assets)
    .replace(/src="\/?js\/main\.js(?:\?[^"\s]*)?"/, () => `src="${imports["/js/main.js"]}"`);
  const path = join(root, config.file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
  console.log(`已预渲染 ${config.file}`);
}
