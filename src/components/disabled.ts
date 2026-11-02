import { type CursorValue, type StyleDesc } from "@gpuix/react";

export const DISABLED_OPACITY = 0.5;

export interface DisabledStyleOptions {
  cursor?: CursorValue;
  disabledCursor?: CursorValue;

  hover?: Partial<StyleDesc>;

  active?: Partial<StyleDesc>;
}

export function disabledStyle(
  disabled: boolean | undefined,
  opts: DisabledStyleOptions = {},
): Partial<StyleDesc> {
  const {
    cursor = "pointer",
    disabledCursor = "default",
    hover,
    active,
  } = opts;
  const style: Partial<StyleDesc> = {
    opacity: disabled ? DISABLED_OPACITY : 1,
    cursor: disabled ? disabledCursor : cursor,
  };
  if (disabled) return style;
  if (hover) style.hover = hover;
  if (active) style.active = active;
  return style;
}
