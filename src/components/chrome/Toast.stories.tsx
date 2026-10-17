import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { Toast } from "./Toast";

export default defineMeta({
  title: "Adwaita/Toast",
  component: Toast,
  parameters: { width: 520, height: 640 },
});

export const types = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="default (no icon)">
        <Toast message="File saved" />
      </Labeled>
      <Labeled caption="info">
        <Toast message="New message from Ada" type="info" />
      </Labeled>
      <Labeled caption="success">
        <Toast message="File saved" type="success" />
      </Labeled>
      <Labeled caption="warning">
        <Toast message="Disk almost full" type="warning" />
      </Labeled>
      <Labeled caption="destructive">
        <Toast message="Upload failed" type="destructive" />
      </Labeled>
      <Labeled caption="error (alias of destructive)">
        <Toast message="Upload failed" type="error" />
      </Labeled>
      <Labeled caption="loading">
        <Toast message="Uploading…" type="loading" />
      </Labeled>
    </Column>
  ),
});

export const body = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="title + body">
        <Toast
          message="File saved"
          body="report.pdf is now in your downloads folder"
        />
      </Labeled>
      <Labeled caption="type + body">
        <Toast
          message="Sync complete"
          body="128 files synced to cloud"
          type="success"
        />
      </Labeled>
    </Column>
  ),
});

export const actionDismiss = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with action">
        <Toast message="File deleted" actionLabel="Undo" onAction={() => {}} />
      </Labeled>
      <Labeled caption="with dismiss">
        <Toast message="Copied to clipboard" onDismiss={() => {}} />
      </Labeled>
      <Labeled caption="full (type + action + dismiss)">
        <Toast
          message="File saved"
          type="success"
          actionLabel="Undo"
          onAction={() => {}}
          onDismiss={() => {}}
        />
      </Labeled>
    </Column>
  ),
});
