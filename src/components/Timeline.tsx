import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { T } from "./text";

/**
 * A timeline: one event per row, its time in a mono column, a mark on a gutter
 * that joins one event to the next, and what happened.
 *
 * The gutter is drawn by the row above, not between rows, so the line survives a
 * row that wraps to a second line of text and stops exactly at the last event —
 * the reason the column of rows has no gap and each row pads its own foot.
 */

export type TimelineStatus = "done" | "current" | "upcoming";

export interface TimelineItem {
  /** When it happened, printed as written: `09:02`, `Tue`, `v1.4`. */
  at: string;
  title: ReactNode;
  note?: ReactNode;
  status?: TimelineStatus;
}

export interface TimelineProps {
  items: TimelineItem[];

  /** How wide the time column is. Defaults to the mono budget of `TIME_CHARS`. */
  timeWidth?: number;

  /** The mark column's width and the dot inside it, for a caller that must line
   *  a timeline up with the marks of another list. */
  markWidth?: number;

  style?: Partial<StyleDesc>;
}

/** The mono advance, as `DiffCountColumn` measures it too. */
const MONO_ADVANCE = 0.6;

/** A time column holds a clock: `09:02` is five characters. */
const TIME_CHARS = 5;

const MARK_COLUMN = 18;
const MARK_DOT = 10;
const MARK_LINE = 1;

/** The air a row leaves below itself, which the gutter runs through. */
const ROW_FOOT = 10;

/** How wide a row's time column has to be to hold a clock. */
export function timelineTimeWidth(t: AdwaitaTheme): number {
  return Math.ceil(TIME_CHARS * t.type.caption * MONO_ADVANCE) + 2;
}

/** How wide the mark column is, for a caller that lines a timeline up with another list. */
export const TIMELINE_MARK_WIDTH = MARK_COLUMN;

function markColor(t: AdwaitaTheme, status: TimelineStatus): string {
  if (status === "current") return t.color.accent.base;
  if (status === "upcoming") return t.color.divider.strong;
  return t.color.text.dim;
}

/**
 * The mark and the gutter below it. The line belongs to this row and stops at
 * the row's foot, so the next row's mark continues where this one's left off;
 * the last row of the list has no line at all.
 */
function TimelineMark({
  status,
  lineBelow,
  markWidth,
}: {
  status: TimelineStatus;
  lineBelow: boolean;
  markWidth: number;
}) {
  const t = useAdwaita();
  /* The point the reader stands at is the loudest mark on the gutter: a bigger
   * dot, wearing a ring of its own tint. What has not happened yet is only a
   * ring, and the past is a quiet filled dot. */
  const dot =
    status === "current"
      ? MARK_DOT + 4
      : status === "upcoming"
        ? MARK_DOT - 2
        : MARK_DOT;
  const ring = status === "current" ? 3 : status === "upcoming" ? MARK_LINE : 0;
  const dotTop = Math.max(
    0,
    Math.round((t.type.lineHeight.list - MARK_DOT) / 2),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: markWidth,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: dot,
          height: dot,
          marginTop: dotTop,
          flexShrink: 0,
          borderRadius: t.radius.full,
          borderWidth: ring,
          borderColor:
            status === "current" ? t.color.accent.tint : markColor(t, status),
          backgroundColor:
            status === "current"
              ? t.color.accent.base
              : status === "upcoming"
                ? "transparent"
                : markColor(t, status),
        }}
      />
      {lineBelow ? (
        <div
          style={{
            width: MARK_LINE,
            flexGrow: 1,
            minHeight: 0,
            backgroundColor: t.color.divider.default,
          }}
        />
      ) : null}
    </div>
  );
}

export function Timeline({
  items,
  timeWidth,
  markWidth = MARK_COLUMN,
  style,
}: TimelineProps) {
  const t = useAdwaita();
  const time = timeWidth ?? timelineTimeWidth(t);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
        ...style,
      }}
    >
      {items.map((item, index) => {
        const status = item.status ?? "done";
        const last = index === items.length - 1;
        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              width: "100%",
              minWidth: 0,
              gap: t.space.sm,
              paddingBottom: last ? 0 : ROW_FOOT,
            }}
          >
            <div
              style={{
                width: time,
                flexShrink: 0,
                display: "flex",
                paddingTop: Math.max(
                  0,
                  Math.round((t.type.lineHeight.list - t.type.caption) / 2),
                ),
              }}
            >
              <T
                size="caption"
                color={t.color.text.dim}
                align="right"
                style={{
                  fontFamily: t.type.fontFamilyMono,
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                {item.at}
              </T>
            </div>
            <TimelineMark
              status={status}
              lineBelow={!last}
              markWidth={markWidth}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                flexBasis: 0,
                minWidth: 0,
                gap: 2,
              }}
            >
              <T
                size="list"
                color={
                  status === "upcoming" ? t.color.text.secondary : t.color.text.primary
                }
                clamp={2}
                style={{ flexShrink: 1, minWidth: 0 }}
              >
                {item.title}
              </T>
              {item.note === undefined ? null : (
                <T
                  size="caption"
                  color={t.color.text.dim}
                  clamp={3}
                  style={{ flexShrink: 1, minWidth: 0 }}
                >
                  {item.note}
                </T>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
