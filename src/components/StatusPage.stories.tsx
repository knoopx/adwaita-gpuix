import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Column } from "./Box";
import { Button } from "./Button";
import { StatusPage } from "./StatusPage";
import { Spinner } from "./Spinner";

export default defineMeta({
  title: "Adwaita/StatusPage",
  component: StatusPage,
  parameters: { width: 528, height: 640 },
});

export const variants = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="icon + title + description">
        <StatusPage
          icon="sparkles"
          title="Nothing here yet"
          description="Your workspace is empty. Create your first item to get started."
        />
      </Labeled>
      <Labeled caption="with content (children)">
        <StatusPage
          icon="clock"
          title="Loading"
          description="Please wait while we fetch your data…"
        >
          <Spinner size={32} />
        </StatusPage>
      </Labeled>
      <Labeled caption="title only">
        <StatusPage icon="search" title="No results" />
      </Labeled>
    </Column>
  ),
});

export const withAction = defineStory({
  render: () => (
    <StatusPage
      icon="inbox"
      title="Your inbox is empty"
      description="Messages you send and receive will show up here."
    >
      <Button variant="suggested" icon="plus" label="Create message" />
    </StatusPage>
  ),
});

export const tones = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="success">
        <StatusPage
          icon="success"
          tone="success"
          title="All up to date"
          description="Everything is synchronized and ready to go."
        />
      </Labeled>
      <Labeled caption="warning">
        <StatusPage
          icon="warning"
          tone="warning"
          title="Storage almost full"
          description="You are close to your limit. Free up space to keep syncing."
        />
      </Labeled>
      <Labeled caption="destructive">
        <StatusPage
          icon="alert"
          tone="destructive"
          title="Something went wrong"
          description="We could not load your data. Check your connection and try again."
        >
          <Button variant="destructive" icon="refresh" label="Retry" />
        </StatusPage>
      </Labeled>
    </Column>
  ),
});
