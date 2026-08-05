import { siteContent } from "../data.js";

export function hero() {
  const { hero: content } = siteContent;
  return `
    <section id="top" class="shell hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title" data-edit="hero.greeting">${content.greeting}</h1>
        <p class="hero-summary" data-edit="hero.summary">${content.summary}</p>
        <p class="hero-summary" data-edit="hero.belief">${content.belief}</p>
        <div class="hero-actions">
          <a class="pill pill--light" href="${content.githubUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a class="pill pill--light" href="mailto:${content.email}">发送邮件</a>
          <button class="pill pill--light" id="copy-wechat" type="button" data-wechat="${content.wechat}">复制微信号</button>
        </div>
      </div>
      <figure class="hero-photo">
        <img src="${content.photo}" alt="${content.name}的照片" data-edit-photo />
      </figure>
    </section>`;
}

export function initWechatCopy() {
  const button = document.querySelector("#copy-wechat");
  if (!button) return;
  button.addEventListener("click", () => {
    const showCopied = () => {
      const original = button.textContent;
      button.textContent = "已复制";
      setTimeout(() => { button.textContent = original; }, 1600);
    };
    navigator.clipboard.writeText(button.dataset.wechat).then(showCopied).catch(() => {
      const helper = document.createElement("textarea");
      helper.value = button.dataset.wechat;
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
      showCopied();
    });
  });
}
