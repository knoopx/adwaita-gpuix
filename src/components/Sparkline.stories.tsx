import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled } from "./text";
import { Column, Row } from "./Box";
import { Sparkline } from "./Sparkline";

export default defineMeta({
  title: "Adwaita/Sparkline",
  component: Sparkline,
  parameters: { width: 528, height: 320 },
});

const RISING = [1, 3, 2, 6, 5, 9, 8, 12, 10, 14, 13, 18];
const FALLING = [7, 6, 8, 5, 7, 4, 6, 3, 5, 2, 4, 1];
const SPIKE = [0, 0, 1, 0, 0, 12, 0, 0, 2, 0, 0, 0];
const FLAT = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
const SINGLE = [4];

export const themes = defineStory({
  render: () => {
    const t = useAdwaita();
    return (
      <Column gap={16}>
        <Labeled caption="success ramp">
          <Sparkline values={RISING} color={t.color.functional.success} />
        </Labeled>
        <Labeled caption="falling series · accent">
          <Sparkline values={FALLING} color={t.color.accent.base} />
        </Labeled>
        <Labeled caption="single spike · warning">
          <Sparkline values={SPIKE} color={t.color.functional.warning} />
        </Labeled>
        <Labeled caption="flat · default grey">
          <Sparkline values={FLAT} />
        </Labeled>
      </Column>
    );
  },
});

export const sizes = defineStory({
  render: () => {
    const t = useAdwaita();
    const color = t.color.functional.success;
    return (
      <Row gap={24} align="start">
        <Labeled caption="84x22 (default)">
          <Sparkline values={RISING} color={color} />
        </Labeled>
        <Labeled caption="160x48">
          <Sparkline values={RISING} color={color} width={160} height={48} />
        </Labeled>
        <Labeled caption="one point">
          <Sparkline values={SINGLE} color={color} width={160} height={48} />
        </Labeled>
      </Row>
    );
  },
});

export const empty = defineStory({
  render: () => (
    <Row gap={24} align="start">
      <Labeled caption="no values render nothing">
        <Sparkline values={[]} color="#26a269" />
      </Labeled>
      <Labeled caption="null values render nothing">
        <Sparkline values={null} color="#26a269" />
      </Labeled>
    </Row>
  ),
});
