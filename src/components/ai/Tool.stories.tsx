import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Tool, ToolContent, ToolHeader } from "./Tool";

export default defineMeta({
  title: "Adwaita/Tool",
  component: Tool,
  parameters: { width: 528, height: 320 },
});

export const basic = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <Tool open onOpenChange={() => {}}>
      <ToolHeader state="output-available" toolName="read_file" />
      <ToolContent
        input={{ path: "src/index.ts", limit: 40 }}
        output={
          "export { AdwaitaProvider, useAdwaita };\nexport { Button, Switch, Entry };\nexport { Collapsible, CollapsibleContent };"
        }
      />
    </Tool>
  ),
});

export const running = defineStory({
  parameters: { width: 528, height: 130 },
  render: () => (
    <Tool open onOpenChange={() => {}}>
      <ToolHeader state="running" toolName="search" />
      <ToolContent input={{ pattern: "useAdwaita", path: "src/**/*.tsx" }} />
    </Tool>
  ),
});

/**
 * The app's own running mark: `spinnerSlot` stands in for the ring `Spinner`
 * while the tool runs, and the settled states keep the library's icon.
 */
export const runningMark = defineStory({
  parameters: { width: 528, height: 130 },
  render: () => {
    const t = useAdwaita();
    return (
      <Tool open onOpenChange={() => {}}>
        <ToolHeader
          state="running"
          toolName="search"
          spinnerSlot={
            <T
              size="caption"
              weight={t.type.weight.bold}
              color={t.color.accent.base}
              style={{ fontFamily: t.type.fontFamilyMono, flexShrink: 0 }}
            >
              working
            </T>
          }
        />
        <ToolContent input={{ pattern: "useAdwaita", path: "src/**/*.tsx" }} />
      </Tool>
    );
  },
});

export const failed = defineStory({
  parameters: { width: 528, height: 160 },
  render: () => (
    <Tool open onOpenChange={() => {}}>
      <ToolHeader state="output-error" toolName="run_command" />
      <ToolContent
        input={{ command: "pnpm --version" }}
        errorText="command not found: pnpm"
      />
    </Tool>
  ),
});

export const denied = defineStory({
  parameters: { width: 528, height: 120 },
  render: () => (
    <Tool open onOpenChange={() => {}}>
      <ToolHeader state="output-denied" toolName="write_file" />
      <ToolContent errorText="Permission denied: write_file is not allowed in this workspace" />
    </Tool>
  ),
});

export const collapsed = defineStory({
  parameters: { width: 528, height: 80 },
  render: () => (
    <Tool open={false} onOpenChange={() => {}}>
      <ToolHeader state="output-available" toolName="list_files" />
      <ToolContent output={"src/\ncomponents/\ntheme/"} />
    </Tool>
  ),
});
