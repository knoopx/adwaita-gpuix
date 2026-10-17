import { defineMeta, defineStory } from "storybook";
import type { ReactNode } from "react";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "./Select";
import { SELECT_LEVELS, SELECT_SIZES } from "./.storybook/story-helpers";

function LabeledSelect({
  caption,
  width = 200,
  items = SELECT_LEVELS,
  value,
  defaultValue,
  disabled,
  open,
  placeholder,
  triggerSize,
  triggerDisabled,
  content,
}: {
  caption: string;
  width?: number;
  items?: readonly { value: string; label?: ReactNode }[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  open?: boolean;
  placeholder?: string;
  triggerSize?: "sm" | "default";
  triggerDisabled?: boolean;
  content?: ReactNode;
}) {
  return (
    <Labeled caption={caption} style={{ width }}>
      <Select
        items={items}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        open={open}
        onValueChange={() => {}}
        onOpenChange={open ? () => {} : undefined}
      >
        <SelectTrigger size={triggerSize} disabled={triggerDisabled}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {content}
      </Select>
    </Labeled>
  );
}

function SideSelect({
  caption,
  side,
  value,
}: {
  caption: string;
  side: "top" | "right" | "bottom" | "left";
  value: string;
}) {
  return (
    <Labeled caption={caption} style={{ width: 160 }}>
      <Select
        items={SELECT_LEVELS}
        value={value}
        open
        onValueChange={() => {}}
        onOpenChange={() => {}}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent side={side}>
          {SELECT_LEVELS.map((l) => (
            <SelectItem key={l.value} value={l.value}>
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Labeled>
  );
}

export default defineMeta({
  title: "Adwaita/Select",
  component: Select,
  parameters: { width: 528, height: 360 },
});

export const selected = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <LabeledSelect caption="closed — medium selected" value="medium" />
    </Row>
  ),
});

export const triggerSizes = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <LabeledSelect caption="default 34px" defaultValue="medium" />
      <LabeledSelect caption="sm 28px" defaultValue="high" triggerSize="sm" />
    </Row>
  ),
});

export const placeholder = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <LabeledSelect
        caption="no selection — placeholder shown"
        placeholder="Select…"
      />
    </Row>
  ),
});

export const disabled = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <LabeledSelect
        caption="disabled trigger"
        defaultValue="medium"
        disabled
        triggerDisabled
      />
    </Row>
  ),
});

export const openDropdown = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <LabeledSelect
        caption="open — groups, separator, disabled item"
        value="medium"
        open
        content={
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Performance</SelectLabel>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium" disabled>
                Medium
              </SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Quality</SelectLabel>
              <SelectItem value="high">High</SelectItem>
            </SelectGroup>
          </SelectContent>
        }
      />
    </Column>
  ),
});

export const virtualList = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <LabeledSelect
        caption="long list — virtual content scrolls"
        items={SELECT_SIZES}
        value="m"
        open
        content={
          <SelectContent virtual>
            {SELECT_SIZES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        }
      />
    </Column>
  ),
});

export const contentSides = defineStory({
  render: () => (
    <Row gap={16} align="start">
      <SideSelect caption="side=top" side="top" value="low" />
      <SideSelect caption="side=right" side="right" value="medium" />
      <SideSelect caption="side=bottom" side="bottom" value="high" />
    </Row>
  ),
});
