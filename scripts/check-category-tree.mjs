import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/utils/category-utils.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022}}).outputText;
const {buildCategoryTree, matchesCategory} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const post = (slug, category) => ({slug, data: {title: slug, category}});
const tree = buildCategoryTree([
  post("overview", "图形学"),
  post("material", "图形学/games101"),
  post("shadow", "图形学/games202"),
  post("pcss", "图形学/games202/软阴影"),
  post("trip", "生活/旅行"),
  post("uncategorized", null),
], "未分类");
const graphics = tree.find(node => node.path === "图形学");
assert.equal(graphics.count, 4);
assert.deepEqual(graphics.posts.map(entry => entry.slug), ["overview"]);
const advanced = graphics.children.find(node => node.path === "图形学/games202");
assert.equal(advanced.count, 2);
assert.equal(advanced.children[0].posts[0].slug, "pcss");
assert.equal(tree.find(node => node.path === "").posts[0].slug, "uncategorized");
assert(matchesCategory("图形学/games202/软阴影", "图形学"));
assert(matchesCategory("图形学/games202/软阴影", "图形学/games202"));
assert(!matchesCategory("图形学/games202-extra", "图形学/games202"));
assert(!matchesCategory(null, "图形学"));
assert.deepEqual(buildCategoryTree([], "Uncategorized"), []);
console.log("Category hierarchy: parent totals, direct posts, nested posts, uncategorized and prefix boundaries passed.");
