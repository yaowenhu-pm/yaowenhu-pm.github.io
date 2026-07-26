import { randomId, sessionRequest } from "./admin-session.js";

const allowedLogin = "yaowenhu-pm";
const repositoryId = "1298378322";

function callbackUrl(request) {
  return new URL("/admin/auth/callback", request.url).toString();
}

function configured(env) {
  return env.GITHUB_APP_CLIENT_ID && env.GITHUB_APP_CLIENT_SECRET && env.SESSION_SECRET;
}

function validReturnTo(value) {
  try {
    return new URL(value).origin === "https://yaowenhu-pm.github.io";
  } catch {
    return false;
  }
}

function errorPage(message, status = 400) {
  return new Response(`<!doctype html><meta charset="utf-8"><title>主页编辑登录失败</title><p>${message}</p>`, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

async function codeChallenge(verifier) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
  let value = "";
  for (const byte of digest) value += String.fromCharCode(byte);
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export async function beginLogin(request, env) {
  if (!configured(env)) return errorPage("主页编辑尚未完成登录配置。", 503);
  const returnTo = new URL(request.url).searchParams.get("return_to");
  if (!returnTo || !validReturnTo(returnTo)) return errorPage("返回地址不正确。");
  const state = randomId();
  const verifier = randomId();
  await sessionRequest(env, `/state?key=oauth:${state}`, {
    method: "PUT",
    body: JSON.stringify({ value: { verifier, returnTo }, expirationTtl: 600 })
  });
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.search = new URLSearchParams({
    client_id: env.GITHUB_APP_CLIENT_ID,
    redirect_uri: callbackUrl(request),
    state,
    code_challenge: await codeChallenge(verifier),
    code_challenge_method: "S256",
    login: allowedLogin,
    allow_signup: "false"
  });
  return Response.redirect(authorizeUrl.toString(), 302);
}

export async function completeLogin(request, env) {
  if (!configured(env)) return errorPage("主页编辑尚未完成登录配置。", 503);
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!state || !code) return errorPage("GitHub 未返回有效授权信息。");
  const stateResponse = await sessionRequest(env, `/state?key=oauth:${state}`, { method: "DELETE" });
  const stateRecord = await stateResponse.json();
  if (!stateRecord?.verifier) return errorPage("登录已过期，请重新登录。");
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Hywen-Website-Editor" },
    body: new URLSearchParams({
      client_id: env.GITHUB_APP_CLIENT_ID,
      client_secret: env.GITHUB_APP_CLIENT_SECRET,
      code,
      redirect_uri: callbackUrl(request),
      code_verifier: stateRecord.verifier,
      repository_id: repositoryId
    })
  });
  const tokenText = await tokenResponse.text();
  let token;
  try {
    token = JSON.parse(tokenText);
  } catch {
    console.error("GitHub token exchange returned a non-JSON response", tokenResponse.status, tokenText.slice(0, 200));
    return errorPage("GitHub 拒绝了授权请求，请重新登录。", 401);
  }
  if (!tokenResponse.ok || !token.access_token) {
    console.error("GitHub token exchange failed", tokenResponse.status, token.error || "unknown error");
    return errorPage("无法获取 GitHub 授权，请重新登录。", 401);
  }
  const userResponse = await fetch("https://api.github.com/user", {
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token.access_token}`, "User-Agent": "Hywen-Website-Editor", "X-GitHub-Api-Version": "2026-03-10" }
  });
  const user = await userResponse.json();
  if (!userResponse.ok || user.login !== allowedLogin) return new Response("Forbidden", { status: 403 });
  const sessionId = randomId();
  const expirationTtl = Math.min(Number(token.expires_in) || 28800, 28800);
  await sessionRequest(env, `/session?key=session:${sessionId}`, {
    method: "PUT",
    body: JSON.stringify({ value: { login: user.login, token: token.access_token, expiresAt: Date.now() + expirationTtl * 1000 }, expirationTtl })
  });
  const returnUrl = new URL(stateRecord.returnTo);
  returnUrl.hash = `editor_token=${sessionId}`;
  return Response.redirect(returnUrl.toString(), 302);
}
