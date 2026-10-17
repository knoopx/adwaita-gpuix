import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row, Column } from "./Box";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldContent,
} from "./Field";
import { Textarea } from "./Textarea";

export default defineMeta({
  title: "Adwaita/Textarea",
  component: Textarea,
  parameters: { width: 528, height: 480 },
});

export const states = defineStory({
  parameters: { width: 528, height: 480 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="placeholder" style={{ width: 320 }}>
        <Textarea placeholder="Type a message…" />
      </Labeled>
      <Labeled caption="with value (rows=3)" style={{ width: 320 }}>
        <Textarea
          value="A multi-line text area with some content."
          rows={3}
        />
      </Labeled>
      <Labeled caption="taller (rows=5)" style={{ width: 320 }}>
        <Textarea
          value="A taller text area driven by the rows prop."
          rows={5}
        />
      </Labeled>
      <Labeled caption="invalid" style={{ width: 320 }}>
        <Textarea value="This value failed validation." invalid />
      </Labeled>
      <Labeled caption="disabled" style={{ width: 320 }}>
        <Textarea value="Read-only content." disabled />
      </Labeled>
    </Column>
  ),
});

export const focused = defineStory({
  parameters: { width: 528, height: 160 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="focused (autoFocus)" style={{ width: 320 }}>
        <Textarea autoFocus placeholder="Focused textarea" rows={3} />
      </Labeled>
    </Column>
  ),
});

export const withLabel = defineStory({
  parameters: { width: 528, height: 240 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="label + hint (Field)" style={{ width: 320 }}>
        <Field>
          <FieldLabel>Message</FieldLabel>
          <FieldContent>
            <Textarea placeholder="Write your message…" rows={3} />
          </FieldContent>
          <FieldDescription>Keep it under 280 characters.</FieldDescription>
        </Field>
      </Labeled>
    </Column>
  ),
});

export function charCounter() {
  const t = useAdwaita();
  const value = "Hello from the character counter";
  return (
    <Column gap={16} align="center">
      <Labeled caption="character counter" style={{ width: 320 }}>
        <Textarea value={value} rows={3} />
        <Row justify="end">
          <T size="caption" color={t.colors.dim_fg}>
            {value.length} / 280
          </T>
        </Row>
      </Labeled>
    </Column>
  );
}
charCounter.parameters = { width: 528, height: 200 };
