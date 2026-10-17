import { defineMeta, defineStory } from "storybook";
import { Terminal } from "./Terminal";

export default defineMeta({
  title: "Adwaita/Terminal",
  component: Terminal,
  parameters: { width: 528, height: 440 },
});

const COMMAND = "bun test";
const OUTPUT =
  "25 tests passed in 1.4s\n\n  ✓ validates input (3 cases)\n  ✓ rejects malformed payloads (8 cases)\n  ✓ streams results (14 cases)";

export const basic = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <Terminal
      title="Ran bun test"
      command={COMMAND}
      output={OUTPUT}
      open
      onOpenChange={() => {}}
    />
  ),
});

export const withError = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Terminal
      title="Ran bun run build"
      command="bun run build"
      output="compiling 42 modules"
      error="error: Cannot find name 'session'\n  at src/auth.ts:12"
      open
      onOpenChange={() => {}}
    />
  ),
});

export const copyable = defineStory({
  parameters: { width: 528, height: 120 },
  render: () => (
    <Terminal
      title="Ran bun install"
      command="bun install"
      output="installed 42 packages in 3s"
      onCopy={() => {}}
      open
      onOpenChange={() => {}}
    />
  ),
});

export const streaming = defineStory({
  parameters: { width: 528, height: 150 },
  render: () => (
    <Terminal
      title="Running bun test"
      command="bun test"
      output="  ✓ validates input (3 cases)\n  ✓ rejects malformed payloads (8 cases)"
      isStreaming
      onOpenChange={() => {}}
    />
  ),
});

export const collapsed = defineStory({
  parameters: { width: 528, height: 80 },
  render: () => (
    <Terminal
      title="Ran bun lint"
      command="bun lint"
      output="0 problems"
      open={false}
      onOpenChange={() => {}}
    />
  ),
});

export const scrolling = defineStory({
  parameters: { width: 528, height: 240 },
  render: () => {
    const lines = Array.from(
      { length: 24 },
      (_, i) => `  ✓ test ${String(i + 1).padStart(2, "0")} passed (2ms)`,
    );
    return (
      <Terminal
        title="Ran bun test"
        command="bun test"
        output={`${lines.join("\n")}\n\n25 tests passed in 1.4s`}
        maxHeight={140}
        open
        onOpenChange={() => {}}
      />
    );
  },
});
