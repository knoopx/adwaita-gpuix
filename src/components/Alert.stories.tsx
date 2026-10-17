import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Column } from "./Box";
import { Alert, AlertTitle, AlertDescription } from "./Alert";

export default defineMeta({
  title: "Adwaita/Alert",
  component: Alert,
  parameters: { width: 528, height: 400 },
});

export const variants = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="default (accent tint, info icon)">
        <Alert>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>A standard informational alert.</AlertDescription>
        </Alert>
      </Labeled>
      <Labeled caption="success (success tint)">
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Everything worked as expected.</AlertDescription>
        </Alert>
      </Labeled>
      <Labeled caption="warning (warning tint)">
        <Alert variant="warning">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Something needs your attention.</AlertDescription>
        </Alert>
      </Labeled>
      <Labeled caption="destructive (destructive tint, critical icon)">
        <Alert variant="destructive">
          <AlertTitle>Danger</AlertTitle>
          <AlertDescription>Something went wrong.</AlertDescription>
        </Alert>
      </Labeled>
    </Column>
  ),
});

export const withAction = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="action button (neutral variant)">
        <Alert action={{ label: "Retry", onClick: () => {} }}>
          <AlertTitle>Sync paused</AlertTitle>
          <AlertDescription>
            Changes are stored locally until you retry.
          </AlertDescription>
        </Alert>
      </Labeled>
      <Labeled caption="destructive with action">
        <Alert
          variant="destructive"
          action={{ label: "View details", onClick: () => {} }}
        >
          <AlertTitle>Backup failed</AlertTitle>
          <AlertDescription>The last backup could not be completed.</AlertDescription>
        </Alert>
      </Labeled>
    </Column>
  ),
});

export const dismissible = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="dismissible (close button)">
        <Alert onDismiss={() => {}}>
          <AlertTitle>Update available</AlertTitle>
          <AlertDescription>
            A new version is ready to install.
          </AlertDescription>
        </Alert>
      </Labeled>
      <Labeled caption="dismissible + action">
        <Alert
          variant="warning"
          action={{ label: "Configure", onClick: () => {} }}
          onDismiss={() => {}}
        >
          <AlertTitle>Storage almost full</AlertTitle>
          <AlertDescription>
            Free up space to keep syncing working.
          </AlertDescription>
        </Alert>
      </Labeled>
    </Column>
  ),
});

export const noIcon = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="icon hidden (icon=false)">
        <Alert icon={false}>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>A plain alert without an icon.</AlertDescription>
        </Alert>
      </Labeled>
      <Labeled caption="custom icon">
        <Alert icon="bell" variant="warning">
          <AlertTitle>Reminder</AlertTitle>
          <AlertDescription>A custom icon overrides the variant icon.</AlertDescription>
        </Alert>
      </Labeled>
    </Column>
  ),
});

export const sizes = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="small (tight padding, 16px icon)">
        <Alert size="sm" variant="success">
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>Compact padding for dense layouts.</AlertDescription>
        </Alert>
      </Labeled>
      <Labeled caption="medium (default)">
        <Alert variant="success">
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>Default padding and 18px icon.</AlertDescription>
        </Alert>
      </Labeled>
    </Column>
  ),
});

export const longText = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="long wrapping text">
        <Alert variant="warning">
          <AlertTitle>Disk usage is high</AlertTitle>
          <AlertDescription>
            Your disk is 94% full. Large projects with many uncommitted
            changes can fill quickly — consider archiving old files or moving
            the workspace to a larger volume before the next build.
          </AlertDescription>
        </Alert>
      </Labeled>
      <Labeled caption="title only (no description)">
        <Alert variant="success">
          <AlertTitle>All checks passed</AlertTitle>
        </Alert>
      </Labeled>
    </Column>
  ),
});

export const stacked = defineStory({
  render: () => (
    <Column gap={8}>
      <Alert size="sm" variant="success">
        <AlertTitle>Import finished</AlertTitle>
        <AlertDescription>42 files added.</AlertDescription>
      </Alert>
      <Alert size="sm" variant="warning">
        <AlertTitle>3 conflicts detected</AlertTitle>
        <AlertDescription>Resolve them to continue.</AlertDescription>
      </Alert>
      <Alert size="sm" variant="destructive">
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>Network unreachable.</AlertDescription>
      </Alert>
    </Column>
  ),
});
