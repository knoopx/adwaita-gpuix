import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import { Field, FieldLabel, FieldDescription } from "./Field";
import { NumberField } from "./NumberField";

export default defineMeta({
  title: "Adwaita/NumberField",
  component: NumberField,
  parameters: { width: 528, height: 320 },
});

export const states = defineStory({
  parameters: { width: 528, height: 240 },
  render: () => (
    <Column gap={16} align="center">
      <Row gap={16} align="center">
        <Labeled caption="default (42)" style={{ width: 200 }}>
          <NumberField defaultValue={42} style={{ width: 160 }} />
        </Labeled>
        <Labeled
          caption="clamped (min 0, max 200, step 10)"
          style={{ width: 200 }}
        >
          <NumberField
            value={100}
            min={0}
            max={200}
            step={10}
            onChange={() => {}}
            style={{ width: 160 }}
          />
        </Labeled>
      </Row>
      <Row gap={16} align="center">
        <Labeled caption="horizontal (− N +)" style={{ width: 200 }}>
          <NumberField
            defaultValue={2}
            min={1}
            max={4}
            orientation="horizontal"
            style={{ width: 160 }}
          />
        </Labeled>
        <Labeled caption="disabled (5)" style={{ width: 200 }}>
          <NumberField defaultValue={5} disabled style={{ width: 160 }} />
        </Labeled>
      </Row>
    </Column>
  ),
});

export const withLabel = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="label + hint + unit suffix" style={{ width: 240 }}>
        <Field>
          <FieldLabel>Temperature</FieldLabel>
          <NumberField defaultValue={21} min={10} max={30} suffix="°C" />
          <FieldDescription>
            Room temperature, clamped to 10–30 °C.
          </FieldDescription>
        </Field>
      </Labeled>
    </Column>
  ),
});

export const withSuffix = defineStory({
  parameters: { width: 528, height: 160 },
  render: () => (
    <Column gap={16} align="center">
      <Row gap={16} align="center">
        <Labeled caption="suffix °C" style={{ width: 200 }}>
          <NumberField
            defaultValue={21}
            min={-10}
            max={40}
            suffix="°C"
            style={{ width: 160 }}
          />
        </Labeled>
        <Labeled caption="suffix % (step 5)" style={{ width: 200 }}>
          <NumberField
            defaultValue={65}
            min={0}
            max={100}
            step={5}
            suffix="%"
            style={{ width: 160 }}
          />
        </Labeled>
      </Row>
    </Column>
  ),
});
