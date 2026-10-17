import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row, Column } from "./Box";
import { Checkbox } from "./Checkbox";

type CheckboxSpec = {
  caption: string;
  checked?: boolean | "indeterminate";
  label?: string;
  labelPosition?: "start";
  disabled?: boolean;
};

function StateRow({
  gap = 16,
  items,
}: {
  gap?: number;
  items: CheckboxSpec[];
}) {
  return (
    <Row gap={gap} align="center">
      {items.map((spec) => (
        <Labeled key={spec.caption} caption={spec.caption}>
          <Checkbox
            checked={spec.checked}
            onCheckedChange={() => {}}
            label={spec.label}
            labelPosition={spec.labelPosition}
            disabled={spec.disabled}
          />
        </Labeled>
      ))}
    </Row>
  );
}

export default defineMeta({
  title: "Adwaita/Checkbox",
  component: Checkbox,
  parameters: { width: 528, height: 320 },
});

export const checkedStates = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <StateRow
      items={[
        { caption: "unchecked", checked: false },
        { caption: "checked", checked: true },
        { caption: "indeterminate", checked: "indeterminate" },
      ]}
    />
  ),
});

export const disabled = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <StateRow
      items={[
        { caption: "disabled (unchecked)", checked: false, disabled: true },
        { caption: "disabled (checked)", checked: true, disabled: true },
        {
          caption: "disabled (indeterminate)",
          checked: "indeterminate",
          disabled: true,
        },
      ]}
    />
  ),
});

export const withLabel = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <StateRow
      items={[
        { caption: "unchecked", checked: false, label: "Unchecked" },
        { caption: "checked", checked: true, label: "Checked" },
        {
          caption: "indeterminate",
          checked: "indeterminate",
          label: "Indeterminate",
        },
        { caption: "disabled", checked: true, disabled: true, label: "Disabled" },
      ]}
    />
  ),
});

export const labelPositions = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <StateRow
      gap={24}
      items={[
        {
          caption: "trailing label",
          checked: true,
          label: "Trailing label",
        },
        {
          caption: "leading label",
          checked: true,
          label: "Leading label",
          labelPosition: "start",
        },
        {
          caption: "leading + disabled",
          checked: "indeterminate",
          label: "Leading (disabled)",
          labelPosition: "start",
          disabled: true,
        },
      ]}
    />
  ),
});

export function form() {
  const t = useAdwaita();
  return (
    <Column
      gap={8}
      padding={12}
      style={{
        borderRadius: t.radii.card,
        borderWidth: 1,
        borderColor: t.colors.border,
      }}
    >
      <T size="caption" color={t.colors.dim_fg}>
        Notifications
      </T>
      <Checkbox checked onCheckedChange={() => {}} label="Email" />
      <Checkbox checked={false} onCheckedChange={() => {}} label="Push" />
      <Checkbox
        checked="indeterminate"
        onCheckedChange={() => {}}
        label="Digest"
      />
      <Checkbox
        checked
        disabled
        onCheckedChange={() => {}}
        label="Reminders"
      />
    </Column>
  );
}
form.parameters = { width: 528, height: 220 };
