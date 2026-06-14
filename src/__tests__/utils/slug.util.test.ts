import { describe, it, expect } from "vitest";
import { generateSlug } from "../../utils/slug.util";

describe("generateSlug", () => {
  it("converts simple text to lowercase slug", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(generateSlug("a b c")).toBe("a-b-c");
  });

  it("removes special characters", () => {
    expect(generateSlug("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(generateSlug("a   b     c")).toBe("a-b-c");
  });

  it("removes leading and trailing hyphens", () => {
    expect(generateSlug("  --hello world--  ")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(generateSlug("")).toBe("");
  });

  it("handles strings with only special characters", () => {
    expect(generateSlug("@#$%^&*()")).toBe("");
  });
});
