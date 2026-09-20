import fs from "fs";
import path from "path";

describe("Production build index.html asset loading (no speculative preload 404s)", () => {
  test("dist/index.html uses dynamic runtime loader instead of static relative asset tags", () => {
    const distHtmlPath = path.resolve(__dirname, "../../dist/index.html");
    expect(fs.existsSync(distHtmlPath)).toBe(true);

    const content = fs.readFileSync(distHtmlPath, "utf-8");

    // Static relative stylesheet and script tags must not be present to avoid speculative preload 404s
    expect(content).not.toMatch(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']\.\//i);
    expect(content).not.toMatch(/<script\s+[^>]*src=["']\.\/assets/i);

    // Dynamic loader script must be injected
    expect(content).toContain("document.createElement('base')");
    expect(content).toContain("cssFiles =");
    expect(content).toContain("jsFiles =");

    // No hardcoded /asd in the build artifact
    expect(content).not.toContain("/asd");
  });
});
