import { themeToggle } from "./theme.js";

export function header(page = "experience") {
  return `
    <header class="site-header">
      <nav class="shell nav" aria-label="主导航" data-i18n-aria-label="nav.label">
        <a class="brand" href="/" data-page-link aria-label="胡耀文 · 经历首页" data-i18n="nav.brand" data-i18n-aria-label="nav.home">胡耀文</a>
        <div class="nav-links">
          <a href="/"${page === "experience" ? ' aria-current="page"' : ""} data-page-link data-i18n="nav.experience">经历</a>
          <a href="/work/"${page === "work" ? ' aria-current="page"' : ""} data-page-link data-i18n="nav.work">作品</a>
          <a href="/thoughts/"${page === "thoughts" ? ' aria-current="page"' : ""} data-page-link data-i18n="nav.thoughts">随想</a>
        </div>
        <div class="nav-tools">
          <button class="language-toggle" type="button" aria-label="Switch to English" lang="en" title="Switch to English">EN</button>
          ${themeToggle()}
        </div>
      </nav>
    </header>`;
}
