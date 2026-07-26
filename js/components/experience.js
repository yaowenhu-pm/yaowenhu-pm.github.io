import { experiences } from "../data.js";

export function experience() {
  const items = experiences.map((item, index) => `
    <article class="experience-item" data-edit-card="experiences" data-edit-index="${index}">
      <p class="experience-no"><span>0${index + 1}</span> · <span data-edit="experiences.${index}.date">${item.date}</span></p>
      <h3><span data-edit="experiences.${index}.company">${item.company}</span><span class="experience-role" data-edit="experiences.${index}.role">${item.role}</span></h3>
      <p class="experience-summary" data-edit="experiences.${index}.summary">${item.summary}</p>
      ${item.points.length ? `<ul>${item.points.map((point, pointIndex) => `<li data-edit="experiences.${index}.points.${pointIndex}">${point}</li>`).join("")}</ul>` : ""}
    </article>`).join("");

  return `
    <section id="experience" class="shell section" aria-labelledby="experience-title">
      <div class="section-heading">
        <h2 id="experience-title">实习经历</h2>
      </div>
      <div class="experience-list">${items}</div>
    </section>`;
}
