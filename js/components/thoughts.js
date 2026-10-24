import { thoughts } from "../data.js";

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

export function validateThoughts(entries) {
  if (!Array.isArray(entries)) throw new Error("随想必须是列表");
  const ids = new Set();
  for (const entry of entries) {
    if (!entry || Object.keys(entry).sort().join(",") !== "content,date,id,title") {
      throw new Error("随想只允许 id、date、title、content 四个公开字段");
    }
    if (typeof entry.id !== "string" || !/^note-[a-z0-9-]+$/.test(entry.id) || ids.has(entry.id)) {
      throw new Error("随想标识无效或重复");
    }
    ids.add(entry.id);
    if (typeof entry.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
        Number.isNaN(Date.parse(entry.date)) || new Date(entry.date).toISOString().slice(0, 10) !== entry.date) {
      throw new Error("随想日期无效");
    }
    if (typeof entry.title !== "string" || !entry.title.trim() || entry.title.length > 80 ||
        typeof entry.content !== "string" || !entry.content.trim() || entry.content.length > 20000) {
      throw new Error("随想标题或正文无效");
    }
  }
  return entries;
}

export function thoughtsSection(entries = thoughts, translations = {}) {
  const sorted = [...validateThoughts(entries)].sort((a, b) => b.date.localeCompare(a.date));
  const notes = sorted.map((entry, index) => {
    const title = escapeHtml(entry.title);
    const excerpt = escapeHtml(entry.content.trim().split(/\n/).find((line) => line.trim()) || "");
    const body = entry.content.replace(/\r\n?/g, "\n").split("\n").filter((line) => line.trim()).join("\n");
    return `
      <article class="thought-item" lang="zh-CN">
        <details class="thought" id="${entry.id}"${index === 0 ? " open" : ""}>
          <summary class="thought-summary">
            <span class="thought-heading">
              <span class="thought-title">${title}</span>
              <time datetime="${entry.date}">${entry.date.replaceAll("-", ".")}</time>
              <span class="thought-chevron" aria-hidden="true"></span>
            </span>
            <span class="thought-excerpt">${excerpt}</span>
          </summary>
          <div class="thought-body">${escapeHtml(body)}</div>
        </details>
      </article>`;
  }).join("");
  return `
    <section id="thoughts" class="shell section thoughts" aria-labelledby="thoughts-title">
      <div class="section-heading">
        <h1 id="thoughts-title" data-i18n="thoughts.title">随想</h1>
        <p class="thoughts-intro" data-i18n="thoughts.intro">从朋友圈选一些文字，记录日常的思考。</p>
        <p class="thoughts-language-note" data-english-only data-i18n="thoughts.languageNote" hidden>英文由中文原文翻译。</p>
      </div>
      <div class="thought-list">${notes || '<p class="thoughts-intro" data-i18n="thoughts.empty">还没有发布的随想。</p>'}</div>
      <template id="thoughts-english-data">${JSON.stringify(translations).replace(/[<>&]/g, (character) => ({ "<": "\\u003c", ">": "\\u003e", "&": "\\u0026" })[character])}</template>
    </section>`;
}

const originalNotes = new WeakMap();

export function applyThoughtsLanguage(language) {
  for (const section of document.querySelectorAll("section.thoughts")) {
    const cache = section.querySelector("#thoughts-english-data");
    const translations = cache ? JSON.parse(cache.content.textContent) : {};
    for (const article of section.querySelectorAll(".thought-item")) {
      const details = article.querySelector("details");
      const nodes = [".thought-title", ".thought-excerpt", ".thought-body"].map((selector) => article.querySelector(selector));
      if (!originalNotes.has(article)) originalNotes.set(article, nodes.map((node) => node.textContent));
      const translation = translations[details.id];
      const original = originalNotes.get(article);
      const english = language === "en" && translation;
      const text = english ? [translation.title, translation.content.trim().split(/\n/).find((line) => line.trim()) || "", translation.content.replace(/\r\n?/g, "\n").split("\n").filter((line) => line.trim()).join("\n")] : original;
      nodes.forEach((node, index) => { node.textContent = text[index]; });
      article.lang = english ? "en" : "zh-CN";
    }
  }
}

export function initThoughts() {
  function openLinkedThought() {
    const id = window.location.hash.slice(1);
    if (!id.startsWith("note-")) return;
    const note = document.getElementById(id);
    if (!note?.classList.contains("thought")) return;
    note.open = true;
    note.scrollIntoView({ block: "start" });
  }
  // renderPage is also used by the editor; replace its handler on each render.
  window.removeEventListener("hashchange", window.openLinkedThought);
  window.openLinkedThought = openLinkedThought;
  window.addEventListener("hashchange", openLinkedThought);
  openLinkedThought();
}
