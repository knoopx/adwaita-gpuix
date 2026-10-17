import { defineMeta, defineStory } from "storybook";
import { AdwaitaProvider } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row, Column } from "./Box";
import { Button } from "./Button";

function AccentButtons() {
  return (
    <Row gap={16} align="start">
      <Labeled caption="suggested (green accent)">
        <Button variant="suggested" label="Suggested" onClick={() => {}} />
      </Labeled>
      <Labeled caption="text (green accent)">
        <Button variant="text" label="Text" onClick={() => {}} />
      </Labeled>
      <Labeled caption="icon + label (green accent)">
        <Button variant="text" icon="plus" label="Add" onClick={() => {}} />
      </Labeled>
    </Row>
  );
}

export default defineMeta({
  title: "Adwaita/Button",
  component: Button,
  parameters: { width: 528, height: 460 },
});

export const variants = defineStory({
  render: () => (
    <Column gap={16} align="start">
      <Labeled caption="default">
        <Button label="Default" onClick={() => {}} />
      </Labeled>
      <Labeled caption="suggested">
        <Button variant="suggested" label="Suggested" onClick={() => {}} />
      </Labeled>
      <Labeled caption="destructive">
        <Button variant="destructive" label="Destructive" onClick={() => {}} />
      </Labeled>
      <Labeled caption="pill">
        <Button variant="pill" label="Pill" onClick={() => {}} />
      </Labeled>
      <Labeled caption="text">
        <Button variant="text" label="Text" onClick={() => {}} />
      </Labeled>
      <Labeled caption="icon">
        <Button variant="icon" icon="settings" onClick={() => {}} />
      </Labeled>
      <Labeled caption="secondary">
        <Button variant="secondary" label="Secondary" onClick={() => {}} />
      </Labeled>
    </Column>
  ),
});

export const sizes = defineStory({
  parameters: { width: 528, height: 120 },
  render: () => (
    <Row gap={16} align="start">
      <Labeled caption="sm (28)">
        <Button size="sm" label="Save" onClick={() => {}} />
      </Labeled>
      <Labeled caption="default (34)">
        <Button label="Save" onClick={() => {}} />
      </Labeled>
      <Labeled caption="lg (40)">
        <Button size="lg" label="Save" onClick={() => {}} />
      </Labeled>
      <Labeled caption="icon (square)">
        <Button size="icon" icon="settings" onClick={() => {}} />
      </Labeled>
    </Row>
  ),
});

export const states = defineStory({
  parameters: { width: 528, height: 120 },
  render: () => (
    <Row gap={16} align="start">
      <Labeled caption="disabled">
        <Button label="Disabled" disabled onClick={() => {}} />
      </Labeled>
      <Labeled caption="icon + label">
        <Button icon="settings" label="Save" onClick={() => {}} />
      </Labeled>
      <Labeled caption="children slot">
        <Button label="Add">
          <T size="caption" weight={700}>
            +1
          </T>
        </Button>
      </Labeled>
    </Row>
  ),
});

export const toolbar = defineStory({
  parameters: { width: 528, height: 96 },
  render: () => (
    <Row gap={8} align="center">
      <Button size="icon" icon="search" onClick={() => {}} />
      <Button size="icon" icon="plus" onClick={() => {}} />
      <div style={{ flexGrow: 1 }} />
      <Button variant="suggested" icon="plus" label="New" onClick={() => {}} />
      <Button
        variant="destructive"
        size="icon"
        icon="trash"
        onClick={() => {}}
      />
    </Row>
  ),
});

export const accentGreen = defineStory({
  parameters: { width: 528, height: 120 },
  render: () => (
    <AdwaitaProvider accent="green">
      <AccentButtons />
    </AdwaitaProvider>
  ),
});
