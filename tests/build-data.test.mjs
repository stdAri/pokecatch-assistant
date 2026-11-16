import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(new URL("../dist/pokecatch-assistant.user.js", import.meta.url), "utf8");
const marker = "const DATA = ";
const start = source.indexOf(marker) + marker.length;
const end = source.indexOf(";\n  const SAVE_KEY", start);
const data = JSON.parse(source.slice(start, end));

test("generated data matches the inspected game build", () => {
  assert.equal(data.appBuild, "c0081498f2");
  assert.equal(data.langBuild, "01332b3d04");
  assert.equal(Object.keys(data.species).length, 649);
  assert.equal(data.species[4].n, "小火龙");
  assert.deepEqual(data.species[4].t, ["fire"]);
});

test("Johto finale contains Red's actual six Pokemon", () => {
  const silver = data.chapters.find((chapter) => chapter.name === "白银山");
  assert.ok(silver, "missing translated Mt. Silver chapter");
  assert.deepEqual(silver.boss.team.map(([id]) => id), [25, 196, 143, 3, 6, 9]);
  assert.equal(silver.boss.name, "赤红");
  assert.equal(silver.boss.badge, "Légende");
});

test("route and encounter data can locate Charmander on Route 3", () => {
  const route3 = data.chapters.flatMap((chapter) => chapter.routes.map((route) => ({ chapter, route })))
    .find(({ route }) => route.name === "3号道路");
  assert.ok(route3, "missing Route 3");
  assert.ok(route3.route.areas.includes("kanto-route-3-area"));
});

test("userscript never writes the game save key", () => {
  assert.equal(source.includes("localStorage.setItem(SAVE_KEY"), false);
  assert.equal(source.includes("localStorage.removeItem(SAVE_KEY"), false);
});
