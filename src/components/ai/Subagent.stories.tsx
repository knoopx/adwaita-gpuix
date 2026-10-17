import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { Subagent } from "./Subagent";

export default defineMeta({
  title: "Adwaita/Subagent",
  component: Subagent,
  parameters: { width: 528, height: 320 },
});

export const expanded = defineStory({
  parameters: { width: 528, height: 420 },
  render: () => (
    <Column gap={16} align="center" style={{ width: "100%" }}>
      <Labeled caption="research agent, 3 tools" style={{ width: "100%" }}>
        <Subagent
          name="research"
          model="gpuix-32b"
          instructions="Compare WebGL2 and Vulkan for a GPU image pipeline."
          tools={[
            {
              name: "web_search",
              description: "Vulkan compute pipeline best practices",
              status: "complete",
            },
            {
              name: "read_file",
              description: "src/renderer/pipeline.rs",
              status: "complete",
            },
            {
              name: "write_file",
              description: "docs/rendering-notes.md",
              status: "running",
            },
          ]}
          output={
            "Vulkan: explicit pipelines, better multithreading.\nWebGL2: simpler, broader compatibility."
          }
          open
          onOpenChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const collapsed = defineStory({
  parameters: { width: 528, height: 160 },
  render: () => (
    <Column gap={16} align="center" style={{ width: "100%" }}>
      <Labeled caption="header only" style={{ width: "100%" }}>
        <Subagent name="test" open={false} onOpenChange={() => {}} />
      </Labeled>
    </Column>
  ),
});

export const running = defineStory({
  parameters: { width: 528, height: 400 },
  render: () => (
    <Column gap={16} align="center" style={{ width: "100%" }}>
      <Labeled caption="running subagent (spinner)" style={{ width: "100%" }}>
        <Subagent
          name="research"
          model="gpuix-32b"
          status="running"
          instructions="Compare WebGL2 and Vulkan for a GPU image pipeline."
          tools={[
            {
              name: "web_search",
              description: "Vulkan compute pipeline best practices",
              status: "complete",
            },
            {
              name: "read_file",
              description: "src/renderer/pipeline.rs",
              status: "running",
            },
            {
              name: "write_file",
              description: "docs/rendering-notes.md",
              status: "pending",
            },
          ]}
          open
          onOpenChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const done = defineStory({
  parameters: { width: 528, height: 320 },
  render: () => (
    <Column gap={16} align="center" style={{ width: "100%" }}>
      <Labeled caption="done (checkmark + result)" style={{ width: "100%" }}>
        <Subagent
          name="tester"
          status="complete"
          instructions="Run the test suite and report failures."
          tools={[
            { name: "run_tests", description: "bun test", status: "complete" },
          ]}
          output="3 passed, 0 failed."
          open
          onOpenChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const failed = defineStory({
  parameters: { width: 528, height: 320 },
  render: () => (
    <Column gap={16} align="center" style={{ width: "100%" }}>
      <Labeled caption="failed (destructive)" style={{ width: "100%" }}>
        <Subagent
          name="tester"
          status="error"
          instructions="Run the test suite and report failures."
          tools={[
            { name: "run_tests", description: "bun test", status: "error" },
          ]}
          output="2 tests failed: test/resize.spec.ts, test/focus.spec.ts"
          open
          onOpenChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});
