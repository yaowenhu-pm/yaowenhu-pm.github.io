import { siteContent } from "../data.js";

export function footer() {
  return `
    <footer class="shell footer">
      <p class="footer-slogan" data-edit="footer.slogan">${siteContent.footer.slogan}</p>
      <div class="footer-row">
        <p data-i18n="footer.copyright">© 胡耀文</p>
      </div>
    </footer>`;
}
