import { projects } from "../data.js";

export function projectsSection() {
  const rows = projects.map((project, index) => `
    <a class="rowitem" href="${project.url}" target="_blank" rel="noreferrer" data-edit-card="projects" data-edit-index="${index}">
      <h3 data-edit="projects.${index}.title">${project.title}</h3>
      <span class="ext" aria-hidden="true">&#8599;</span>
      <p data-edit="projects.${index}.description">${project.description}</p>
    </a>`).join("");

  return `
    <section id="work" class="shell section work" aria-labelledby="work-title">
      <div class="section-heading">
        <h2 id="work-title">代表作品</h2>
      </div>
      <div class="project-list">${rows}</div>
    </section>`;
}
