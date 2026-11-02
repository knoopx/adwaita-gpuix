import { useAdwaita } from "../../theme/adwaita";

const SEGMENTS = 6;
const SEG_W = 3;
const SEG_H = 12;
const SEG_GAP = 1;

export function DiffHistogram({
  insertions,
  deletions,
}: {
  insertions: number;
  deletions: number;
}) {
  const t = useAdwaita();
  const total = insertions + deletions;
  const green = total === 0 ? 0 : Math.round((insertions / total) * SEGMENTS);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: SEG_GAP,
        width: SEGMENTS * SEG_W + (SEGMENTS - 1) * SEG_GAP,
        height: SEG_H,
        flexShrink: 0,
      }}
    >
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <div
          key={i}
          style={{
            width: SEG_W,
            height: SEG_H,
            backgroundColor:
              total === 0
                ? t.color.divider.strong
                : i < green
                  ? t.color.functional.success
                  : t.color.functional.destructive,
          }}
        />
      ))}
    </div>
  );
}
