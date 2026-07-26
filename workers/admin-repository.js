const repository = "yaowenhu-pm/yaowenhu-pm.github.io";

export const editableFiles = [
  "js/data.js"
];

function repositoryPath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function decodeContent(value) {
  const bytes = Uint8Array.from(atob(value.replaceAll("\n", "")), (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeContent(value) {
  const bytes = new TextEncoder().encode(value);
  let encoded = "";
  for (let index = 0; index < bytes.length; index += 0x8000) encoded += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return btoa(encoded);
}

async function github(token, path, options = {}) {
  return fetch(`https://api.github.com/repos/${repository}/contents/${repositoryPath(path)}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "Hywen-Website-Editor",
      "X-GitHub-Api-Version": "2026-03-10",
      ...options.headers
    }
  });
}

export async function readFile(token, path) {
  if (!editableFiles.includes(path)) return { error: "该文件不允许编辑。", status: 403 };
  const response = await github(token, path);
  if (!response.ok) return { error: "无法读取该文件。", status: response.status };
  const file = await response.json();
  return { content: decodeContent(file.content), sha: file.sha };
}

export async function writeFile(token, { path, content, sha }) {
  if (!editableFiles.includes(path)) return { error: "该文件不允许编辑。", status: 403 };
  if (typeof content !== "string" || typeof sha !== "string") return { error: "保存参数不完整。", status: 400 };
  const response = await github(token, path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: `Edit ${path} via website editor`, content: encodeContent(content), sha, branch: "main" })
  });
  if (response.status === 409) return { error: "远端文件已更新，请重新加载后再保存。", status: 409 };
  if (!response.ok) return { error: "GitHub 未能保存该文件。", status: response.status };
  const result = await response.json();
  return { commitUrl: result.commit.html_url, sha: result.content.sha };
}

function parseSiteContent(source) {
  const match = source.match(/export const siteContent = (\{[\s\S]*?\n\});/);
  if (!match) return null;
  try {
    return { content: JSON.parse(match[1]), source, block: match[0] };
  } catch {
    return null;
  }
}

function validContent(content) {
  return content && typeof content === "object" && content.hero && content.about && Array.isArray(content.experiences) && Array.isArray(content.projects) && content.style;
}

export async function readSiteContent(token) {
  const file = await readFile(token, "js/data.js");
  if (file.error) return file;
  const parsed = parseSiteContent(file.content);
  if (!parsed) return { error: "主页内容格式无法识别。", status: 500 };
  return { content: parsed.content, sha: file.sha };
}

export async function writeSiteContent(token, { content }) {
  if (!validContent(content)) return { error: "主页内容不完整。", status: 400 };
  const file = await readFile(token, "js/data.js");
  if (file.error) return file;
  const parsed = parseSiteContent(file.content);
  if (!parsed) return { error: "主页内容格式无法识别。", status: 500 };
  const nextBlock = `export const siteContent = ${JSON.stringify(content, null, 2)};`;
  return writeFile(token, { path: "js/data.js", content: file.content.replace(parsed.block, nextBlock), sha: file.sha });
}

export async function uploadAsset(token, { name, data }) {
  if (typeof name !== "string" || typeof data !== "string" || !data.startsWith("data:image/")) return { error: "请选择有效的图片。", status: 400 };
  const extension = name.toLowerCase().match(/\.(png|jpe?g|webp|gif)$/)?.[1];
  if (!extension) return { error: "仅支持 PNG、JPG、WebP 或 GIF 图片。", status: 400 };
  const encoded = data.slice(data.indexOf(",") + 1);
  if (encoded.length > 7_000_000) return { error: "图片请控制在 5MB 以内。", status: 400 };
  const path = `assets/avatar-${Date.now()}.${extension}`;
  const response = await github(token, path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Upload profile photo via website editor", content: encoded, branch: "main" })
  });
  if (!response.ok) return { error: "GitHub 未能上传图片。", status: response.status };
  return { path };
}
