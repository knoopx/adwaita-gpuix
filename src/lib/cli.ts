import { execFile } from "node:child_process";
import { promisify } from "node:util";

const pExecFile = promisify(execFile);

export interface CliResult {
  stdout: string;
  stderr: string;
  code: number;
}

export type CliMock = (
  binary: string,
  args: string[],
  cwd?: string,
) => CliResult | null | undefined;

const MAX_BUFFER = 16 * 1024 * 1024;

export async function runCli(
  binary: string,
  args: string[],
  cwd?: string,
  mock?: CliMock,
): Promise<CliResult> {
  const mocked = mock?.(binary, args, cwd);
  if (mocked) return mocked;
  try {
    const { stdout, stderr } = await pExecFile(binary, args, {
      cwd,
      maxBuffer: MAX_BUFFER,
    });
    return { stdout, stderr, code: 0 };
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string; code?: number };
    return {
      stdout: err.stdout ?? "",
      stderr: err.stderr ?? String(e),
      code: err.code ?? 1,
    };
  }
}

export function sanitizeDescription(raw: string): string {
  const ascii = raw.replace(/[^\p{ASCII}]/gu, "");
  const normalized = ascii.split(/\s+/).filter(Boolean).join(" ");
  return normalized.length > 0 ? normalized : "(no description)";
}
