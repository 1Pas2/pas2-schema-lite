import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as api from "../dist/index.js";
test("nested validation and strip unknown", () => {
  const s = api.object({ name: api.string, ages: api.array(api.number) });
  const r = s({ name: "a", ages: [1], extra: 2 });
  assert.equal(r.name, "a");
  assert.equal("extra" in r, false);
});
test("path errors", () =>
  assert.throws(() => api.object({ n: api.number })({ n: "2" }), /\$\.n/));
test("optional and inherited properties", () => {
  assert.equal(api.optional(api.string)(undefined), undefined);
  assert.throws(() =>
    api.object({ name: api.string })(Object.create({ name: "x" })),
  );
});
