import { isRetryable } from "../errors";

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  signal?: AbortSignal;
}

export async function withRetry<T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 30000, signal } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn(signal);
    } catch (error) {
      if (attempt === maxRetries || !isRetryable(error)) {
        throw error;
      }

      const exponential = baseDelay * Math.pow(2, attempt - 1);
      const capped = Math.min(exponential, maxDelay);
      const jitter = capped * (0.75 + Math.random() * 0.5);
      await new Promise((resolve) => setTimeout(resolve, jitter));
    }
  }

  throw new Error("Unreachable: withRetry exhausted all attempts");
}
