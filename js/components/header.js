import { themeToggle } from "./theme.js";

export function header(page = "experience") {
  return `
    <header class="site-header">
      <nav class="shell nav" aria-label="主导航">
        <a class="brand" href="/" aria-label="胡耀文 · 经历首页">胡耀文</a>
        <div class="nav-links">
          <a href="/"${page === "experience" ? ' aria-current="page"' : ""}>经历</a>
          <a href="/work/"${page === "work" ? ' aria-current="page"' : ""}>作品</a>
          <a href="/thoughts/"${page === "thoughts" ? ' aria-current="page"' : ""}>随想</a>
        </div>
        <div class="nav-tools">
          ${themeToggle()}
        </div>
      </nav>
    </header>`;
}
