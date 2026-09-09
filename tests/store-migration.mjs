import assert from "node:assert/strict";

const memory = new Map();
globalThis.localStorage = {
  getItem(key) {
    return memory.has(key) ? memory.get(key) : null;
  },
  setItem(key, value) {
    memory.set(key, String(value));
  },
  removeItem(key) {
    memory.delete(key);
  },
  clear() {
    memory.clear();
  },
};

const { createStore } = await import("../src/state/store.js");
const key = "rondo-prototype-v2";
const initial = { repeatMode: "continue" };

localStorage.setItem(key, JSON.stringify({ session: { repeatMode: "track" } }));
let store = createStore(initial);
assert.equal(store.get().repeatMode, "track", "Track repeat should survive reload.");

localStorage.setItem(key, JSON.stringify({ session: { repeatMode: "artist" } }));
store = createStore(initial);
assert.equal(store.get().repeatMode, "artist", "Artist repeat should survive reload.");

localStorage.setItem(key, JSON.stringify({ session: { repeatMode: "off" } }));
store = createStore(initial);
assert.equal(store.get().repeatMode, "continue", "Legacy off should migrate safely.");

localStorage.setItem(key, JSON.stringify({ session: { repeatMode: "invalid" } }));
store = createStore(initial);
assert.equal(store.get().repeatMode, "continue", "Unknown repeat modes should use the default.");

store.set({ repeatMode: "track" }, { persist: true });
assert.equal(
  JSON.parse(localStorage.getItem(key)).session.repeatMode,
  "track",
  "Track repeat should be persisted.",
);

console.log("Repeat-mode persistence and migration passed.");
