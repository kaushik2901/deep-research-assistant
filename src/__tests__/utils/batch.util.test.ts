import { describe, it, expect, vi } from "vitest";
import { runBatched } from "../../utils/batch.util";

describe("runBatched", () => {
  it("processes all items with no batching when batchSize >= items", async () => {
    const fn = vi.fn().mockResolvedValue("done");
    const result = await runBatched([1, 2, 3], 5, fn);
    expect(result).toEqual(["done", "done", "done"]);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("processes in batches of the given size", async () => {
    const fn = vi.fn().mockResolvedValue("done");
    const result = await runBatched([1, 2, 3, 4, 5], 2, fn);
    expect(result).toEqual(["done", "done", "done", "done", "done"]);
    expect(fn).toHaveBeenCalledTimes(5);
  });

  it("handles empty items", async () => {
    const fn = vi.fn();
    const result = await runBatched([], 3, fn);
    expect(result).toEqual([]);
    expect(fn).not.toHaveBeenCalled();
  });

  it("preserves order", async () => {
    const fn = vi.fn().mockImplementation(async (n: number) => n * 2);
    const result = await runBatched([1, 2, 3, 4], 2, fn);
    expect(result).toEqual([2, 4, 6, 8]);
  });
});
