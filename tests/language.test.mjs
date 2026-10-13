import test from "node:test";
import assert from "node:assert/strict";
import { applyLanguage, text } from "../js/i18n.js";

test("profile translations follow their source text when cards move, and edited text stays intact", () => {
  const saved = Object.getOwnPropertyDescriptor(globalThis, "document");
  try {
    globalThis.document = {
      title: "经历 · 胡耀文", documentElement: { dataset: {} },
      body: { dataset: { page: "experience" } },
      querySelectorAll() { return []; }, querySelector() { return null; }
    };
    applyLanguage("en");
    assert.equal(text("experiences.0.company", "龙猫数据 · 大客户部"), "Longmao Data · Key Accounts");
    assert.equal(text("hero.summary", "新的个人介绍"), "新的个人介绍");
    applyLanguage("zh");
    assert.equal(text("experiences.0.company", "龙猫数据 · 大客户部"), "龙猫数据 · 大客户部");
  } finally {
    if (saved) Object.defineProperty(globalThis, "document", saved);
    else delete globalThis.document;
  }
});
