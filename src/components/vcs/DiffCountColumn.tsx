import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { T } from "../text";

const COUNT_COL_MIN_W = 14;
const MONO_ADVANCE = 0.6;

export function diffCountColumnWidth(t: AdwaitaTheme, lines: number): number {
  const advance = t.type.caption * MONO_ADVANCE;
  return Math.max(
    COUNT_COL_MIN_W,
    Math.ceil((String(lines).length + 1) * advance) + 2,
  );
}

export function DiffCountColumn({
  lines,
  sign,
  width,
}: {
  lines: number;
  sign: "add" | "del";

  width?: number;
}) {
  const t = useAdwaita();
  const color =
    sign === "add"
      ? t.color.functional.success
      : t.color.functional.destructive;
  return (
    <div
      style={{
        width: width ?? diffCountColumnWidth(t, lines),
        flexShrink: 0,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <T
        size="caption"
        color={lines === 0 ? t.color.text.dim : color}
        style={{ whiteSpace: "nowrap", fontFamily: t.type.fontFamilyMono }}
      >
        {`${sign === "add" ? "+" : "-"}${lines}`}
      </T>
    </div>
  );
}
