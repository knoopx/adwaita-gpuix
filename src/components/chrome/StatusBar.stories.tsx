import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { Labeled, T } from "../common";
import { Column } from "../Box";
import type { Shortcut } from "../../lib/shortcuts";
import { StatusBar } from "./StatusBar";

const HINTS: Shortcut[] = [
  { id: "open", kbds: [["ctrl", "o"]], desc: "open" },
  { id: "save", kbds: [["ctrl", "s"]], desc: "save" },
  { id: "quit", kbds: [["ctrl", "q"]], desc: "quit" },
];

function TrailingText({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  return (
    <T size="caption" color={t.colors.dim_fg}>
      {children}
    </T>
  );
}

export default defineMeta({
  title: "Adwaita/StatusBar",
  component: StatusBar,
  parameters: { width: 528, height: 96 },
});

export const basic = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="message only (dim caption, left)">
        <StatusBar message="12 items · 3 selected" />
      </Labeled>
    </Column>
  ),
});

export const withProgress = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="message + accent progress">
        <StatusBar message="Syncing library…" progress={0.64} />
      </Labeled>
    </Column>
  ),
});

export const withTrailing = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="message + trailing items">
        <StatusBar
          message="12 items"
          trailing={
            <TrailingText>3 selected · 4.2 MB</TrailingText>
          }
        />
      </Labeled>
    </Column>
  ),
});

export const full = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="message + progress + trailing + hints">
        <StatusBar
          message="Exporting… 64%"
          progress={0.64}
          trailing={<TrailingText>4.2 MB</TrailingText>}
          hints={HINTS}
        />
      </Labeled>
    </Column>
  ),
});

export const withHints = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="hints only (right-aligned kbd hints)">
        <StatusBar hints={HINTS} />
      </Labeled>
    </Column>
  ),
});

export const empty = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="empty (no content)">
        <StatusBar />
      </Labeled>
    </Column>
  ),
});
