import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { TodoCard } from "./TodoCard";

export default defineMeta({
  title: "Adwaita/TodoCard",
  component: TodoCard,
  parameters: { width: 528, height: 280 },
});

export const items = defineStory({
  parameters: { width: 528, height: 560 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with verb (mixed)" style={{ width: "100%" }}>
        <TodoCard
          data={{
            verb: "Ship",
            items: [
              { label: "Fix the slider drag", done: true },
              { label: "Add dark scheme", done: true },
              { label: "Update the docs" },
            ],
          }}
        />
      </Labeled>
      <Labeled caption="plain (no verb)" style={{ width: "100%" }}>
        <TodoCard
          data={{
            verb: null,
            items: [{ label: "Review PRs" }, { label: "Triage issues", done: true }],
          }}
        />
      </Labeled>
      <Labeled caption="no items" style={{ width: "100%" }}>
        <TodoCard data={{ verb: null, items: [] }} />
      </Labeled>
    </Column>
  ),
});

export const allDone = defineStory({
  parameters: { width: 528, height: 420 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="all done (success)" style={{ width: "100%" }}>
        <TodoCard
          data={{
            verb: "Shopping",
            items: [
              { label: "Milk", done: true },
              { label: "Bread", done: true },
              { label: "Eggs", done: true },
            ],
          }}
        />
      </Labeled>
      <Labeled caption="all done (no verb)" style={{ width: "100%" }}>
        <TodoCard
          data={{
            verb: null,
            items: [
              { label: "Water the plants", done: true },
              { label: "Take out the bins", done: true },
            ],
          }}
        />
      </Labeled>
    </Column>
  ),
});
