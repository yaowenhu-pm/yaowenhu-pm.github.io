import test from "node:test";
import assert from "node:assert/strict";
import { initTheme } from "../js/components/theme.js";

test("blocked storage does not interrupt startup or theme switching", () => {
  const keys = ["document", "window", "localStorage"];
  const saved = Object.fromEntries(keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  let toggle;
  try {
    globalThis.document = {
      documentElement: { dataset: {} },
      querySelector() { return { addEventListener(name, handler) { toggle = handler; } }; }
    };
    globalThis.window = { matchMedia() { return { matches: false }; } };
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() { throw new Error("Storage access denied"); }
    });
    assert.doesNotThrow(initTheme);
    assert.equal(document.documentElement.dataset.theme, undefined);
    toggle();
    assert.equal(document.documentElement.dataset.theme, "dark");
    toggle();
    assert.equal(document.documentElement.dataset.theme, "light");
  } finally {
    for (const key of keys) {
      if (saved[key]) Object.defineProperty(globalThis, key, saved[key]);
      else delete globalThis[key];
    }
  }
});
