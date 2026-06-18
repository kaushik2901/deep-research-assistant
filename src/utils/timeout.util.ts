import { TimeoutError } from "../errors";

export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  label?: string
): Promise<T> {
  let timerId: ReturnType<typeof setTimeout> | undefined;
  const timer = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => {
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

  try {
    return await Promise.race([fn(), timer]);
  } finally {
    clearTimeout(timerId);
  }
}
