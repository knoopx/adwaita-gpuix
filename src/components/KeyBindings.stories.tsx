import { defineMeta } from "storybook";
import { useAdwaita, SPACE } from "../theme/adwaita";
import { Labeled, listPanelStyle } from "./common";
import { Row } from "./Box";
import { Kbd as KbdBox } from "./Kbd";
import {
  KbdKey,
  KbdBinding,
  KbdBindings,
  ShortcutRow,
  ShortcutList,
  groupHints,
} from "./KeyBindings";
import { ShortcutHints } from "./KeyHint";
import { type Shortcut } from "../lib/shortcuts";

export default defineMeta({
  title: "Adwaita/KeyBindings",
  component: KbdBindings,
  parameters: { width: 528, height: 480 },
});

const BASIC_SHORTCUTS: Shortcut[] = [
  { id: "open", kbds: [["ctrl", "o"]], desc: "Open file" },
  { id: "save", kbds: [["ctrl", "s"]], desc: "Save" },
  { id: "undo", kbds: [["ctrl", "z"]], desc: "Undo" },
  { id: "redo", kbds: [["ctrl", "shift", "z"]], desc: "Redo" },
  { id: "quit", kbds: [["ctrl", "q"]], desc: "Quit" },
];

const HINT_SHORTCUTS: Shortcut[] = [
  { id: "nav-up", kbds: ["up"], desc: "nav" },
  { id: "nav-down", kbds: ["down"], desc: "nav" },
  { id: "focus", kbds: ["tab"], desc: "focus" },
  { id: "new", kbds: ["n"], desc: "new" },
  { id: "move", kbds: ["enter"], desc: "move" },
  { id: "move-space", kbds: ["space"], desc: "move" },
  { id: "view-left", kbds: [["ctrl", "left"]], desc: "view" },
  { id: "view-right", kbds: [["ctrl", "right"]], desc: "view" },
];

const GROUPED_SHORTCUTS: Shortcut[] = [
  { id: "undo", kbds: [["ctrl", "z"]], desc: "Edit" },
  { id: "redo", kbds: [["ctrl", "shift", "z"]], desc: "Edit" },
  { id: "find", kbds: [["ctrl", "f"]], desc: "Search" },
  { id: "replace", kbds: [["ctrl", "h"]], desc: "Search" },
  { id: "zoom-in", kbds: [["ctrl", "="]], desc: "View" },
  { id: "zoom-out", kbds: [["ctrl", "shift", "-"]], desc: "View" },
];

export function singleKeys() {
  const t = useAdwaita();
  return (
    <Row gap={t.spacing.padding} align="center">
      <Labeled caption="enter">
        <KbdBox>Enter</KbdBox>
      </Labeled>
      <Labeled caption="arrow">
        <KbdKey code="up" />
      </Labeled>
      <Labeled caption="escape">
        <KbdKey code="escape" />
      </Labeled>
      <Labeled caption="delete">
        <KbdKey code="delete" />
      </Labeled>
      <Labeled caption="letter">
        <KbdKey code="k" />
      </Labeled>
    </Row>
  );
}

export function combos() {
  const t = useAdwaita();
  return (
    <Row gap={t.spacing.padding} align="center">
      <Labeled caption="ctrl+k">
        <KbdBinding binding={["ctrl", "k"]} />
      </Labeled>
      <Labeled caption="shift+escape">
        <KbdBinding binding={["shift", "escape"]} />
      </Labeled>
      <Labeled caption="single">
        <KbdBinding binding="enter" />
      </Labeled>
    </Row>
  );
}

export function multipleBindings() {
  const t = useAdwaita();
  return (
    <Row gap={t.spacing.padding} align="center">
      <Labeled caption="open / save / quit">
        <KbdBindings kbds={[["ctrl", "o"], ["ctrl", "s"], ["ctrl", "q"]]} />
      </Labeled>
      <Labeled caption="nav arrows">
        <KbdBindings kbds={["up", "down", "left", "right"]} />
      </Labeled>
    </Row>
  );
}

export function shortcutList() {
  const t = useAdwaita();
  return (
    <Labeled caption="shortcut list (label left, keys right)">
      <div style={listPanelStyle(t, { maxHeight: 320 })}>
        <ShortcutList shortcuts={BASIC_SHORTCUTS} />
      </div>
    </Labeled>
  );
}

export function groupedSections() {
  const t = useAdwaita();
  return (
    <Labeled caption="grouped sections (groupHints merges same-label rows)">
      <div style={listPanelStyle(t, { maxHeight: 320 })}>
        <ShortcutList shortcuts={GROUPED_SHORTCUTS} />
      </div>
    </Labeled>
  );
}

export function longLabels() {
  const t = useAdwaita();
  return (
    <Labeled caption="long label (ellipsis) + long combo">
      <div style={listPanelStyle(t, { maxHeight: 320 })}>
        <ShortcutRow
          label="Toggle full-screen presentation mode for the editor"
          kbds={[["ctrl", "shift", "pagedown"]]}
        />
        <div
          style={{
            height: 1,
            backgroundColor: t.colors.border,
            margin: SPACE.xs,
          }}
        />
        <ShortcutRow label="Rename the selected item" kbds={["f2"]} />
      </div>
    </Labeled>
  );
}

export function mergedBindings() {
  const t = useAdwaita();
  return (
    <Labeled caption="same modifiers merge into one slashed key set">
      <div
        style={{
          display: "flex",
          backgroundColor: t.colors.view_bg,
          padding: t.spacing.paddingTight,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: t.colors.border,
        }}
      >
        <ShortcutHints
          groups={groupHints([
            { id: "nav-up", kbds: ["up"], desc: "nav" },
            { id: "nav-down", kbds: ["down"], desc: "nav" },
            {
              id: "view",
              kbds: [["ctrl", "left"], ["ctrl", "right"]],
              desc: "view",
            },
            {
              id: "zoom",
              kbds: [["ctrl", "="], ["ctrl", "shift", "-"]],
              desc: "zoom",
            },
          ])}
        />
      </div>
    </Labeled>
  );
}

export function hintRow() {
  const t = useAdwaita();
  return (
    <Labeled caption="hint row (keys tight to their label, hints spaced apart)">
      <div
        style={{
          display: "flex",
          backgroundColor: t.colors.view_bg,
          padding: t.spacing.paddingTight,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: t.colors.border,
        }}
      >
        <ShortcutHints groups={groupHints(HINT_SHORTCUTS)} />
      </div>
    </Labeled>
  );
}
