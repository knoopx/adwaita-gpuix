import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./text";
import { Column } from "./Box";
import { Trace, traceTotal, type TraceSpan } from "./Trace";

const RUN: TraceSpan[] = [
  { label: "run", offset: 0, duration: 1840 },
  { label: "chat.completions", offset: 40, duration: 720 },
  { label: "web_search", offset: 800, duration: 460, tone: "accent" },
  { label: "fetch page", offset: 860, duration: 380, depth: 1 },
  { label: "chat.completions", offset: 1300, duration: 540 },
];

const NESTED: TraceSpan[] = [
  { label: "turn", offset: 0, duration: 6_000, figure: "6.0s" },
  { label: "think", offset: 200, duration: 1_400, depth: 1, figure: "1.4s" },
  { label: "tool", offset: 1_700, duration: 2_600, depth: 1, figure: "2.6s" },
  { label: "read", offset: 1_900, duration: 900, depth: 2, figure: "0.9s" },
  { label: "edit", offset: 2_900, duration: 1_300, depth: 2, figure: "1.3s" },
  { label: "answer", offset: 4_400, duration: 1_500, depth: 1, figure: "1.5s" },
];

export default defineMeta({
  title: "Adwaita/Trace",
  component: Trace,
  parameters: { width: 620, height: 320 },
});

export const spans = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption={`five spans on the axis the spans set (${String(traceTotal(RUN))}ms)`}
        style={{ flexGrow: 1 }}
      >
        <Trace spans={RUN} />
      </Labeled>
    </Column>
  ),
});

export const nesting = defineStory({
  parameters: { width: 620, height: 340 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="depth steps a child span in; the axis is the turn" style={{ flexGrow: 1 }}>
        <Trace spans={NESTED} labelWidth={120} figureWidth={44} />
      </Labeled>
    </Column>
  ),
});

export const capped = defineStory({
  parameters: { width: 620, height: 260 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="axis capped past the spans: the run stopped early and the room shows"
        style={{ flexGrow: 1 }}
      >
        <Trace spans={RUN.slice(0, 3)} total={2600} />
      </Labeled>
    </Column>
  ),
});
