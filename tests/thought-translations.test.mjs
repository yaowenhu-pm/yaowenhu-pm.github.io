import test from "node:test";
import assert from "node:assert/strict";
import { ensureTranslations, sourceHash, splitSegments, translateText, validateTranslation, embeddedTranslations } from "../scripts/thought-translations.mjs";
import { thoughtsSection, applyThoughtsLanguage } from "../js/components/thoughts.js";

const note = { id: "note-translation", date: "2026-10-25", title: "测试随想", content: "第一段\n\n第二段\nhttps://example.com/?a=1&b=2" };
const english = { sourceHash: sourceHash(note), title: "A test note", content: "First paragraph\n\nSecond paragraph\nhttps://example.com/?a=1&b=2" };

test("unchanged entries use their cache; edited entries are retranslated; removed notes leave no translations", async () => {
  let calls = [];
  const translate = async (value) => { calls.push(value); return value === note.content ? english.content : "A revised title"; };
  const cache = { [note.id]: english, "note-deleted": english };
  assert.deepEqual(await ensureTranslations([note], cache, translate), { [note.id]: english });
  assert.deepEqual(calls, []);
  const changed = { ...note, title: "改过的标题" };
  const result = await ensureTranslations([changed], cache, translate);
  assert.deepEqual(calls, [changed.title, changed.content]);
  assert.equal(result[note.id].sourceHash, sourceHash(changed));
  assert.equal(result[note.id].title, "A revised title");
});

test("incomplete, stale or link-altering translations cannot be published", () => {
  for (const invalid of [
    { ...english, sourceHash: "stale" }, { ...english, title: "中文标题" },
    { ...english, content: "" }, { ...english, title: "MYMEMORY WARNING: limit" },
    { ...english, content: english.content.replace("\n\n", "\n") },
    { ...english, content: english.content.replace("example.com", "another.com") }
  ]) assert.throws(() => validateTranslation(note, invalid));
  assert.deepEqual(validateTranslation(note, { ...english, private_token: "must not be published" }), english);
});

test("translation data is inert text and cannot break out of its template", () => {
  const malicious = { ...english, title: "</template><script>alert(1)</script>" };
  const html = thoughtsSection([note], { [note.id]: malicious });
  assert.ok(!html.includes("<script>alert(1)</script>"));
  assert.equal((html.match(/<template/g) || []).length, 1);
  assert.deepEqual(embeddedTranslations(html), { [note.id]: malicious });
});

test("long Unicode sentences stay within the service's byte limit without losing source characters", () => {
  const value = "一段很长的随想，包含 emoji 🏔️ 和 AI。".repeat(100);
  const segments = splitSegments(value);
  assert.equal(segments.join(""), value);
  assert.ok(segments.length > 2);
  assert.ok(segments.every((segment) => Buffer.byteLength(segment, "utf8") <= 480));
});

test("the service receives only text chunks; URLs, paragraph breaks, and HTML entities survive translation", async () => {
  const requests = [];
  const fetcher = async (url) => {
    requests.push(new URL(url));
    return { ok: true, json: async () => ({ responseStatus: 200, responseData: { translatedText: "It&#39;s a thought &amp; an idea." } }) };
  };
  const translated = await translateText(note.content, fetcher);
  assert.equal(translated, "It's a thought & an idea.\n\nIt's a thought & an idea.\nhttps://example.com/?a=1&b=2");
  assert.equal(requests.length, 2);
  assert.ok(requests.every((url) => url.origin === "https://api.mymemory.translated.net" && !url.searchParams.get("q").includes("https://")));
});

test("switching languages updates full text and excerpts, preserves open state, and restores the exact Chinese", () => {
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const nodes = [note.title, "第一段", "第一段\n第二段\nhttps://example.com/?a=1&b=2"].map((textContent) => ({ textContent }));
  const details = { id: note.id, open: true };
  const article = { lang: "zh-CN", querySelector: (selector) => selector === "details" ? details : nodes[[".thought-title", ".thought-excerpt", ".thought-body"].indexOf(selector)] };
  const section = {
    querySelector: () => ({ content: { textContent: JSON.stringify({ [note.id]: english }) } }),
    querySelectorAll: () => [article]
  };
  try {
    globalThis.document = { querySelectorAll: () => [section] };
    const original = nodes.map((node) => node.textContent);
    applyThoughtsLanguage("en");
    assert.equal(article.lang, "en");
    assert.deepEqual(nodes.map((node) => node.textContent), [english.title, "First paragraph", english.content.replace("\n\n", "\n")]);
    assert.equal(details.open, true);
    applyThoughtsLanguage("zh");
    assert.equal(article.lang, "zh-CN");
    assert.deepEqual(nodes.map((node) => node.textContent), original);
    assert.equal(details.open, true);
  } finally {
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else delete globalThis.document;
  }
});
