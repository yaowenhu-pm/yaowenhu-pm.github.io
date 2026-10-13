import { siteContent } from "../data.js";
import { text } from "../i18n.js";

const icons = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.08c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .72 2.52.52 3.16.4.1-.73.39-1.23.71-1.51-2.5-.28-5.13-1.25-5.13-5.54 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.15A10.75 10.75 0 0 1 12 5.62c.95 0 1.9.13 2.79.38 2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.7.12 2.98.72.79 1.15 1.79 1.15 3.02 0 4.3-2.64 5.25-5.15 5.53.4.35.76 1.03.76 2.08v3.08c0 .3.21.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg>',
  xiaohongshu: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="3" width="22" height="18" rx="5" fill="currentColor"/><text x="12" y="14.6" text-anchor="middle" fill="var(--bg)" font-family="sans-serif" font-size="6.8" font-weight="700">小红书</text></svg>',
  wechat: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 2.8C4.5 2.8 1 5.7 1 9.2c0 2 1.1 3.8 2.9 5l-.7 2.3 2.6-1.3c.8.2 1.7.4 2.6.4-.2-.6-.3-1.2-.3-1.8 0-4.1 3.5-7.1 8-7.1h.6C15.5 4.4 12.5 2.8 9 2.8Z"/><path d="M16 8.2c-3.9 0-7 2.5-7 5.6s3.1 5.6 7 5.6c.8 0 1.6-.1 2.3-.3l2.3 1.2-.6-2.1c1.8-1 2.9-2.6 2.9-4.4 0-3.1-3.1-5.6-6.9-5.6Z"/><g fill="var(--bg)"><circle cx="6" cy="7.3" r="1"/><circle cx="11.5" cy="7.3" r="1"/><circle cx="13.5" cy="12.3" r=".9"/><circle cx="18.5" cy="12.3" r=".9"/></g></svg>',
  jike: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor"/><path d="M9 14v1a3 3 0 0 0 6 0V7h-4" fill="none" stroke="var(--bg)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4.5" width="20" height="15" rx="3"/><path d="m3 6 9 7 9-7"/></svg>'
};

function socialLink(icon, item, key) {
  if (!item?.url) return "";
  const localized = key ? ` data-i18n-aria-label="${key}"` : "";
  return `<a class="social-icon" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.title}"${localized}>
    ${icons[icon]}<span class="social-tooltip"${key ? ` data-i18n="${key}"` : ""}>${item.title}</span>
  </a>`;
}

export function hero() {
  const { hero: content } = siteContent;
  return `
    <section id="top" class="shell hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title" data-edit="hero.greeting" data-i18n="hero.greeting">${content.greeting}</h1>
        <p class="hero-summary" data-edit="hero.summary" data-i18n="hero.summary">${content.summary}</p>
        <p class="hero-summary" data-edit="hero.introduction" data-i18n="hero.introduction">${content.introduction || "把产品判断与 AI 实践，整理成手册、Skills 和工具。"}</p>
        <p class="hero-summary" data-edit="hero.belief" data-i18n="hero.belief">${content.belief}</p>
        <div class="hero-actions hero-socials" role="group" aria-label="在别处找我" data-i18n-aria-label="social.label">
          ${socialLink("github", siteContent.elsewhere.find((item) => item.url?.includes("github.com")))}
          ${socialLink("xiaohongshu", siteContent.elsewhere.find((item) => /xiaohongshu|xhslink/.test(item.url || "")), "social.xiaohongshu")}
          <details class="contact-dropdown">
            <summary class="social-icon" aria-label="微信" data-i18n-aria-label="social.wechat">${icons.wechat}<span class="social-tooltip" data-i18n="social.wechat">微信</span></summary>
            <div class="email-panel">
              <label for="contact-wechat" data-i18n="contact.wechatId">微信号</label>
              <input id="contact-wechat" type="text" value="${content.wechat}" readonly />
              <button class="pill pill--light" id="copy-wechat" type="button" data-i18n="contact.copyWechat">复制微信号</button>
              <p id="wechat-status" role="status" data-i18n="contact.wechatHint">可通过这个微信号找到我。</p>
            </div>
          </details>
          ${socialLink("jike", siteContent.elsewhere.find((item) => item.url?.includes("okjk.co")), "social.jike")}
          <details class="email-contact contact-dropdown">
            <summary class="social-icon" aria-label="发送邮件" data-i18n-aria-label="contact.email">${icons.email}<span class="social-tooltip" data-i18n="contact.email">邮件</span></summary>
            <div class="email-panel">
              <label for="contact-email" data-i18n="contact.emailAddress">联系邮箱</label>
              <input id="contact-email" type="text" value="${content.email}" readonly />
              <div class="email-actions">
                <button class="pill pill--light" id="copy-email" type="button" data-i18n="contact.copyEmail">复制邮箱</button>
                <a href="mailto:${content.email}" data-i18n="contact.openEmail">打开邮件应用</a>
              </div>
              <p id="email-status" role="status" data-i18n="contact.emailHint">可复制邮箱，在常用邮箱中写信。</p>
            </div>
          </details>
        </div>
      </div>
      <figure class="hero-photo">
        <img src="${content.photo}" alt="${content.name}的照片" data-i18n-alt="hero.photo" data-edit-photo />
      </figure>
    </section>`;
}

async function copyAddress(address) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(address.value);
      return true;
    }
  } catch { /* Select the visible address when clipboard permission is denied. */ }
  address.focus();
  address.select();
  address.setSelectionRange(0, address.value.length);
  try { return document.execCommand("copy"); } catch { return false; }
}

export function initEmailCopy() {
  const button = document.querySelector("#copy-email");
  const address = document.querySelector("#contact-email");
  const status = document.querySelector("#email-status");
  if (!button || !address || !status) return;

  button.addEventListener("click", async () => {
    const copied = await copyAddress(address);
    status.textContent = copied
      ? text("contact.emailCopied", "邮箱已复制，可在常用邮箱中粘贴收件人。")
      : text("contact.emailFallback", "请长按或按 Ctrl/Cmd+C 复制已选中的邮箱。");
  });
}

export function initWechatCopy() {
  const button = document.querySelector("#copy-wechat");
  const address = document.querySelector("#contact-wechat");
  const status = document.querySelector("#wechat-status");
  if (!button || !address || !status) return;
  button.addEventListener("click", async () => {
    const copied = await copyAddress(address);
    status.textContent = copied ? text("contact.wechatCopied", "微信号已复制。")
      : text("contact.wechatFallback", "请长按或按 Ctrl/Cmd+C 复制已选中的微信号。");
  });
  const panels = document.querySelectorAll(".contact-dropdown");
  for (const panel of panels) {
    panel.addEventListener("toggle", () => {
      if (panel.open) for (const other of panels) if (other !== panel) other.open = false;
    });
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        panel.open = false;
        panel.querySelector("summary").focus();
      }
    });
  }
}
