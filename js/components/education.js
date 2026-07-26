import { siteContent } from "../data.js";

export function education() {
  const { education: content } = siteContent;
  return `
    <section class="shell section education" aria-labelledby="education-title">
      <div class="section-heading">
        <h2 id="education-title">教育经历</h2>
      </div>
      <div class="education-content">
        <p><span class="education-school" data-edit="education.school">${content.school}</span></p>
        <p data-edit="education.degree">${content.degree}</p>
      </div>
    </section>`;
}
