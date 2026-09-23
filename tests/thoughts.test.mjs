import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { thoughtsSection, validateThoughts } from "../js/components/thoughts.js";
import { pages, pageMarkup, legacyDestination } from "../js/pages.js";

const note = { id: "note-20260922-example", date: "2026-09-22", title: "一条随想", content: "第一段\n\n第二段" };

test("untrusted post content renders as text, never markup", () => {
  const html = thoughtsSection([{ ...note, title: '<img src=x onerror="bad()">', content: '<script>bad()</script>\n& "quoted"' }]);
  assert.ok(html.includes("&lt;script&gt;bad()&lt;/script&gt;"));
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("<img"));
});

test("only the public content fields can enter the build", () => {
  for (const key of ["private", "source_tid", "account_id", "media", "content_hash"]) {
    assert.throws(() => validateThoughts([{ ...note, [key]: "private source" }]));
  }
});

test("invalid dates and duplicate anchors fail the build", () => {
  assert.throws(() => validateThoughts([{ ...note, date: "2026-02-30" }]));
  assert.throws(() => validateThoughts([note, note]));
  assert.throws(() => validateThoughts([{ ...note, id: 'x" onmouseover="bad()' }]));
});

test("notes render newest first with the latest open and blank lines removed only for display", () => {
  const html = thoughtsSection([{ ...note, id: "note-older", date: "2026-01-01" }, note]);
  assert.ok(html.indexOf('id="note-20260922-example"') < html.indexOf('id="note-older"'));
  assert.ok(html.includes("第一段\n第二段"));
  assert.ok(html.includes('id="note-20260922-example" open'));
  assert.ok(!html.includes('id="note-older" open'));
  assert.equal(note.content, "第一段\n\n第二段");
  const spaced = thoughtsSection([{ ...note, content: "AI 产品\n \t\n第二段 AI Product Playbook" }]);
  assert.ok(spaced.includes("AI 产品\n第二段 AI Product Playbook"));
  assert.equal((html.match(/<details /g) || []).length, 2);
});

test("each page contains only its own sections and a current navigation link", () => {
  const expected = { experience: ["top", "education", "experience"], work: ["work", "elsewhere"], thoughts: ["thoughts"] };
  for (const [page, sections] of Object.entries(expected)) {
    const html = pageMarkup(page);
    assert.deepEqual([...html.matchAll(/<section id="([^"]+)"/g)].map((match) => match[1]), sections);
    assert.equal((html.match(/<h1 /g) || []).length, 1);
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
    assert.ok(html.includes(`href="${pages[page].path}" aria-current="page"`));
  }
  assert.ok(pageMarkup("work").includes('href="/assets/wechat-qr.jpg"'));
});

test("old section and note links reach their page without consuming login callbacks", () => {
  assert.equal(legacyDestination("/", "", "#work"), "/work/");
  assert.equal(legacyDestination("/index.html", "?edit=1", "#thoughts"), "/thoughts/?edit=1");
  assert.equal(legacyDestination("/", "", "#note-20260922-example"), "/thoughts/#note-20260922-example");
  assert.equal(legacyDestination("/", "", "#elsewhere"), "/work/#elsewhere");
  for (const hash of ["#editor_token=example", "#experience", "#top", "#unknown"]) {
    assert.equal(legacyDestination("/", "?edit=1", hash), null);
  }
  assert.equal(legacyDestination("/thoughts/", "", "#note-example"), null);
});

test("public Thoughts startup binds interactions without replacing published HTML", async () => {
  const saved = Object.fromEntries(["document", "window", "localStorage"].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  let themeBound = false;
  try {
    globalThis.document = {
      documentElement: { dataset: {} },
      body: { dataset: { page: "thoughts" } },
      querySelector(selector) {
        assert.equal(selector, ".theme-toggle", "public startup must not access #app to replace its HTML");
        return { addEventListener() { themeBound = true; } };
      }
    };
    globalThis.window = {
      location: { pathname: "/thoughts/", search: "", hash: "" },
      addEventListener() {}, removeEventListener() {}
    };
    globalThis.localStorage = { getItem() { return null; } };
    await import("../js/main.js");
    assert.ok(themeBound);
  } finally {
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});

test("build versions dependencies and preserves the Thoughts-only publishing boundary", async () => {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const prefix = join(tmpdir(), "thoughts-build-");
  const fixture = mkdtempSync(prefix);
  try {
    const components = ["education", "elsewhere", "experience", "footer", "header", "hero", "projects", "theme", "thoughts"];
    const styles = ["main", "tokens", "base", "layout", "components", "responsive", "editor"];
    const files = ["build.js", "index.html", "js/main.js", "js/editor.js", "js/pages.js", "js/data.js", "js/thoughts-data.js", ...components.map((name) => `js/components/${name}.js`), ...styles.map((name) => `styles/${name}.css`)];
    for (const path of files) {
      mkdirSync(dirname(join(fixture, path)), { recursive: true });
      writeFileSync(join(fixture, path), readFileSync(join(root, path)));
    }
    const content = "Literal $& and $` and $' and $$";
    writeFileSync(join(fixture, "js/thoughts-data.js"), `export const thoughts = ${JSON.stringify([{ ...note, content }])};\n`);
    await import(`${pathToFileURL(join(fixture, "build.js")).href}?first`);
    const first = readFileSync(join(fixture, "thoughts/index.html"), "utf8");
    assert.ok(first.includes("Literal $&amp; and $` and $&#39; and $$"));
    assert.equal((first.match(/id="app"/g) || []).length, 1);
    const built = Object.fromEntries(Object.entries(pages).map(([page, config]) => [page, readFileSync(join(fixture, config.file), "utf8")]));
    const assetMap = (html) => JSON.parse(html.match(/<script type="importmap">(.*?)<\/script>/s)[1]).imports;
    const imports = assetMap(first);
    assert.equal(imports["/js/thoughts-data.js"], undefined);
    assert.match(imports["/js/components/thoughts.js"], /^\/js\/components\/thoughts\.js\?v=[a-f0-9]{12}$/);
    for (const [page, html] of Object.entries(built)) {
      assert.ok(html.includes(`<body data-page="${page}">`));
      assert.ok(!html.includes(`href="/styles/main.css"`));
      assert.deepEqual([...html.matchAll(/href="\/styles\/(\w+)\.css\?v=[a-f0-9]{12}"/g)].map((match) => match[1]), styles.slice(1));
      assert.ok(html.includes(`src="${imports["/js/main.js"]}"`));
      assert.ok(html.indexOf('type="importmap"') < html.indexOf('type="module"'));
      assert.ok(html.includes(`<title>${pages[page].title}</title>`));
    }
    assert.ok(!built.experience.includes('id="thoughts"'));
    assert.ok(!built.work.includes('id="experience"'));
    await import(`${pathToFileURL(join(fixture, "build.js")).href}?second`);
    for (const [page, config] of Object.entries(pages)) {
      assert.equal(readFileSync(join(fixture, config.file), "utf8"), built[page]);
    }
    // A newly synchronized note must not modify another page or asset tags.
    const { thoughts } = await import(pathToFileURL(join(fixture, "js/thoughts-data.js")).href);
    thoughts.unshift({ ...note, id: "note-newest", date: "2026-09-24" });
    writeFileSync(join(fixture, "js/thoughts-data.js"), `export const thoughts = ${JSON.stringify(thoughts)};\n`);
    await import(`${pathToFileURL(join(fixture, "build.js")).href}?new-note`);
    for (const page of ["experience", "work"]) {
      assert.equal(readFileSync(join(fixture, pages[page].file), "utf8"), built[page]);
    }
    const updated = readFileSync(join(fixture, "thoughts/index.html"), "utf8");
    const outsideApp = (html) => html.replace(/<!-- prerender:start -->[\s\S]*?<!-- prerender:end -->/, "");
    assert.equal(outsideApp(updated), outsideApp(first));
    assert.ok(updated.includes('id="note-newest" open'));
    // Changing only a child dependency must still give that asset a new URL.
    for (const path of ["js/components/thoughts.js", "styles/components.css"]) {
      writeFileSync(join(fixture, path), `${readFileSync(join(fixture, path), "utf8")}\n/* cache regression */\n`);
    }
    await import(`${pathToFileURL(join(fixture, "build.js")).href}?new-assets`);
    const versioned = readFileSync(join(fixture, "thoughts/index.html"), "utf8");
    assert.notEqual(assetMap(versioned)["/js/components/thoughts.js"], imports["/js/components/thoughts.js"]);
    assert.equal(assetMap(versioned)["/js/main.js"], imports["/js/main.js"]);
    const componentCss = (html) => html.match(/href="(\/styles\/components\.css\?v=[a-f0-9]{12})"/)[1];
    assert.notEqual(componentCss(versioned), componentCss(first));
  } finally {
    assert.ok(resolve(fixture).startsWith(resolve(prefix)));
    rmSync(fixture, { recursive: true, force: true });
  }
});
