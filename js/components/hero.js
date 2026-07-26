import { siteContent } from "../data.js";

export function hero() {
  const { hero: content } = siteContent;
  return `
    <section id="top" class="shell hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title" data-edit="hero.greeting">${content.greeting}</h1>
        <p class="hero-meta" data-edit="hero.meta">${content.meta}</p>
        <p class="hero-summary" data-edit="hero.summary">${content.summary}</p>
        <div class="hero-actions">
          <a class="pill pill--dark" href="mailto:${content.email}">发送邮件</a>
          <a class="pill pill--light" href="${content.resumeUrl}" target="_blank" rel="noreferrer">简历 PDF</a>
          <a class="pill pill--light" href="${content.githubUrl}" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <a class="hero-email" href="mailto:${content.email}" data-edit="hero.email">${content.email}</a>
      </div>
      <figure class="hero-photo">
        <img src="${content.photo}" alt="${content.name}的照片" data-edit-photo />
      </figure>
    </section>`;
}
