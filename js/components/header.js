import { githubUrl } from "../data.js";

export function header() {
  return `
    <header class="site-header">
      <nav class="shell nav" aria-label="主导航">
        <a class="brand" href="#top" aria-label="返回顶部">胡耀文</a>
        <div class="nav-links">
          <a href="#experience">经历</a>
          <a href="#work">作品</a>
          <a href="assets/resume.pdf" target="_blank" rel="noreferrer">简历 PDF</a>
        </div>
        <a class="github-link" href="${githubUrl}" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">&#8599;</span></a>
      </nav>
    </header>`;
}
