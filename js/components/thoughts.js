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

export function thoughtsSection(entries = thoughts) {
  const sorted = [...validateThoughts(entries)].sort((a, b) => b.date.localeCompare(a.date));
  if (!sorted.length) return "";
  const notes = sorted.map((entry) => {
    const title = escapeHtml(entry.title);
    const excerpt = escapeHtml(entry.content.trim().split(/\n/).find((line) => line.trim()) || "");
    return `
      <article class="thought-item">
        <details class="thought" id="${entry.id}">
          <summary class="thought-summary">
            <span class="thought-heading">
              <span class="thought-title">${title}</span>
              <time datetime="${entry.date}">${entry.date.replaceAll("-", ".")}</time>
              <span class="thought-chevron" aria-hidden="true"></span>
            </span>
            <span class="thought-excerpt">${excerpt}</span>
          </summary>
          <div class="thought-body">${escapeHtml(entry.content)}</div>
        </details>
      </article>`;
  }).join("");
  return `
    <section id="thoughts" class="shell section thoughts" aria-labelledby="thoughts-title">
      <div class="section-heading">
        <h2 id="thoughts-title">随想</h2>
        <p class="thoughts-intro">从朋友圈选一些文字，记录日常的思考。</p>
      </div>
      <div class="thought-list">${notes}</div>
    </section>`;
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
