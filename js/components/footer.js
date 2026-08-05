import { siteContent, githubUrl } from "../data.js";

export function footer() {
  return `
    <footer class="shell footer">
      <p class="footer-slogan" data-edit="footer.slogan">${siteContent.footer.slogan}</p>
      <div class="footer-row">
        <p>© 胡耀文</p>
        <a href="${githubUrl}" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">&#8599;</span></a>
      </div>
    </footer>`;
}
