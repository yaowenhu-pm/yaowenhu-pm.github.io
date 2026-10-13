import { englishContent } from "./data.js";

const originals = new WeakMap();
const storageKey = "site-language";
let language = "zh";
let originalTitle;

export function text(key, chinese) {
  if (language !== "en") return chinese;
  const entry = englishContent[key];
  if (typeof entry === "string") return entry;
  // Reordering or editing a profile must never attach another person's job text.
  const matched = entry?.source === chinese ? entry
    : Object.values(englishContent).find((value) => value?.source === chinese);
  return matched?.translation || chinese;
}

function savedLanguage() {
  const requested = new URLSearchParams(window.location.search).get("lang");
  if (requested === "en" || requested === "zh") return requested;
  try {
    return localStorage.getItem(storageKey) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

export function applyLanguage(next) {
  language = next === "en" ? "en" : "zh";
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  document.documentElement.dataset.language = language;
  for (const node of document.querySelectorAll("[data-i18n], [data-i18n-aria-label], [data-i18n-alt]")) {
    if (!originals.has(node)) originals.set(node, {
      text: node.textContent, ariaLabel: node.getAttribute("aria-label"), alt: node.getAttribute("alt")
    });
    const original = originals.get(node);
    if (node.dataset.i18n) node.textContent = text(node.dataset.i18n, original.text);
    if (node.dataset.i18nAriaLabel) node.setAttribute("aria-label", text(node.dataset.i18nAriaLabel, original.ariaLabel));
    if (node.dataset.i18nAlt) node.setAttribute("alt", text(node.dataset.i18nAlt, original.alt));
  }
  for (const node of document.querySelectorAll("[data-english-only]")) node.hidden = language !== "en";
  for (const link of document.querySelectorAll("a[data-page-link]")) {
    const url = new URL(link.getAttribute("href"), window.location.href);
    if (language === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
  }
  const toggle = document.querySelector(".language-toggle");
  if (toggle) {
    toggle.textContent = language === "en" ? "中" : "EN";
    toggle.lang = language === "en" ? "zh-CN" : "en";
    toggle.setAttribute("aria-label", language === "en" ? "Switch to Chinese" : "Switch to English");
    toggle.title = language === "en" ? "切换为中文" : "Switch to English";
  }
  originalTitle ??= document.title;
  const page = document.body.dataset.page;
  document.title = text(`pages.${page}.title`, originalTitle);
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.dataset.chinese ??= description.content;
    description.content = text(`pages.${page}.description`, description.dataset.chinese);
  }
}

export function initLanguage() {
  applyLanguage(savedLanguage());
  document.querySelector(".language-toggle")?.addEventListener("click", () => {
    const next = language === "en" ? "zh" : "en";
    try { localStorage.setItem(storageKey, next); } catch { /* Preference still works for this page. */ }
    const url = new URL(window.location.href);
    if (next === "en") url.searchParams.set("lang", "en");
    else url.searchParams.set("lang", "zh");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    applyLanguage(next);
  });
}
