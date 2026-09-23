import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { thoughtsSection, validateThoughts } from "../js/components/thoughts.js";

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

test("all notes and their full original text are prerendered newest first", () => {
  const html = thoughtsSection([{ ...note, id: "note-older", date: "2026-01-01" }, note]);
  assert.ok(html.indexOf('id="note-20260922-example"') < html.indexOf('id="note-older"'));
  assert.ok(html.includes("第一段\n\n第二段"));
  assert.equal((html.match(/<details /g) || []).length, 2);
});

test("the build preserves dollar tokens and stays idempotent", async () => {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const prefix = join(tmpdir(), "thoughts-build-");
  const fixture = mkdtempSync(prefix);
  try {
    const components = ["education", "elsewhere", "experience", "footer", "header", "hero", "projects", "theme", "thoughts"];
    const files = ["build.js", "index.html", "js/data.js", "js/thoughts-data.js", ...components.map((name) => `js/components/${name}.js`)];
    for (const path of files) {
      mkdirSync(dirname(join(fixture, path)), { recursive: true });
      writeFileSync(join(fixture, path), readFileSync(join(root, path)));
    }
    const content = "Literal $& and $` and $' and $$";
    writeFileSync(join(fixture, "js/thoughts-data.js"), `export const thoughts = ${JSON.stringify([{ ...note, content }])};\n`);
    await import(`${pathToFileURL(join(fixture, "build.js")).href}?first`);
    const first = readFileSync(join(fixture, "index.html"), "utf8");
    assert.ok(first.includes("Literal $&amp; and $` and $&#39; and $$"));
    assert.equal((first.match(/id="app"/g) || []).length, 1);
    await import(`${pathToFileURL(join(fixture, "build.js")).href}?second`);
    assert.equal(readFileSync(join(fixture, "index.html"), "utf8"), first);
  } finally {
    assert.ok(resolve(fixture).startsWith(resolve(prefix)));
    rmSync(fixture, { recursive: true, force: true });
  }
});
