import type { Config } from "@react-router/dev/config";
import assert from "node:assert";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  async prerender() {
    const files = await readdir(resolve(import.meta.dirname, "data/exams"))
    assert(files.every((file) => file.startsWith("exam-") && file.endsWith(".json")));
    const range = Array.from({ length: files.length }, (_, i) => i + 1);
    return ["/", ...range.map((i) => `/exam/${i}`)];
  }
} satisfies Config;
