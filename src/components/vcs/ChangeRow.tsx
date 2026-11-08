import { memo, type ReactNode } from "react";
import { useAdwaita } from "../../theme/adwaita";
import { ListRow, PillGroup, RowShell } from "../../lib/panel";
import { GraphGutter } from "../GraphGutter";
import { humanizeAgo } from "../../lib/projectMeta";
import { tsToMs } from "../../lib/activity";
import { T } from "../text";
import { Icon } from "../icons";
import { type GraphNode } from "../../lib/graph";
import { BookmarkPill } from "./BookmarkPill";

/** A change row is one graph lane tall. */
export const CHANGE_ROW_HEIGHT = 24;

/** An 8-character change id, set in mono. */
const CHANGE_ID_WIDTH = 72;

/** How old the change is, right aligned so the column reads as numbers. */
const AGE_WIDTH = 80;

export interface ChangeRowData {
  change_id: string;
  commit_id: string;
  description: string;
  timestamp: string;
  has_conflicts: boolean;
  /** An immutable change is drawn dimmed — it cannot be acted on. */
  immutable?: boolean;
  /** A change with no diff of its own is drawn dimmed. */
  empty?: boolean;
}

export interface ChangeRowProps {
  change: ChangeRowData;
  /** This change's node in the graph, and the row above it. */
  node: GraphNode;
  prev: GraphNode | null;
  laneCount: number;
  /** The bookmarks pointing at this change, in the order they were listed. */
  bookmarks?: readonly string[];
  selected?: boolean;
  /** The change the working copy is on — its dot is outlined. */
  current?: boolean;
  /** The window holds keyboard focus, so a selection is drawn as selection. */
  focused?: boolean;
  showChangeId?: boolean;
  showAge?: boolean;
  onSelect?: () => void;
  /** A control at the trailing edge — a checkbox, a menu button. */
  trailing?: ReactNode;
  /** A popover anchored to this row, e.g. a describe field. */
  overlay?: ReactNode;
}

/**
 * One row of a jj change log: the graph, the bookmarks that point here, the
 * description, and a conflict warning. The columns an app adds — a checkbox,
 * an age, a popover — come in as slots, so every app's change list is the same
 * row with its own actions.
 */
export const ChangeRow = memo(function ChangeRow({
  change,
  node,
  prev,
  laneCount,
  bookmarks = [],
  selected = false,
  current = false,
  focused = true,
  showChangeId = false,
  showAge = false,
  onSelect,
  trailing,
  overlay,
}: ChangeRowProps) {
  const t = useAdwaita();
  const { color } = t;
  const active = selected && focused;
  const descColor = active
    ? color.accent.base
    : change.empty || change.immutable
      ? color.text.dim
      : color.text.primary;
  return (
    <ListRow
      selected={selected}
      focused={focused}
      height={CHANGE_ROW_HEIGHT}
      style={overlay ? { position: "relative" } : undefined}
      onClick={onSelect}
    >
      <RowShell>
        <GraphGutter
          node={node}
          prev={prev}
          laneCount={laneCount}
          selected={selected}
          dotStroke={current ? color.accent.base : undefined}
          selectedStroke={color.text.primary}
        />
        {showChangeId ? (
          <div
            style={{
              width: CHANGE_ID_WIDTH,
              flexShrink: 0,
              fontFamily: t.type.fontFamilyMono,
              fontSize: t.type.micro,
              color: color.text.dim,
              whiteSpace: "nowrap",
            }}
          >
            {change.change_id.slice(0, 8)}
          </div>
        ) : null}
        {bookmarks.length > 0 ? (
          <PillGroup
            names={[...bookmarks]}
            dimmed={change.immutable === true}
            renderPill={(name, dimmed) => (
              <BookmarkPill name={name} dimmed={dimmed} />
            )}
          />
        ) : null}
        <T
          size="caption"
          weight={active ? 600 : 400}
          color={descColor}
          style={{
            flexGrow: 1,
            flexShrink: 100,
            minWidth: 0,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {change.description}
        </T>
        {change.has_conflicts ? (
          <Icon name="warning" size={12} color={color.functional.destructive} />
        ) : null}
        {showAge ? (
          <div
            style={{
              width: AGE_WIDTH,
              flexShrink: 0,
              textAlign: "right",
              fontSize: t.type.micro,
              fontFamily: t.type.fontFamily,
              color: color.text.dim,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {humanizeAgo(tsToMs(change.timestamp))}
          </div>
        ) : null}
        {trailing}
        {overlay}
      </RowShell>
    </ListRow>
  );
});
