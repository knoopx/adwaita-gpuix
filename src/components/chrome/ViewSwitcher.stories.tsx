import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { ViewSwitcher, type ViewSwitcherItem } from "./ViewSwitcher";

const VIEWS: ViewSwitcherItem[] = [
  { id: "l", label: "List", icon: "list" },
  { id: "g", label: "Grid", icon: "grid" },
  { id: "p", label: "Panel", icon: "panel" },
];

const VIEWS_DISABLED: ViewSwitcherItem[] = [
  { id: "l", label: "List", icon: "list" },
  { id: "g", label: "Grid", icon: "grid" },
  { id: "p", label: "Panel", icon: "panel", disabled: true },
];

export default defineMeta({
  title: "Adwaita/ViewSwitcher",
  component: ViewSwitcher,
  parameters: { width: 528, height: 320 },
});

export const variants = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="labeled (default, value=grid)">
        <ViewSwitcher items={VIEWS} value="g" onChange={() => {}} />
      </Labeled>
      <Labeled caption="icon-only (showLabels=false)">
        <ViewSwitcher
          items={VIEWS}
          value="l"
          showLabels={false}
          onChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const disabled = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="disabled segment (dim, no click)">
        <ViewSwitcher items={VIEWS_DISABLED} value="g" onChange={() => {}} />
      </Labeled>
      <Labeled caption="icon-only, disabled segment">
        <ViewSwitcher
          items={VIEWS_DISABLED}
          value="l"
          showLabels={false}
          onChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});
