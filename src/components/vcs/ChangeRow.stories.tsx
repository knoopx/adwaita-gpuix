import { defineMeta, defineStory } from "storybook";
import { AdwaitaProvider, useAdwaita } from "../../theme/adwaita";
import { Labeled, TextPart } from "../text";
import { Column } from "../Box";
import { Checkbox } from "../Checkbox";
import {
  generateGraphData,
  graphLaneCount,
  type GraphNode,
} from "../../lib/graph";
import { ChangeRow, type ChangeRowData } from "./ChangeRow";

/** A change as an app lists it: the row's data plus the parents that draw it. */
interface MockChange extends ChangeRowData {
  parents: string[];
  bookmarks: string[];
}

/** `minutes` before now, spelled the way jj prints a change timestamp. */
function stamp(minutes: number): string {
  const d = new Date(Date.now() - minutes * 60_000);
  const two = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())} ${two(
    d.getHours(),
  )}:${two(d.getMinutes())}`;
}

/**
 * A working jj history newest-first: the working copy with no description, a
 * merge carrying two bookmarks, an empty change, an immutable one, a
 * conflicted one, and the initial import at the bottom. The ages are relative
 * to now, so `showAge` renders "just now", "3h ago" and "2d ago".
 */
const CHANGES: MockChange[] = [
  {
    change_id: "0e4c1f9a2b3c",
    commit_id: "7d3a9c42",
    description: "(no description)",
    timestamp: stamp(0),
    has_conflicts: false,
    parents: ["a71e0b55"],
    bookmarks: [],
  },
  {
    change_id: "b5d2e07f91a4",
    commit_id: "a71e0b55",
    description: "Add the candidate picker to the overlay set",
    timestamp: stamp(18),
    has_conflicts: false,
    parents: ["4c9d8e63", "e58b2a10"],
    bookmarks: ["main", "trunk"],
  },
  {
    change_id: "3fa88c1de605",
    commit_id: "4c9d8e63",
    description: "Fix the candidate list height so a dialog never jumps",
    timestamp: stamp(180),
    has_conflicts: false,
    parents: ["92b47a0d"],
    bookmarks: [],
  },
  {
    change_id: "c60e5d1a77b2",
    commit_id: "92b47a0d",
    description: "Checkpoint before the rewrite",
    timestamp: stamp(300),
    has_conflicts: false,
    empty: true,
    parents: ["5a2f6b81"],
    bookmarks: [],
  },
  {
    change_id: "de17b93048fa",
    commit_id: "5a2f6b81",
    description: "Rewrite the graph gutter lane packing",
    timestamp: stamp(1560),
    has_conflicts: false,
    immutable: true,
    parents: ["1b8e3c60"],
    bookmarks: ["release/1.0"],
  },
  {
    change_id: "8c2d41e7ab39",
    commit_id: "1b8e3c60",
    description: "Resolve the conflict in the storybook gate",
    timestamp: stamp(2880),
    has_conflicts: true,
    parents: ["e58b2a10"],
    bookmarks: [],
  },
  {
    change_id: "a40f6c73dd18",
    commit_id: "e58b2a10",
    description: "Sketch the change row trailing slot",
    timestamp: stamp(5760),
    has_conflicts: false,
    parents: ["c0ffee12"],
    bookmarks: ["bookmark-picker"],
  },
  {
    change_id: "11ab77de9002",
    commit_id: "c0ffee12",
    description: "Initial import of the component library",
    timestamp: stamp(12960),
    has_conflicts: false,
    parents: [],
    bookmarks: [],
  },
];

const NODES: GraphNode[] = generateGraphData(
  CHANGES.map((c) => ({ id: c.commit_id, parents: c.parents })),
);
const LANES = graphLaneCount(NODES);

/** The change log as an app holds it: one row per change, in log order. */
function ChangeList({
  rows,
  selected,
  current,
  focused = true,
  showChangeId = false,
  showAge = false,
  checked,
}: {
  rows: MockChange[];
  selected?: number;
  current?: number;
  focused?: boolean;
  showChangeId?: boolean;
  showAge?: boolean;
  checked?: ReadonlySet<string>;
}) {
  const t = useAdwaita();
  const first = CHANGES.indexOf(rows[0]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: t.color.surface.view,
        overflow: "hidden",
      }}
    >
      {rows.map((c, i) => (
        <ChangeRow
          key={c.commit_id}
          change={c}
          node={NODES[first + i]}
          prev={first + i === 0 ? null : NODES[first + i - 1]}
          laneCount={LANES}
          bookmarks={c.bookmarks}
          selected={i === selected}
          current={i === current}
          focused={focused}
          showChangeId={showChangeId}
          showAge={showAge}
          trailing={
            checked ? (
              <div style={{ width: 18, flexShrink: 0 }}>
                <Checkbox
                  checked={checked.has(c.change_id)}
                  onCheckedChange={() => {}}
                />
              </div>
            ) : undefined
          }
        />
      ))}
    </div>
  );
}

export default defineMeta({
  title: "Adwaita/ChangeRow",
  component: ChangeRow,
  parameters: { width: 640, height: 320 },
});

export const changeLog = defineStory({
  parameters: { height: 340 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption="the shared row, one graph lane tall — bookmarks, description, conflict warning"
        style={{ width: "100%" }}
      >
        <ChangeList rows={CHANGES} selected={2} />
        <TextPart size="caption" dim>
          the top row is the working copy "(no description)"; the empty change
          and the immutable change are dimmed; the conflicted row answers with a
          warning glyph
        </TextPart>
      </Labeled>
    </Column>
  ),
});

export const projectColumns = defineStory({
  parameters: { width: 720, height: 340 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption="the columns an app adds — an 8-char change id in mono and a right-aligned age"
        style={{ width: "100%" }}
      >
        <ChangeList rows={CHANGES} showChangeId showAge />
        <TextPart size="caption" dim>
          the age column reads "just now", "18m ago", "3h ago", "5h ago", "1d
          ago", "2d ago", "4d ago", "1w ago"
        </TextPart>
      </Labeled>
    </Column>
  ),
});

export const selectionAndCurrent = defineStory({
  /** Five 4-row panes with a caption and a note; the fit never grows the
      canvas past what a story declares, so the height is set to fit. */
  parameters: { height: 704 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption="@ is current — its dot's stroke becomes the accent"
        style={{ width: "100%" }}
      >
        <ChangeList rows={CHANGES.slice(0, 4)} current={0} />
        <TextPart size="caption" dim>
          with the default blue accent, lane 0&apos;s branch colour IS the
          accent, so the stroke is the same blue as the fill: the @ dot measures
          the same 8px of blue as the dots below it and is indistinguishable
        </TextPart>
      </Labeled>
      <Labeled
        caption="focused pane — a selected row tints with the accent and gets a text-primary ring on its dot"
        style={{ width: "100%" }}
      >
        <ChangeList rows={CHANGES.slice(0, 4)} selected={2} current={0} />
      </Labeled>
      <Labeled
        caption="selected and current on one row — the selection stroke draws over the accent outline"
        style={{ width: "100%" }}
      >
        <ChangeList rows={CHANGES.slice(0, 4)} selected={0} current={0} />
      </Labeled>
      <Labeled
        caption="unfocused pane (focused=false) — a muted grey tint, no accent anywhere"
        style={{ width: "100%" }}
      >
        <ChangeList
          rows={CHANGES.slice(0, 4)}
          selected={2}
          current={0}
          focused={false}
        />
      </Labeled>
      <AdwaitaProvider accent="orange">
        <Labeled
          caption="a non-blue accent — the @ outline now reads against the blue lane"
          style={{ width: "100%" }}
        >
          <ChangeList rows={CHANGES.slice(0, 4)} current={0} />
        </Labeled>
      </AdwaitaProvider>
    </Column>
  ),
});

export const trailingSlot = defineStory({
  parameters: { width: 760, height: 260 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption="trailing slot — the app's hunk-selection checkbox at the row's edge"
        style={{ width: "100%" }}
      >
        <ChangeList
          rows={CHANGES.slice(0, 5)}
          selected={1}
          showChangeId
          showAge
          checked={new Set(["b5d2e07f91a4", "3fa88c1de605"])}
        />
        <TextPart size="caption" dim>
          the age column keeps its width, so the boxes line up in one column
        </TextPart>
      </Labeled>
    </Column>
  ),
});
