import { useCallback, useMemo, useState } from "react";
import type { EventPayload } from "@gpuix/native";

/**
 * Windowing for the native virtual lists: `@gpuix/native` reports the visible
 * index range on scroll and the app only materialises rows inside that range
 * (plus overdraw above and below so scrolling never shows a gap).
 */
const VIEWPORT_PX = 1600;

export interface ListWindow {
  itemCount: number;

  windowStart: number;

  windowCount: number;

  overdraw: number;

  onVisibleRange(event: EventPayload): void;

  slice<T>(items: readonly T[]): readonly T[];

  at(offset: number): number;
}

/**
 * @param itemCount total rows in the list
 * @param rowHeight row height in px (rows are uniform)
 * @param overdraw extra px materialised above and below the visible range
 */
export function useListWindow(
  itemCount: number,
  rowHeight: number,
  overdraw = 240,
): ListWindow {
  const [range, setRange] = useState({ start: 0, end: 0 });

  const onVisibleRange = useCallback((event: EventPayload): void => {
    const start = Math.max(0, event.startIndex ?? 0);
    const end = Math.max(start, event.endIndex ?? 0);
    setRange((prev) =>
      prev.start === start && prev.end === end ? prev : { start, end },
    );
  }, []);

  const row = Math.max(1, rowHeight);
  const pad = Math.ceil(overdraw / row) + 2;
  const visibleRows = Math.ceil(VIEWPORT_PX / row);

  const anchor = Math.min(range.start, Math.max(0, itemCount - 1));
  const windowStart = Math.max(0, anchor - pad);
  const windowEnd = Math.min(
    itemCount,
    Math.max(range.end, anchor + visibleRows) + pad,
  );
  const windowCount = Math.max(0, windowEnd - windowStart);

  return useMemo(
    () => ({
      itemCount,
      windowStart,
      windowCount,
      overdraw,
      onVisibleRange,
      slice: <T>(items: readonly T[]): readonly T[] =>
        items.slice(windowStart, windowStart + windowCount),
      at: (offset: number) => windowStart + offset,
    }),
    [itemCount, windowStart, windowCount, overdraw, onVisibleRange],
  );
}
