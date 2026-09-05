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
          <details class="email-contact">
            <summary class="pill pill--light">发送邮件</summary>
            <div class="email-panel">
              <label for="contact-email">联系邮箱</label>
              <input id="contact-email" type="text" value="${content.email}" readonly />
              <div class="email-actions">
                <button class="pill pill--light" id="copy-email" type="button">复制邮箱</button>
                <a href="mailto:${content.email}">打开邮件应用</a>
              </div>
              <p id="email-status" role="status">可复制邮箱，在常用邮箱中写信。</p>
            </div>
          </details>
          <button class="pill pill--light" id="copy-wechat" type="button" data-wechat="${content.wechat}">复制微信号</button>
        </div>
      </div>
      <figure class="hero-photo">
        <img src="${content.photo}" alt="${content.name}的照片" data-edit-photo />
      </figure>
    </section>`;
}

export function initEmailCopy() {
  const button = document.querySelector("#copy-email");
  const address = document.querySelector("#contact-email");
  const status = document.querySelector("#email-status");
  if (!button || !address || !status) return;

  button.addEventListener("click", async () => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address.value);
        copied = true;
      }
    } catch {
      // Fall back to selecting the visible address when clipboard access is denied.
    }
    if (!copied) {
      address.focus();
      address.select();
      address.setSelectionRange(0, address.value.length);
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
    }
    status.textContent = copied
      ? "邮箱已复制，可在常用邮箱中粘贴收件人。"
      : "请长按或按 Ctrl/Cmd+C 复制已选中的邮箱。";
  });
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
