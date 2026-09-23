import { siteContent } from "./data.js";
import { renderPage } from "./main.js";

const editorOrigin = "https://hyw-visit-counter.infidive-tv.workers.dev";
const initial = JSON.parse(JSON.stringify(siteContent));
const undoHistory = [];
let token = sessionStorage.getItem("hyw-editor-token");
let activeCard = null;
let editingPath = null;
let leavingConfirmed = false;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function replaceContent(content) {
  Object.keys(siteContent).forEach((key) => delete siteContent[key]);
  Object.assign(siteContent, content);
}

function getPath(path) {
  return path.split(".").reduce((value, key) => value[key], siteContent);
}

function setPath(path, value) {
  const keys = path.split(".");
  const key = keys.pop();
  keys.reduce((target, part) => target[part], siteContent)[key] = value;
}

function snapshot() {
  undoHistory.push(clone(siteContent));
  if (undoHistory.length > 30) undoHistory.shift();
  updateToolbar();
}

function hasUnsavedChanges() {
  // 聚焦也会创建撤销快照；比较基线避免未改文字时误提示。
  return JSON.stringify(siteContent) !== JSON.stringify(initial);
}

function preserveEditorNavigation() {
  document.querySelectorAll(".site-header .brand, .site-header .nav-links a").forEach((link) => {
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    url.searchParams.set("edit", "1");
    link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
  });
}

function protectUnsavedChanges(event) {
  if (leavingConfirmed || !hasUnsavedChanges()) return;
  event.preventDefault();
  event.returnValue = "";
}

function api(path, options = {}) {
  return fetch(`${editorOrigin}/editor/api${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) }
  });
}

function status(message, tone = "") {
  const node = document.querySelector("#edit-status");
  node.textContent = message;
  node.dataset.tone = tone;
}

function openLogin() {
  const returnTo = `${location.origin}${location.pathname}?edit=1`;
  location.href = `${editorOrigin}/editor/login?return_to=${encodeURIComponent(returnTo)}`;
}

function addToolbar() {
  document.querySelector("#edit-toolbar")?.remove();
  document.body.insertAdjacentHTML("beforeend", `
    <aside class="edit-toolbar" id="edit-toolbar">
      <div class="edit-toolbar-main">
        <strong>编辑主页</strong>
        <span id="edit-status" aria-live="polite">点击文字、头像或卡片开始编辑</span>
      </div>
      <div class="edit-toolbar-actions">
        <button type="button" id="edit-style">页面风格</button>
        <button type="button" id="edit-undo" disabled>撤销</button>
        <button type="button" id="edit-discard">放弃修改</button>
        <button type="button" class="edit-publish" id="edit-publish">发布更新</button>
        <button type="button" id="edit-exit">退出</button>
      </div>
      <div class="edit-popover" id="edit-popover" hidden></div>
    </aside>`);
  document.querySelector("#edit-style").addEventListener("click", showStyle);
  document.querySelector("#edit-undo").addEventListener("click", undo);
  document.querySelector("#edit-discard").addEventListener("click", discard);
  document.querySelector("#edit-publish").addEventListener("click", publish);
  document.querySelector("#edit-exit").addEventListener("click", exit);
}

function updateToolbar() {
  const undo = document.querySelector("#edit-undo");
  if (undo) undo.disabled = undoHistory.length === 0;
}

function showPopover(html) {
  const popover = document.querySelector("#edit-popover");
  popover.innerHTML = html;
  popover.hidden = false;
  popover.querySelector("[data-close]")?.addEventListener("click", () => { popover.hidden = true; });
}

function showStyle() {
  activeCard = null;
  document.querySelectorAll(".edit-selected").forEach((node) => node.classList.remove("edit-selected"));
  showPopover(`<h2>页面风格</h2>
    <label>主色 <input data-style="accentColor" type="color" value="${siteContent.style.accentColor}" /></label>
    <label>卡片圆角 <input data-style="cardRadius" type="number" min="0" max="60" value="${siteContent.style.cardRadius}" /></label>
    <label>区块间距 <input data-style="sectionSpace" type="number" min="24" max="100" value="${siteContent.style.sectionSpace}" /></label>
    <button type="button" data-close>完成</button>`);
  document.querySelectorAll("[data-style]").forEach((input) => input.addEventListener("change", () => {
    snapshot();
    siteContent.style[input.dataset.style] = input.type === "number" ? Number(input.value) : input.value;
    renderEditablePage();
    showStyle();
  }));
}

function showCardActions(type, index, card) {
  activeCard = { type, index };
  document.querySelectorAll(".edit-selected").forEach((node) => node.classList.remove("edit-selected"));
  card.classList.add("edit-selected");
  const item = siteContent[type][index];
  const linkField = type === "projects" ? `<label>作品链接 <input id="edit-link" type="url" value="${item.url}" /></label>` : "";
  showPopover(`<h2>${type === "projects" ? "作品" : "经历"}操作</h2>${linkField}
    <div class="edit-card-actions"><button type="button" data-card-action="up">上移</button><button type="button" data-card-action="down">下移</button><button type="button" data-card-action="delete">删除</button></div>`);
  document.querySelector("#edit-link")?.addEventListener("change", (event) => {
    snapshot();
    item.url = event.target.value.trim();
    renderEditablePage();
    showCardActions(type, index, document.querySelector(`[data-edit-card="${type}"][data-edit-index="${index}"]`));
  });
  document.querySelectorAll("[data-card-action]").forEach((button) => button.addEventListener("click", () => cardAction(button.dataset.cardAction)));
}

function cardAction(action) {
  const { type, index } = activeCard;
  const items = siteContent[type];
  if (action === "delete" && !confirm("确定删除这张卡片吗？")) return;
  snapshot();
  if (action === "delete") items.splice(index, 1);
  if (action === "up" && index > 0) [items[index - 1], items[index]] = [items[index], items[index - 1]];
  if (action === "down" && index < items.length - 1) [items[index + 1], items[index]] = [items[index], items[index + 1]];
  activeCard = null;
  renderEditablePage();
  document.querySelector("#edit-popover").hidden = true;
}

function addCard(type) {
  snapshot();
  siteContent[type].push(type === "experiences" ? { date: "时间", company: "公司", role: "职位", summary: "一句话介绍这段经历。", points: ["输入一条工作要点。"] } : { type: "项目类型", title: "新作品", description: "输入作品介绍。", url: "https://" });
  renderEditablePage();
}

function bindEditableElements() {
  document.querySelectorAll("[data-edit]").forEach((node) => {
    node.contentEditable = "true";
    node.spellcheck = false;
    node.addEventListener("focus", () => {
      if (editingPath !== node.dataset.edit) { snapshot(); editingPath = node.dataset.edit; }
    });
    node.addEventListener("blur", () => { editingPath = null; });
    node.addEventListener("input", () => {
      const value = node.textContent.trim();
      setPath(node.dataset.edit, value);
      document.querySelectorAll(`[data-edit="${node.dataset.edit}"]`).forEach((same) => { if (same !== node) same.textContent = value; });
    });
  });
  document.querySelector("[data-edit-photo]")?.addEventListener("click", choosePhoto);
  document.querySelectorAll("[data-edit-card]").forEach((card) => card.addEventListener("click", (event) => {
    if (event.target.closest("[data-edit]")) return;
    event.preventDefault();
    showCardActions(card.dataset.editCard, Number(card.dataset.editIndex), card);
  }));
  ["experiences", "projects"].forEach((type) => {
    const list = document.querySelector(type === "experiences" ? ".experience-list" : ".project-list");
    list?.insertAdjacentHTML("beforeend", `<button type="button" class="edit-add-card" data-add-card="${type}">＋ 添加${type === "experiences" ? "经历" : "作品"}</button>`);
  });
  document.querySelectorAll("[data-add-card]").forEach((button) => button.addEventListener("click", () => addCard(button.dataset.addCard)));
}

function renderEditablePage() {
  renderPage();
  preserveEditorNavigation();
  bindEditableElements();
  updateToolbar();
}

async function choosePhoto() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/webp,image/gif";
  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;
    status("正在上传照片…");
    const data = await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); });
    const response = await api("/assets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: file.name, data }) });
    const result = await response.json();
    if (!response.ok) return status(result.error || "照片上传失败。", "error");
    snapshot();
    siteContent.hero.photo = result.path;
    renderEditablePage();
    status("照片已替换，发布后生效。", "success");
  });
  input.click();
}

function undo() {
  const previous = undoHistory.pop();
  if (!previous) return;
  replaceContent(previous);
  renderEditablePage();
  status("已撤销上一步修改。");
}

function discard() {
  if (!confirm("放弃本次尚未发布的修改吗？")) return;
  replaceContent(clone(initial));
  undoHistory.length = 0;
  activeCard = null;
  renderEditablePage();
  document.querySelector("#edit-popover").hidden = true;
  status("已恢复到进入编辑前的内容。");
}

async function publish() {
  const button = document.querySelector("#edit-publish");
  button.disabled = true;
  status("正在发布更新…");
  const response = await api("/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: siteContent }) });
  const result = await response.json();
  button.disabled = false;
  if (!response.ok) return status(result.error || "发布失败。", "error");
  Object.assign(initial, clone(siteContent));
  undoHistory.length = 0;
  updateToolbar();
  status("已发布，主页正在更新。", "success");
}

function exit() {
  if (hasUnsavedChanges() && !confirm("还有未发布的修改，仍要退出吗？")) return;
  // 已明确确认退出，不再触发浏览器第二次离开提示。
  leavingConfirmed = true;
  sessionStorage.removeItem("hyw-editor-token");
  location.href = location.pathname;
}

function showLogin() {
  document.body.classList.add("edit-mode", "edit-login");
  document.body.insertAdjacentHTML("beforeend", `<aside class="edit-login-card"><p>主页编辑</p><h1>直接在页面上修改内容</h1><button type="button" id="edit-login">开始编辑</button></aside>`);
  document.querySelector("#edit-login").addEventListener("click", openLogin);
}

async function initialize() {
  const hash = new URLSearchParams(location.hash.slice(1));
  const returnedToken = hash.get("editor_token");
  if (returnedToken) {
    token = returnedToken;
    sessionStorage.setItem("hyw-editor-token", token);
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  }
  if (!token) return showLogin();
  const session = await api("/session");
  if (!session.ok) { sessionStorage.removeItem("hyw-editor-token"); return showLogin(); }
  const contentResponse = await api("/content");
  const result = await contentResponse.json();
  if (!contentResponse.ok) return showLogin();
  replaceContent(result.content);
  replaceContent(clone(siteContent));
  Object.assign(initial, clone(siteContent));
  document.body.classList.add("edit-mode");
  addToolbar();
  renderEditablePage();
}

preserveEditorNavigation();
window.addEventListener("beforeunload", protectUnsavedChanges);
initialize();
