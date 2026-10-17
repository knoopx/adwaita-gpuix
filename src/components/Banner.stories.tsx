import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Column } from "./Box";
import { Banner } from "./Banner";

export default defineMeta({
  title: "Adwaita/Banner",
  component: Banner,
  parameters: { width: 528, height: 480 },
});

export const tones = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="info">
        <Banner
          title="New version available"
          body="A stable release is ready to install."
          tone="info"
          onClose={() => {}}
        />
      </Labeled>
      <Labeled caption="warning">
        <Banner
          title="Storage almost full"
          body="You have used 95% of your quota."
          tone="warning"
          onClose={() => {}}
        />
      </Labeled>
      <Labeled caption="error">
        <Banner
          title="Sync failed"
          body="Could not reach the server."
          tone="error"
          onClose={() => {}}
        />
      </Labeled>
      <Labeled caption="success">
        <Banner
          title="All caught up"
          body="Your changes are synced."
          tone="success"
          onClose={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const plain = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="title only">
        <Banner title="All caught up" tone="info" />
      </Labeled>
      <Labeled caption="not dismissible (no close, no action)">
        <Banner
          title="Maintenance scheduled"
          body="Your workspace will be read-only at 02:00."
          tone="warning"
        />
      </Labeled>
    </Column>
  ),
});

export const icons = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="tone icon (default)">
        <Banner
          title="New version available"
          body="A stable release is ready to install."
          tone="info"
        />
      </Labeled>
      <Labeled caption="custom icon">
        <Banner
          title="New notifications"
          body="Three items are waiting for you."
          tone="info"
          icon="bell"
        />
      </Labeled>
      <Labeled caption="no icon">
        <Banner
          title="Backup complete"
          body="Everything is stored safely."
          tone="success"
          showIcon={false}
        />
      </Labeled>
    </Column>
  ),
});

export const actions = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="action + close">
        <Banner
          title="Update ready"
          body="A new version is waiting."
          tone="info"
          actionLabel="Update"
          onAction={() => {}}
          onClose={() => {}}
        />
      </Labeled>
      <Labeled caption="action only">
        <Banner
          title="Review pending"
          body="Two items are waiting for your sign-off."
          tone="warning"
          actionLabel="Review"
          onAction={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const narrow = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="narrow (action + close drop below)">
        <Banner
          title="Update ready"
          body="A new version is waiting."
          tone="info"
          actionLabel="Update"
          onAction={() => {}}
          onClose={() => {}}
          narrow
        />
      </Labeled>
      <Labeled caption="narrow, close only (right-aligned)">
        <Banner
          title="Disk almost full"
          body="Free up space to keep syncing."
          tone="warning"
          onClose={() => {}}
          narrow
        />
      </Labeled>
    </Column>
  ),
});

export const stacked = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="stacked banners">
        <Column gap={4}>
          <Banner
            title="Storage almost full"
            body="You have used 95% of your quota."
            tone="warning"
            onClose={() => {}}
          />
          <Banner
            title="Sync failed"
            body="Could not reach the server."
            tone="error"
            actionLabel="Retry"
            onAction={() => {}}
            onClose={() => {}}
          />
        </Column>
      </Labeled>
    </Column>
  ),
});

export const longText = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="wrapping body text">
        <Banner
          title="Release notes"
          body="This update brings a redesigned settings page, faster import for large libraries, improved keyboard navigation across all panels, and a number of smaller fixes reported by the community over the past few weeks."
          tone="info"
          onClose={() => {}}
        />
      </Labeled>
      <Labeled caption="long title + body, no controls">
        <Banner
          title="Your annual summary is ready"
          body="Look back at a full year of activity, highlights, and the numbers that matter."
          tone="success"
        />
      </Labeled>
    </Column>
  ),
});

export const variantAliases = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="default → info">
        <Banner
          title="Default variant"
          body="The default alias maps to the info tone."
          variant="default"
        />
      </Labeled>
      <Labeled caption="destructive → error">
        <Banner
          title="Destructive variant"
          body="The destructive alias maps to the error tone."
          variant="destructive"
        />
      </Labeled>
    </Column>
  ),
});
