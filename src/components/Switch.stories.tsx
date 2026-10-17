import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row, Column } from "./Box";
import { Switch } from "./Switch";

export default defineMeta({
  title: "Adwaita/Switch",
  component: Switch,
  parameters: { width: 528, height: 320 },
});

export const states = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="off">
        <Switch checked={false} onChange={() => {}} />
      </Labeled>
      <Labeled caption="on">
        <Switch checked onChange={() => {}} />
      </Labeled>
      <Labeled caption="disabled (off)">
        <Switch checked={false} disabled onChange={() => {}} />
      </Labeled>
      <Labeled caption="disabled (on)">
        <Switch checked disabled onChange={() => {}} />
      </Labeled>
    </Row>
  ),
});

export const labeled = defineStory({
  parameters: { width: 528, height: 220 },
  render: () => (
    <Column gap={12} align="start">
      <Labeled caption="leading label (preference idiom)">
        <Switch
          checked
          label="Wi-Fi"
          labelPosition="start"
          onChange={() => {}}
        />
      </Labeled>
      <Labeled caption="leading label, off">
        <Switch
          checked={false}
          label="Bluetooth"
          labelPosition="start"
          onChange={() => {}}
        />
      </Labeled>
      <Labeled caption="leading label, disabled">
        <Switch
          checked
          disabled
          label="Dark mode"
          labelPosition="start"
          onChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const labelPositions = defineStory({
  parameters: { width: 528, height: 220 },
  render: () => (
    <Column gap={12} align="start">
      <Labeled caption="trailing label (default)">
        <Switch checked label="Trailing label" onChange={() => {}} />
      </Labeled>
      <Labeled caption="leading label">
        <Switch
          checked
          label="Leading label"
          labelPosition="start"
          onChange={() => {}}
        />
      </Labeled>
      <Labeled caption="leading + disabled">
        <Switch
          checked={false}
          disabled
          label="Leading (disabled)"
          labelPosition="start"
          onChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export function preferences() {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        borderRadius: t.radii.card,
        borderWidth: 1,
        borderColor: t.colors.border,
      }}
    >
      <T size="caption" color={t.colors.dim_fg}>
        Notifications
      </T>
      <Switch checked label="Email" labelPosition="start" onChange={() => {}} />
      <Switch
        checked={false}
        label="Push"
        labelPosition="start"
        onChange={() => {}}
      />
      <Switch
        checked={false}
        label="Digest"
        labelPosition="start"
        onChange={() => {}}
      />
      <Switch
        checked
        disabled
        label="Reminders"
        labelPosition="start"
        onChange={() => {}}
      />
    </div>
  );
}
preferences.parameters = { width: 528, height: 240 };
