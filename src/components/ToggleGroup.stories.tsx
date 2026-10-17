import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import { ToggleGroup, type ToggleOption } from "./ToggleGroup";

const OPTS: ToggleOption[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

const ICON_OPTS: ToggleOption[] = [
  { id: "list", icon: "list" },
  { id: "grid", icon: "grid" },
  { id: "panel", icon: "panel" },
];

const VERT_OPTS: ToggleOption[] = [
  { id: "list", icon: "list", label: "List" },
  { id: "grid", icon: "grid", label: "Grid" },
  { id: "panel", icon: "panel", label: "Panel" },
];

export default defineMeta({
  title: "Adwaita/ToggleGroup",
  component: ToggleGroup,
  parameters: { width: 528, height: 320 },
});

export const variants = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="default">
        <ToggleGroup options={OPTS} value="week" onChange={() => {}} />
      </Labeled>
      <Labeled caption="outline">
        <ToggleGroup
          options={OPTS}
          variant="outline"
          value="day"
          onChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const sizes = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="sm (24)">
        <ToggleGroup
          options={OPTS}
          size="sm"
          value="day"
          onChange={() => {}}
        />
      </Labeled>
      <Labeled caption="default (28)">
        <ToggleGroup options={OPTS} value="week" onChange={() => {}} />
      </Labeled>
      <Labeled caption="lg (36)">
        <ToggleGroup
          options={OPTS}
          size="lg"
          value="month"
          onChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const selection = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="icon options">
        <ToggleGroup
          options={ICON_OPTS}
          value="grid"
          onChange={() => {}}
        />
      </Labeled>
      <Labeled caption="multiple (multi-select)">
        <ToggleGroup
          multiple
          options={OPTS}
          value={["day", "month"]}
          onChange={() => {}}
        />
      </Labeled>
      <Labeled caption="none selected">
        <ToggleGroup options={OPTS} value="" onChange={() => {}} />
      </Labeled>
    </Column>
  ),
});

export const disabled = defineStory({
  render: () => {
    const opts: ToggleOption[] = [
      { id: "day", label: "Day" },
      { id: "week", label: "Week" },
      { id: "month", label: "Month", disabled: true },
    ];
    return (
      <Column gap={16} align="center">
        <Labeled caption="disabled option (dim, no click)">
          <ToggleGroup options={opts} value="week" onChange={() => {}} />
        </Labeled>
        <Labeled caption="disabled option, multiple">
          <ToggleGroup
            multiple
            options={opts}
            value={["day"]}
            onChange={() => {}}
          />
        </Labeled>
      </Column>
    );
  },
});

export const vertical = defineStory({
  render: () => (
    <Row gap={24} align="start">
      <Labeled caption="vertical, icon + label">
        <ToggleGroup
          direction="vertical"
          options={VERT_OPTS}
          value="grid"
          onChange={() => {}}
        />
      </Labeled>
      <Labeled caption="vertical, icons only">
        <ToggleGroup
          direction="vertical"
          options={ICON_OPTS}
          value="list"
          onChange={() => {}}
        />
      </Labeled>
    </Row>
  ),
});
