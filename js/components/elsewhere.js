import { siteContent } from "../data.js";

export function elsewhere() {
  const rows = siteContent.elsewhere.map((item, index) => `
    <a class="rowitem" href="${item.qr || item.url}" target="_blank" rel="noreferrer" data-edit-card="elsewhere" data-edit-index="${index}">
      <h3 data-edit="elsewhere.${index}.title">${item.title}</h3>
      <span class="ext" aria-hidden="true">&#8599;</span>
      <p data-edit="elsewhere.${index}.description">${item.description}</p>
    </a>`).join("");

  return `
    <section id="elsewhere" class="shell section" aria-labelledby="elsewhere-title">
      <div class="section-heading">
        <h2 id="elsewhere-title">在别处找我</h2>
      </div>
      <div class="elsewhere-list">${rows}</div>
    </section>`;
}
