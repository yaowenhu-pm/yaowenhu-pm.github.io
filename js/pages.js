import { elsewhere } from "./components/elsewhere.js";
import { experience } from "./components/experience.js";
import { footer } from "./components/footer.js";
import { header } from "./components/header.js";
import { projectsSection } from "./components/projects.js";
import { thoughtsSection } from "./components/thoughts.js";

export const pages = {
  experience: { path: "/", file: "index.html", title: "经历 · 胡耀文", description: "胡耀文的实习经历。" },
  work: { path: "/work/", file: "work/index.html", title: "作品 · 胡耀文", description: "胡耀文的作品，以及在别处找到我的方式。" },
  thoughts: { path: "/thoughts/", file: "thoughts/index.html", title: "随想 · 胡耀文", description: "从朋友圈选一些文字，记录胡耀文日常的思考。" }
};

export function pageMarkup(page) {
  if (!Object.hasOwn(pages, page)) throw new Error("未知页面");
  const content = page === "experience" ? experience()
    : page === "work" ? `${projectsSection()}${elsewhere()}` : thoughtsSection();
  return `${header(page)}<main>${content}</main>${footer()}`;
}

export function legacyDestination(pathname, search, hash) {
  if (pathname !== "/" && pathname !== "/index.html") return null;
  if (hash === "#work" || hash === "#elsewhere") return `/work/${search}${hash === "#elsewhere" ? hash : ""}`;
  if (hash === "#thoughts" || hash.startsWith("#note-")) return `/thoughts/${search}${hash === "#thoughts" ? "" : hash}`;
  return null;
}
