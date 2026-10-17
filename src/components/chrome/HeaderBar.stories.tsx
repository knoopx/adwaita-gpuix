import { defineMeta, defineStory } from "storybook";
import { Labeled, T } from "../common";
import { Column } from "../Box";
import { HeaderBar } from "./HeaderBar";
import { Button } from "../Button";

const SLOTS_BAR = (
  <HeaderBar
    title="Projects"
    left={<Button variant="icon" icon="panel" onClick={() => {}} />}
    right={<Button variant="icon" icon="settings" onClick={() => {}} />}
  />
);

export default defineMeta({
  title: "Adwaita/HeaderBar",
  component: HeaderBar,
  parameters: { width: 528, height: 320 },
});

export const title = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="string title">
        {SLOTS_BAR}
      </Labeled>
      <Labeled caption="node title (rendered as-is)">
        <HeaderBar
          title={
            <T size="title3" weight={700}>
              My node title
            </T>
          }
        />
      </Labeled>
    </Column>
  ),
});

export const slots = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="left + right slots">
        {SLOTS_BAR}
      </Labeled>
      <Labeled caption="bare (no slots)">
        <HeaderBar title="Projects" />
      </Labeled>
    </Column>
  ),
});

export const subtitle = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="title + dimmed subtitle">
        <HeaderBar
          title="Projects"
          subtitle="Shared workspace"
          left={<Button variant="icon" icon="panel" onClick={() => {}} />}
          right={<Button variant="icon" icon="settings" onClick={() => {}} />}
        />
      </Labeled>
      <Labeled caption="subtitle, no slots">
        <HeaderBar title="Notes" subtitle="Draft · unsaved" />
      </Labeled>
    </Column>
  ),
});

export const labeledButtons = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="labelled buttons in the slots">
        <HeaderBar
          title="Files"
          left={
            <Button
              variant="secondary"
              icon="plus"
              label="New"
              onClick={() => {}}
            />
          }
          right={
            <Button
              variant="secondary"
              icon="settings"
              label="Settings"
              onClick={() => {}}
            />
          }
        />
      </Labeled>
      <Labeled caption="mixed labelled + icon">
        <HeaderBar
          title="Files"
          left={
            <Button
              variant="secondary"
              icon="plus"
              label="New"
              onClick={() => {}}
            />
          }
          right={<Button variant="icon" icon="search" onClick={() => {}} />}
        />
      </Labeled>
    </Column>
  ),
});

export const oneSided = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="start actions only">
        <HeaderBar
          title="Projects"
          left={
            <>
              <Button variant="icon" icon="arrowLeft" onClick={() => {}} />
              <Button variant="icon" icon="plus" onClick={() => {}} />
            </>
          }
        />
      </Labeled>
      <Labeled caption="end actions only">
        <HeaderBar
          title="Projects"
          right={
            <>
              <Button variant="icon" icon="search" onClick={() => {}} />
              <Button variant="icon" icon="settings" onClick={() => {}} />
            </>
          }
        />
      </Labeled>
    </Column>
  ),
});
