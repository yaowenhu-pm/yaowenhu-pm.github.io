import { createHash } from "node:crypto";

const han = /\p{Script=Han}/u;
const urlPattern = /https?:\/\/[^\s]+/gu;

export function sourceHash(note) {
  return createHash("sha256").update(JSON.stringify([note.id, note.date, note.title, note.content])).digest("hex");
}

export function embeddedTranslations(html) {
  const match = html.match(/<template id="thoughts-english-data">([\s\S]*?)<\/template>/);
  return match ? JSON.parse(match[1]) : {};
}

export function validateTranslation(note, translation) {
  if (!translation || translation.sourceHash !== sourceHash(note)) throw new Error(`${note.id}: 英文译文缺失或与当前原文不一致`);
  for (const key of ["title", "content"]) {
    const value = translation[key];
    if (typeof value !== "string" || !value.trim() || han.test(value) || value.length > 200000 ||
        /MYMEMORY WARNING|QUERY LENGTH LIMIT|DAILY LIMIT|INVALID LANGUAGE PAIR/i.test(value)) {
      throw new Error(`${note.id}: ${key} 未完整翻译成英文，停止发布`);
    }
    const urls = (text) => [...text.matchAll(urlPattern)].map((match) => match[0]);
    if (JSON.stringify(urls(value)) !== JSON.stringify(urls(note[key]))) throw new Error(`${note.id}: 翻译改变了原文链接`);
    if (key === "content" && value.split(/\n\s*\n/).length !== note.content.split(/\n\s*\n/).length) {
      throw new Error(`${note.id}: 翻译丢失了原文段落`);
    }
  }
  // Never carry arbitrary fields from a translator or old cache into public HTML.
  return { sourceHash: translation.sourceHash, title: translation.title, content: translation.content };
}

export function splitSegments(text, maxBytes = 480) {
  const segments = [];
  let remaining = text;
  while (Buffer.byteLength(remaining, "utf8") > maxBytes) {
    let end = 0;
    let bytes = 0;
    let boundary = 0;
    for (const character of remaining) {
      if (bytes + Buffer.byteLength(character, "utf8") > maxBytes) break;
      bytes += Buffer.byteLength(character, "utf8");
      end += character.length;
      if (/[。！？；，、.!?;:\s]/u.test(character) && bytes >= maxBytes / 2) boundary = end;
    }
    end = boundary || end;
    segments.push(remaining.slice(0, end));
    remaining = remaining.slice(end);
  }
  if (remaining) segments.push(remaining);
  return segments;
}

function decodeEntities(text) {
  return text.replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi, (entity) => {
    const named = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'" };
    if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
    const numeric = entity.slice(2, -1);
    const code = numeric[0].toLowerCase() === "x" ? parseInt(numeric.slice(1), 16) : parseInt(numeric, 10);
    return code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  });
}

export async function translateText(text, fetcher = fetch) {
  const pieces = text.split(/(\n+|https?:\/\/[^\s]+)/gu);
  const output = [];
  for (const piece of pieces) {
    if (!han.test(piece)) { output.push(piece); continue; }
    const translated = [];
    for (const segment of splitSegments(piece)) {
      if (!han.test(segment)) { translated.push(segment); continue; }
      const url = new URL("https://api.mymemory.translated.net/get");
      url.searchParams.set("q", segment);
      url.searchParams.set("langpair", "zh-CN|en");
      let lastError;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetcher(url, { signal: AbortSignal.timeout(20000) });
          const result = await response.json();
          if (!response.ok || Number(result.responseStatus) !== 200 || result.quotaFinished) {
            throw new Error(`翻译服务不可用或额度耗尽 (${result.responseStatus || response.status})`);
          }
          const value = result.responseData?.translatedText;
          if (typeof value !== "string" || !value.trim() || han.test(value)) throw new Error("翻译服务未返回完整英文");
          translated.push(decodeEntities(value));
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
      if (lastError) throw lastError;
    }
    output.push(translated.join(" "));
  }
  return output.join("");
}

export async function ensureTranslations(notes, cache = {}, translate = translateText) {
  const result = {};
  for (const note of notes) {
    try {
      result[note.id] = validateTranslation(note, cache[note.id]);
      continue;
    } catch { /* A new, modified or invalid entry must be translated again. */ }
    console.log(`生成英文随想：${note.id}`);
    try {
      result[note.id] = validateTranslation(note, {
        sourceHash: sourceHash(note),
        title: await translate(note.title),
        content: await translate(note.content)
      });
    } catch (error) {
      throw new Error(`${note.id}: 自动翻译失败，未写入任何页面。请修复翻译服务或使用 --translations=已核对的英文JSON后重试。${error.message}`, { cause: error });
    }
  }
  return result;
}
