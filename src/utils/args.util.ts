export interface ParsedArgs {
  help: boolean;
  version: boolean;
  setup: boolean;
}

const VERSION = "1.0.0";

export function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  return {
    help: args.includes("--help") || args.includes("-h"),
    version: args.includes("--version") || args.includes("-v"),
    setup: args.includes("--setup"),
  };
}

export function printHelp(): void {
  console.log(`
Deep Research Assistant v${VERSION}

Usage:
  deep-research [options]

Options:
  --help, -h      Show this help message
  --version, -v   Show version number
  --setup         Run interactive configuration wizard
`);
}

export function printVersion(): void {
  console.log(`deep-research v${VERSION}`);
}
