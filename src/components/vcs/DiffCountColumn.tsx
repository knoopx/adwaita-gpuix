import { useAdwaita, type AdwaitaTheme } from "../../theme/adwaita";
import { T } from "../text";

const COUNT_COL_MIN_W = 14;
const MONO_ADVANCE = 0.6;

/**
 * Which figure the column carries.
 *
 * `add` and `del` count one side of a patch and wear that side's colour and sign.
 * `changed` is a diff stat's single figure — the lines that moved, whichever way they
 * moved — and a sign would name a side the source never stated, so it stands in the
 * row's own ink with no sign at all.
 */
export type DiffCountSign = "add" | "del" | "changed";

const signed = (sign: DiffCountSign): boolean => sign !== "changed";

export function diffCountColumnWidth(
  t: AdwaitaTheme,
  lines: number,
  sign: DiffCountSign = "add",
): number {
  const advance = t.type.caption * MONO_ADVANCE;
  const chars = String(lines).length + (signed(sign) ? 1 : 0);
  return Math.max(COUNT_COL_MIN_W, Math.ceil(chars * advance) + 2);
}

export function DiffCountColumn({
  lines,
  sign,
  width,
}: {
  lines: number;
  sign: DiffCountSign;

  width?: number;
}) {
  const t = useAdwaita();
  const side =
    sign === "add"
      ? t.color.functional.success
      : sign === "del"
        ? t.color.functional.destructive
        : t.color.text.secondary;
  // A side that did not move is a figure, and a quiet one: the colour belongs to lines
  // that were added or taken away, and there are none.
  const color = lines === 0 ? t.color.text.dim : side;
  return (
    <div
      style={{
        width: width ?? diffCountColumnWidth(t, lines, sign),
        flexShrink: 0,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <T
        size="caption"
        color={color}
        style={{ whiteSpace: "nowrap", fontFamily: t.type.fontFamilyMono }}
      >
        {sign === "changed"
          ? String(lines)
          : `${sign === "add" ? "+" : "-"}${lines}`}
      </T>
    </div>
  );
}
