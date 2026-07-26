import { education } from "./components/education.js";
import { elsewhere } from "./components/elsewhere.js";
import { experience } from "./components/experience.js";
import { footer } from "./components/footer.js";
import { header } from "./components/header.js";
import { hero, initWechatCopy } from "./components/hero.js";
import { projectsSection } from "./components/projects.js";
import { loadVisitStats } from "./components/stats.js";
import { initTheme } from "./components/theme.js";
import { siteContent } from "./data.js";

let statsLoaded = false;

export function renderPage() {
  document.documentElement.style.setProperty("--editor-accent", siteContent.style.accentColor);
  document.documentElement.style.setProperty("--editor-card-radius", `${siteContent.style.cardRadius}px`);
  document.documentElement.style.setProperty("--editor-section-space", `${siteContent.style.sectionSpace}px`);
  document.querySelector("#app").innerHTML = `${header()}<main>${hero()}${education()}${experience()}${projectsSection()}${elsewhere()}</main>${footer()}`;
  initTheme();
  initWechatCopy();
  if (!statsLoaded) {
    statsLoaded = true;
    loadVisitStats();
  }
}

renderPage();

if (new URLSearchParams(window.location.search).get("edit") === "1") import("./editor.js");
