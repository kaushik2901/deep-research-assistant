import { TimeoutError } from "../errors";

export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  label?: string
): Promise<T> {
  const timer = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(
        new TimeoutError(
          label
            ? `${label} timed out after ${timeoutMs}ms`
            : `Operation timed out after ${timeoutMs}ms`,
          timeoutMs
        )
      );
    }, timeoutMs);
  });

  return await Promise.race([fn(), timer]);
}
