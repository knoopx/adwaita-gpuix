import { useMemo, type Ref } from "react";
import { T } from "./common";
import { useAdwaita } from "../theme/adwaita";
import type { PublicInstance, StyleDesc } from "@gpuix/react";
import { alignTables, type TabularSides } from "../lib/Tabular";

const MAX_ROWS = 500;

const ROW_H = 22;

const CHAR_W = 7.2;

const MAX_CELL = 40;

const MAX_COMPOSITE = 48;

function dispLen(s: string, cap: number): number {
  return Math.min(s.length, cap);
}

export function DataTable({
  sides,
  scrollRef,
}: {
  sides: TabularSides;

  scrollRef?: Ref<PublicInstance>;
}) {
  const t = useAdwaita();
  const { colors, spacing, typography } = t;
  const mono = typography.fontFamilyMono;
  const pad = spacing.gap;

  const aligned = useMemo(
    () => alignTables(sides.old, sides.next, sides.hasHeader),
    [sides],
  );
  const rows = aligned.rows;
  const shown = rows.length > MAX_ROWS ? rows.slice(0, MAX_ROWS) : rows;

  const colWidths = useMemo(() => {
    const widths = new Array<number>(aligned.cols).fill(0);
    for (let c = 0; c < aligned.cols; c++) {
      let m = dispLen(aligned.header[c] ?? "", MAX_CELL);
      for (const r of rows) {
        if (r.kind === "pair") {
          const cell = r.cells[c];
          if (!cell) continue;
          m = Math.max(
            m,
            cell.changed
              ? dispLen(`${cell.old} → ${cell.next}`, MAX_COMPOSITE)
              : dispLen(cell.next, MAX_CELL),
          );
        } else {
          m = Math.max(m, dispLen(r.cells[c] ?? "", MAX_CELL));
        }
      }
      widths[c] = pad * 2 + m * CHAR_W;
    }
    return widths;
  }, [aligned, rows, pad]);

  const gutterWidth = useMemo(() => {
    const maxNo = Math.max(rows.length, 1);
    return pad * 2 + (String(maxNo).length * 2 + 1) * CHAR_W;
  }, [rows.length, pad]);

  const counts = useMemo(() => {
    let added = 0;
    let removed = 0;
    let changed = 0;
    for (const r of rows) {
      if (r.kind === "added") added++;
      else if (r.kind === "removed") removed++;
      else for (const c of r.cells) if (c.changed) changed++;
    }
    return { added, removed, changed };
  }, [rows]);

  const tableWidth = gutterWidth + colWidths.reduce((a, b) => a + b, 0);

  
  
  const colStyle = (width: number): StyleDesc => ({
    width,
    flexGrow: 1,
    flexShrink: 0,
    paddingLeft: pad / 2,
    paddingRight: pad / 2,
  });

  const cellStyle = (): StyleDesc => ({
    width: "100%",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    fontFamily: mono,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: pad,
          height: 20,
          paddingLeft: pad,
          paddingRight: pad,
          borderBottomWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.headerbar_bg,
          flexShrink: 0,
        }}
      >
        <T
          size="caption"
          color={colors.dim_fg}
          style={{ whiteSpace: "nowrap" }}
        >
          {`rows ${rows.length}`}
        </T>
        <T
          size="caption"
          color={colors.success}
          style={{ whiteSpace: "nowrap" }}
        >
          {`+${counts.added}`}
        </T>
        <T
          size="caption"
          color={colors.destructive}
          style={{ whiteSpace: "nowrap" }}
        >
          {`−${counts.removed}`}
        </T>
        <T
          size="caption"
          color={colors.warning}
          style={{ whiteSpace: "nowrap" }}
        >
          {`~${counts.changed} cells`}
        </T>
        <T
          size="caption"
          color={colors.dim_fg}
          style={{
            whiteSpace: "nowrap",
            flexGrow: 1,
            textAlign: "right" as const,
          }}
        >
          {sides.delim === "\t" ? "tsv" : `delim "${sides.delim}"`}
        </T>
      </div>

      <div
        ref={scrollRef}
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: "scroll",
          padding: pad,
          backgroundColor: colors.view_bg,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            minWidth: tableWidth,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              height: ROW_H,
              backgroundColor: colors.headerbar_bg,
              borderBottomWidth: 1,
              borderColor: colors.border,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: gutterWidth,
                flexShrink: 0,
                paddingLeft: pad / 2,
                paddingRight: pad / 2,
              }}
            >
              <T
                size="caption"
                weight={700}
                color={colors.dim_fg}
                style={{ fontFamily: mono, whiteSpace: "nowrap" }}
              >
                {"#"}
              </T>
            </div>
            {aligned.header.map((label, c) => (
              <div key={c} style={colStyle(colWidths[c] as number)}>
                <T
                  size="caption"
                  weight={700}
                  color={colors.dim_fg}
                  style={cellStyle()}
                >
                  {label}
                </T>
              </div>
            ))}
          </div>

          {shown.map((r, ri) => {
            const bg =
              r.kind === "added"
                ? colors.successTint
                : r.kind === "removed"
                  ? colors.destructiveTint
                  : "transparent";
            const gutterText =
              r.kind === "pair"
                ? `${r.oldNo}:${r.nextNo}`
                : r.kind === "added"
                  ? `·:${r.nextNo}`
                  : `${r.oldNo}:·`;
            const gutterColor =
              r.kind === "added"
                ? colors.success
                : r.kind === "removed"
                  ? colors.destructive
                  : colors.dim_fg;
            return (
              <div
                key={ri}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  height: ROW_H,
                  backgroundColor: bg,
                  borderBottomWidth: 1,
                  borderColor: colors.border,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: gutterWidth,
                    flexShrink: 0,
                    paddingLeft: pad / 2,
                    paddingRight: pad / 2,
                  }}
                >
                  <T
                    size="caption"
                    color={gutterColor}
                    style={{ fontFamily: mono, whiteSpace: "nowrap" }}
                  >
                    {gutterText}
                  </T>
                </div>
                {r.kind === "pair"
                  ? r.cells.map((cell, c) =>
                      cell ? (
                        <div
                          key={c}
                          style={{
                            ...colStyle(colWidths[c] as number),
                            backgroundColor: cell.changed
                              ? colors.warningTint
                              : "transparent",
                          }}
                        >
                          <T
                            size="caption"
                            color={cell.changed ? colors.warning : colors.fg}
                            weight={cell.changed ? 600 : 400}
                            style={cellStyle()}
                          >
                            {cell.changed
                              ? `${cell.old} → ${cell.next}`
                              : cell.next}
                          </T>
                        </div>
                      ) : null,
                    )
                  : r.cells.map((v, c) => (
                      <div style={colStyle(colWidths[c] as number)} key={c}>
                        <T
                          size="caption"
                          color={
                            r.kind === "added"
                              ? colors.success
                              : colors.destructive
                          }
                          style={cellStyle()}
                        >
                          {v}
                        </T>
                      </div>
                    ))}
              </div>
            );
          })}

          {rows.length > MAX_ROWS && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: ROW_H,
                flexShrink: 0,
                backgroundColor: colors.view_bg,
              }}
            >
              <T
                size="caption"
                color={colors.dim_fg}
                style={{ whiteSpace: "nowrap" }}
              >
                {`… ${rows.length - MAX_ROWS} more rows not shown`}
              </T>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


