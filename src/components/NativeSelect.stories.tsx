import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row } from "./Box";
import { NativeSelect } from "./NativeSelect";
import type { NativeSelectGroup, NativeSelectOption } from "./NativeSelect";
import { SELECT_LEVELS, SELECT_SIZES } from "./.storybook/story-helpers";

const LEVELS: NativeSelectOption[] = SELECT_LEVELS;
const SIZES: NativeSelectOption[] = SELECT_SIZES.slice(0, 12);

export default defineMeta({
  title: "Adwaita/NativeSelect",
  component: NativeSelect,
  parameters: { width: 528, height: 320 },
});

export const selected = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="medium selected" style={{ width: 200 }}>
        <NativeSelect value="medium" options={LEVELS} onChange={() => {}} />
      </Labeled>
    </Row>
  ),
});

export const unselected = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="nothing selected (placeholder)" style={{ width: 200 }}>
        <NativeSelect value="" options={LEVELS} onChange={() => {}} />
      </Labeled>
    </Row>
  ),
});

export const openDropdown = defineStory({
  render: () => (
    <Row gap={16} align="start">
      <Labeled caption="open — medium selected" style={{ width: 200 }}>
        <NativeSelect
          value="medium"
          options={LEVELS}
          open
          onOpenChange={() => {}}
          onChange={() => {}}
        />
      </Labeled>
    </Row>
  ),
});

export const grouped = defineStory({
  render: () => {
    const groups: NativeSelectGroup[] = [
      { label: "Performance", options: LEVELS.slice(0, 2) },
      { label: "Quality", options: LEVELS.slice(2) },
    ];
    return (
      <Row gap={16} align="start">
        <Labeled caption="grouped, open, high selected" style={{ width: 200 }}>
          <NativeSelect
            value="high"
            options={LEVELS}
            groups={groups}
            open
            onOpenChange={() => {}}
            onChange={() => {}}
          />
        </Labeled>
      </Row>
    );
  },
});

export const longList = defineStory({
  render: () => (
    <Row gap={16} align="start">
      <Labeled
        caption="long list — virtual list scrolls"
        style={{ width: 200 }}
      >
        <NativeSelect
          value="l"
          options={SIZES}
          open
          onOpenChange={() => {}}
          onChange={() => {}}
        />
      </Labeled>
    </Row>
  ),
});

export const disabled = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="disabled trigger" style={{ width: 200 }}>
        <NativeSelect
          value="medium"
          options={LEVELS}
          disabled
          onChange={() => {}}
        />
      </Labeled>
    </Row>
  ),
});
