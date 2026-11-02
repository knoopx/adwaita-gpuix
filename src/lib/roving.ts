export type FocusStep = 1 | -1;

export function stepIndex(
  index: number,
  step: FocusStep,
  length: number,
  whenUnindexed: "first" | "last" = "first",
): number {
  if (length === 0) return -1;
  if (index < 0) return whenUnindexed === "last" ? length - 1 : 0;
  return step === 1 ? Math.min(index + 1, length - 1) : Math.max(index - 1, 0);
}

export function arrowStep(key: string | undefined): FocusStep | 0 {
  if (key === "ArrowDown") return 1;
  if (key === "ArrowUp") return -1;
  return 0;
}

export function isActivateKey(
  key: string | undefined,
  opts: { space?: boolean } = {},
): boolean {
  return key === "Enter" || (opts.space === true && key === " ");
}
