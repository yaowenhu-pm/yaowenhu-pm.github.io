import { beginLogin, completeLogin } from "./admin-auth.js";
import { readSiteContent, uploadAsset, writeSiteContent } from "./admin-repository.js";
import { sessionRequest } from "./admin-session.js";

const allowedOrigin = "https://yaowenhu-pm.github.io";

function corsHeaders() {
  return { "Access-Control-Allow-Origin": allowedOrigin, "Access-Control-Allow-Headers": "Authorization, Content-Type", "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS", Vary: "Origin" };
}

function json(value, status = 200) {
  return Response.json(value, { status, headers: corsHeaders() });
}

async function currentSession(request, env) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const response = await sessionRequest(env, `/session?key=session:${token}`);
  const session = await response.json();
  return session?.expiresAt > Date.now() ? session : null;
}

export async function handleEditorRequest(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/admin/auth/callback" && request.method === "GET") return completeLogin(request, env);
  if (!url.pathname.startsWith("/editor")) return null;
  if (url.pathname === "/editor/login" && request.method === "GET") return beginLogin(request, env);
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });
  const session = await currentSession(request, env);
  if (!session) return json({ error: "Unauthorized" }, 401);
  if (url.pathname === "/editor/api/session" && request.method === "GET") return json({ login: session.login, expiresAt: session.expiresAt });
  if (url.pathname === "/editor/api/content" && request.method === "GET") {
    const result = await readSiteContent(session.token);
    return json(result, result.status || 200);
  }
  if (url.pathname === "/editor/api/content" && request.method === "PUT") {
    let payload;
    try { payload = await request.json(); } catch { return json({ error: "请求格式不正确。" }, 400); }
    const result = await writeSiteContent(session.token, payload);
    return json(result, result.status || 200);
  }
  if (url.pathname === "/editor/api/assets" && request.method === "POST") {
    let payload;
    try { payload = await request.json(); } catch { return json({ error: "请求格式不正确。" }, 400); }
    const result = await uploadAsset(session.token, payload);
    return json(result, result.status || 200);
  }
  return json({ error: "Not found" }, 404);
}
