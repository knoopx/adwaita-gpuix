import { useCallback } from "react";
import type { NativeRenderer } from "@gpuix/native/host";
import type { PublicInstance } from "@gpuix/react";

export function useListFollow(
  listRef: { current: PublicInstance | null },
  renderer: NativeRenderer,
  rowHeight: number,
): (index: number) => void {
  const ensureVisible = useCallback(
    (index: number) => {
      const id = listRef.current?.id;
      if (id === undefined) return;
      const anchor = renderer.getListScrollTop?.(id);
      if (!anchor) return;

      const [item, off, vh] = anchor;
      const viewH = vh ?? 0;
      const top = item * rowHeight + (off ?? 0);
      const rowTop = index * rowHeight;
      const rowBottom = (index + 1) * rowHeight;
      if (rowTop >= top && rowBottom <= top + viewH) return;

      const targetY = rowBottom > top + viewH ? rowBottom - viewH : rowTop;
      const targetItem = Math.max(0, Math.floor(targetY / rowHeight));
      const targetOff = Math.max(0, targetY - targetItem * rowHeight);
      renderer.scrollToItem?.(id, targetItem, targetOff);
    },
    [renderer, listRef, rowHeight],
  );

  return ensureVisible;
}
