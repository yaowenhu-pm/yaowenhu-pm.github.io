import { education } from "./components/education.js";
import { experience } from "./components/experience.js";
import { footer } from "./components/footer.js";
import { header } from "./components/header.js";
import { hero } from "./components/hero.js";
import { projectsSection } from "./components/projects.js";
import { loadVisitStats } from "./components/stats.js";
import { siteContent } from "./data.js";

let statsLoaded = false;

export function renderPage() {
  document.documentElement.style.setProperty("--editor-accent", siteContent.style.accentColor);
  document.documentElement.style.setProperty("--editor-card-radius", `${siteContent.style.cardRadius}px`);
  document.documentElement.style.setProperty("--editor-section-space", `${siteContent.style.sectionSpace}px`);
  document.querySelector("#app").innerHTML = `${header()}<main>${hero()}${experience()}${projectsSection()}${education()}</main>${footer()}`;
  if (!statsLoaded) {
    statsLoaded = true;
    loadVisitStats();
  }
}

renderPage();

if (new URLSearchParams(window.location.search).get("edit") === "1") import("./editor.js");
