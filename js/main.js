import { initEmailCopy, initWechatCopy } from "./components/hero.js";
import { initTheme } from "./components/theme.js";
import { initThoughts } from "./components/thoughts.js";
import { siteContent } from "./data.js";
import { pageMarkup, legacyDestination } from "./pages.js";

export function renderPage() {
  document.documentElement.style.setProperty("--editor-accent", siteContent.style.accentColor);
  document.documentElement.style.setProperty("--editor-card-radius", `${siteContent.style.cardRadius}px`);
  document.documentElement.style.setProperty("--editor-section-space", `${siteContent.style.sectionSpace}px`);
  const page = document.body.dataset.page || "experience";
  document.querySelector("#app").innerHTML = pageMarkup(page);
  initPageInteractions();
}

function initPageInteractions() {
  const page = document.body.dataset.page || "experience";
  initTheme();
  if (page === "experience") {
    initEmailCopy();
    initWechatCopy();
  }
  if (page === "thoughts") initThoughts();
}

function redirectLegacyLink() {
  const destination = legacyDestination(window.location.pathname, window.location.search, window.location.hash);
  if (destination) window.location.replace(destination);
  return Boolean(destination);
}

window.addEventListener("hashchange", redirectLegacyLink);
if (!redirectLegacyLink()) {
  // Thoughts are published with their HTML; cached data must not replace it.
  // Profile pages also support data-only updates from the existing web editor.
  if (document.body.dataset.page === "thoughts") initPageInteractions();
  else renderPage();
  if (new URLSearchParams(window.location.search).get("edit") === "1") import("./editor.js");
}
