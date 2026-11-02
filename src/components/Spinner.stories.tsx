import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { toneColor } from "../theme/tones";
import { Labeled } from "./text";
import { Row, Column } from "./Box";
import { SPINNER_FRAMES, Spinner, spinnerFrameSrc } from "./Spinner";

export default defineMeta({
  title: "Adwaita/Spinner",
  component: Spinner,
  parameters: { width: 528, height: 320 },
});

export const basic = defineStory({
  render: () => (
    <Labeled caption="default (32, accent, a11y label)">
      <Spinner />
    </Labeled>
  ),
});

export const sizes = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="16">
        <Spinner size={16} />
      </Labeled>
      <Labeled caption="32">
        <Spinner size={32} />
      </Labeled>
      <Labeled caption="64">
        <Spinner size={64} />
      </Labeled>
    </Row>
  ),
});

export const colors = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="accent">
        <Spinner size={32} />
      </Labeled>
      <Labeled caption="success">
        <Spinner size={32} color="success" />
      </Labeled>
      <Labeled caption="warning">
        <Spinner size={32} color="warning" />
      </Labeled>
      <Labeled caption="destructive">
        <Spinner size={32} color="destructive" />
      </Labeled>
    </Row>
  ),
});

export const animated = defineStory({
  parameters: { settleMs: 250 },
  render: () => (
    <Labeled caption="spun 250 ms (3 frames on from basic)">
      <Spinner size={32} />
    </Labeled>
  ),
});

function FrameGrid() {
  const t = useAdwaita();
  const ring = toneColor(t, "accent");
  const track = t.color.border.default;
  return (
    <Column gap={16}>
      {[0, 1].map((row) => (
        <Row key={row} gap={12} align="center">
          {Array.from({ length: SPINNER_FRAMES / 2 }, (_, i) => {
            const step = row * (SPINNER_FRAMES / 2) + i;
            return (
              <img
                key={step}
                src={spinnerFrameSrc(48, ring, track, step)}
                style={{ width: 48, height: 48 }}
              />
            );
          })}
        </Row>
      ))}
    </Column>
  );
}

export const frames = defineStory({
  render: () => <FrameGrid />,
});

export const states = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="a11y label (visually hidden)">
        <Spinner size={32} label />
      </Labeled>
      <Labeled caption="no label">
        <Spinner size={32} label={false} />
      </Labeled>
    </Row>
  ),
});
