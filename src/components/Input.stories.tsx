import { defineMeta, defineStory } from "storybook";
import { Input } from "./Input";
import {
  fieldStatesStory,
  fieldFocusedStory,
  fieldTypesStory,
  fieldIconsStory,
} from "./.storybook/story-helpers";

export default defineMeta({
  title: "Adwaita/Input",
  component: Input,
  parameters: { width: 528, height: 480 },
});

export const states = defineStory({
  parameters: { width: 528, height: 300 },
  render: () => fieldStatesStory(Input),
});

export const focused = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => fieldFocusedStory(Input, "Focused input"),
});

export const types = defineStory({
  parameters: { width: 528, height: 500 },
  render: () => fieldTypesStory(Input),
});

export const withIcons = defineStory({
  parameters: { width: 528, height: 240 },
  render: () => fieldIconsStory(Input),
});
