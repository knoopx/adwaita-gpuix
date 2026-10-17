import { useState } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row, Column } from "./Box";
import { Slider } from "./Slider";

export default defineMeta({
  title: "Adwaita/Slider",
  component: Slider,
  parameters: { width: 528, height: 160 },
});

export const single = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="horizontal, value 40">
        <Slider defaultValue={40} onValueChange={() => {}} width={300} />
      </Labeled>
    </Column>
  ),
});

export const steps = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="steps (min 0, max 10, step 5)">
        <Slider
          defaultValue={5}
          min={0}
          max={10}
          step={5}
          onValueChange={() => {}}
          width={300}
        />
      </Labeled>
    </Column>
  ),
});

export const range = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="range [20, 70] — fill between the thumbs">
        <Slider defaultValue={[20, 70]} onValueChange={() => {}} width={300} />
      </Labeled>
    </Column>
  ),
});

export const vertical = defineStory({
  parameters: { width: 240, height: 220 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="vertical (min at bottom)">
        <Row align="center" style={{ height: 140 }}>
          <Slider
            orientation="vertical"
            defaultValue={60}
            onValueChange={() => {}}
            height={120}
          />
        </Row>
      </Labeled>
    </Column>
  ),
});

export const disabled = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="disabled">
        <Slider value={40} disabled onValueChange={() => {}} width={300} />
      </Labeled>
    </Column>
  ),
});

export function labels() {
  const t = useAdwaita();
  const [volume, setVolume] = useState(40);
  return (
    <Column gap={16} align="center">
      <Row gap={8} align="center">
        <T size="body" color={t.colors.fg}>
          Volume
        </T>
        <Column gap={4}>
          <Slider
            defaultValue={40}
            onValueChange={(v) => setVolume(typeof v === "number" ? v : 40)}
            width={260}
          />
          <Row justify="space-between" style={{ width: 260 }}>
            <T size="caption" color={t.colors.dim_fg}>
              0
            </T>
            <T size="caption" color={t.colors.dim_fg}>
              100
            </T>
          </Row>
        </Column>
        <T size="body" color={t.colors.dim_fg}>{volume}</T>
      </Row>
    </Column>
  );
}
