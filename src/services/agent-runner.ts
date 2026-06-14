export interface AgentRunner {
  run<T = unknown>(agent: unknown, input: string): Promise<{ finalOutput: T | null }>;
}
