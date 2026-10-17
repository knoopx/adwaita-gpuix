import { defineMeta, defineStory } from "storybook";
import { Column, Row } from "./Box";
import {
  Empty,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyHeader,
  EmptyAction,
} from "./Empty";
import { Button } from "./Button";

export default defineMeta({
  title: "Adwaita/Empty",
  component: Empty,
  parameters: { width: 528, height: 360 },
});

export const full = defineStory({
  render: () => (
    <Column align="center">
      <Empty>
        <EmptyMedia icon="sparkles" />
        <EmptyTitle>No items</EmptyTitle>
        <EmptyDescription>You have nothing to show yet.</EmptyDescription>
        <EmptyContent>
          <EmptyAction>
            <Button label="Add item" onClick={() => {}} />
            <Button variant="suggested" label="Import" onClick={() => {}} />
          </EmptyAction>
        </EmptyContent>
      </Empty>
    </Column>
  ),
});

export const groupedHeader = defineStory({
  render: () => (
    <Column align="center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia icon="inbox" />
          <EmptyTitle>Nothing here</EmptyTitle>
          <EmptyDescription>
            Grouped header keeps media, title and description centred.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyAction>
          <Button label="Primary" onClick={() => {}} />
          <Button variant="suggested" label="Secondary" onClick={() => {}} />
        </EmptyAction>
      </Empty>
    </Column>
  ),
});

export const minimal = defineStory({
  render: () => (
    <Column align="center">
      <Empty>
        <EmptyTitle>Empty</EmptyTitle>
      </Empty>
    </Column>
  ),
});

export const tones = defineStory({
  render: () => (
    <Column align="center">
      <Row gap={24} align="center">
        <EmptyMedia icon="sparkles" tone="accent" />
        <EmptyMedia icon="success" tone="success" />
        <EmptyMedia icon="warning" tone="warning" />
        <EmptyMedia icon="trash" tone="destructive" />
      </Row>
    </Column>
  ),
});

export const destructive = defineStory({
  render: () => (
    <Column align="center">
      <Empty>
        <EmptyMedia icon="trash" tone="destructive" />
        <EmptyTitle>Storage full</EmptyTitle>
        <EmptyDescription>
          Free up space to keep syncing your files.
        </EmptyDescription>
        <EmptyContent>
          <EmptyAction>
            <Button
              variant="destructive"
              label="Delete oldest"
              onClick={() => {}}
            />
          </EmptyAction>
        </EmptyContent>
      </Empty>
    </Column>
  ),
});
