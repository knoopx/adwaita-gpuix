import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Column } from "../Box";
import { Task, TaskItem } from "./Task";

export default defineMeta({
  title: "Adwaita/Task",
  component: Task,
  parameters: { width: 528, height: 320 },
});

export const statuses = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <Column gap={0} style={{ width: "100%", minWidth: 0 }}>
      <Task>
        <TaskItem title="Refactor the parser" status="done" />
        <TaskItem title="Write tests for the tokenizer" status="running" />
        <TaskItem title="Add documentation" status="pending" />
      </Task>
    </Column>
  ),
});

export const descriptions = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Column gap={0} style={{ width: "100%", minWidth: 0 }}>
      <Task>
        <TaskItem
          title="Refactor the parser"
          status="done"
          description="Split the lexer from the parser"
        />
        <TaskItem
          title="Write tests for the tokenizer"
          status="running"
          description="Cover the nested-quote edge case"
        />
      </Task>
    </Column>
  ),
});

export const progress = defineStory({
  parameters: { width: 528, height: 160 },
  render: () => (
    <Column gap={0} style={{ width: "100%", minWidth: 0 }}>
      <Task>
        <TaskItem
          title="Write tests for the tokenizer"
          status="running"
          progress={62}
        />
        <TaskItem title="Add documentation" status="pending" />
      </Task>
    </Column>
  ),
});

function ExpandedTaskDemo() {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <Column gap={0} style={{ width: "100%", minWidth: 0 }}>
      <Task>
        <TaskItem title="Refactor the parser" status="done" defaultOpen>
          <T size="caption" color={colors.dim_fg}>
            Updated app/parser.ts, app/lexer.ts and app/grammar.ts
          </T>
          <T size="caption" color={colors.dim_fg}>
            3 files changed, 41 insertions, 38 deletions
          </T>
        </TaskItem>
        <TaskItem title="Write tests for the tokenizer" status="running" />
      </Task>
    </Column>
  );
}

export const expanded = defineStory({
  parameters: { width: 528, height: 220 },
  render: () => <ExpandedTaskDemo />,
});
