import { defineMeta, defineStory } from "storybook";
import { useAdwaita, SPACE } from "../theme/adwaita";
import { T, Labeled } from "./common";
import { Row, Column } from "./Box";
import { ShortcutHint } from "./KeyHint";
import { type HintGroup } from "./KeyBindings";

export default defineMeta({
  title: "Adwaita/KeyHint",
  component: ShortcutHint,
  parameters: { width: 528, height: 360 },
});

export const singleBinding = defineStory({
  render: () => (
    <Row gap={SPACE.lg} align="center">
      <Labeled caption="single combo">
        <ShortcutHint group={{ desc: "open", kbds: [["ctrl", "o"]] }} />
      </Labeled>
      <Labeled caption="cmd combo">
        <ShortcutHint group={{ desc: "search", kbds: [["cmd", "k"]] }} />
      </Labeled>
      <Labeled caption="single key">
        <ShortcutHint group={{ desc: "nav", kbds: ["up"] }} />
      </Labeled>
    </Row>
  ),
});

export const multipleBindings = defineStory({
  render: () => (
    <Column gap={SPACE.lg} align="start">
      <Labeled caption="two bindings">
        <ShortcutHint
          group={{ desc: "edit", kbds: [["ctrl", "z"], ["ctrl", "y"]] }}
        />
      </Labeled>
      <Labeled caption="three keys">
        <ShortcutHint group={{ desc: "run", kbds: [["shift", "enter"]] }} />
      </Labeled>
    </Column>
  ),
});

export const hintStrip = defineStory({
  render: () => (
    <Labeled caption="several hints in a strip">
      <Row gap={SPACE.md} align="center">
        <ShortcutHint group={{ desc: "open", kbds: [["ctrl", "o"]] }} />
        <ShortcutHint group={{ desc: "save", kbds: [["ctrl", "s"]] }} />
        <ShortcutHint group={{ desc: "quit", kbds: [["ctrl", "q"]] }} />
      </Row>
    </Labeled>
  ),
});

export function inlineRow() {
  const t = useAdwaita();
  const row = (label: string, hint: HintGroup) => (
    <Row
      align="center"
      gap={SPACE.sm}
      style={{ minHeight: t.spacing.rowHeight }}
    >
      <T size="body" color={t.colors.fg} style={{ flexGrow: 1 }}>
        {label}
      </T>
      <ShortcutHint group={hint} />
    </Row>
  );
  return (
    <Labeled caption="hint next to a row label (label left, hint right)">
      <Column gap={SPACE.xs}>
        {row("File", { desc: "open", kbds: [["ctrl", "o"]] })}
        {row("View", { desc: "search", kbds: [["cmd", "k"]] })}
        {row("Edit", { desc: "undo", kbds: [["ctrl", "z"]] })}
      </Column>
    </Labeled>
  );
}

export const longCombo = defineStory({
  render: () => (
    <Labeled caption="long combo + multiple bindings in one group">
      <Column gap={SPACE.sm} align="start">
        <ShortcutHint
          group={{ desc: "zoom out", kbds: [["ctrl", "shift", "-"]] }}
        />
        <ShortcutHint
          group={{ desc: "page down", kbds: [["ctrl", "shift", "pagedown"]] }}
        />
        <ShortcutHint
          group={{ desc: "edit", kbds: [["ctrl", "z"], ["ctrl", "y"]] }}
        />
      </Column>
    </Labeled>
  ),
});
