import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T, Labeled } from "./common";
import { Row, Column } from "./Box";
import { Kbd, KbdCombo, KbdGroup } from "./Kbd";

export default defineMeta({
  title: "Adwaita/Kbd",
  component: Kbd,
  parameters: { width: 528, height: 320 },
});

export const singleKey = defineStory({
  render: () => (
    <Row gap={16} align="start">
      <Labeled caption="⌘">
        <Kbd>⌘</Kbd>
      </Labeled>
      <Labeled caption="K">
        <Kbd>K</Kbd>
      </Labeled>
      <Labeled caption="Enter">
        <Kbd>Enter</Kbd>
      </Labeled>
    </Row>
  ),
});

export const modifiers = defineStory({
  render: () => (
    <Labeled caption="modifier keys">
      <Row gap={8} align="center">
        <Kbd>⌘</Kbd>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>Alt</Kbd>
        <Kbd>Super</Kbd>
      </Row>
    </Labeled>
  ),
});

export const wideKeys = defineStory({
  render: () => (
    <Labeled caption="wide keys (long labels)">
      <Row gap={8} align="center">
        <Kbd>Space</Kbd>
        <Kbd>Escape</Kbd>
        <Kbd>Backspace</Kbd>
        <Kbd>F13</Kbd>
      </Row>
    </Labeled>
  ),
});

export const groups = defineStory({
  render: () => (
    <Column gap={16} align="start">
      <Labeled caption="two-key combo (KbdCombo, + separator)">
        <KbdCombo>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdCombo>
      </Labeled>
      <Labeled caption="three-key combo (KbdCombo, + separator)">
        <KbdCombo>
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>Enter</Kbd>
        </KbdCombo>
      </Labeled>
    </Column>
  ),
});

export function groupNoSeparator() {
  const t = useAdwaita();
  return (
    <Labeled caption="key group (KbdGroup, no separator)">
      <Column gap={8}>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <Row gap={8} align="center">
          <T size="caption" color={t.colors.dim_fg}>
            two independent bindings
          </T>
          <KbdGroup>
            <Kbd>1</Kbd>
            <Kbd>2</Kbd>
          </KbdGroup>
        </Row>
      </Column>
    </Labeled>
  );
}

export function inline() {
  const t = useAdwaita();
  return (
    <Column gap={12}>
      <Labeled caption="inline in a sentence">
        <Row gap={6} align="center">
          <T size="body" color={t.colors.fg}>
            Press
          </T>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <T size="body" color={t.colors.fg}>
            to open the command bar.
          </T>
        </Row>
      </Labeled>
      <Labeled caption="inline shortcut list">
        <Column gap={8}>
          <Row gap={8} align="center">
            <KbdCombo>
              <Kbd>Ctrl</Kbd>
              <Kbd>P</Kbd>
            </KbdCombo>
            <T size="body" color={t.colors.dim_fg}>
              Print
            </T>
          </Row>
          <Row gap={8} align="center">
            <Kbd>Esc</Kbd>
            <T size="body" color={t.colors.dim_fg}>
              Close
            </T>
          </Row>
        </Column>
      </Labeled>
    </Column>
  );
}
