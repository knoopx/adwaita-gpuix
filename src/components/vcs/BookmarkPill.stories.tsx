import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Row } from "../Box";
import { BookmarkPill } from "./BookmarkPill";

export default defineMeta({
  title: "Adwaita/BookmarkPill",
  component: BookmarkPill,
  parameters: { width: 528, height: 320 },
});

export const states = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="active">
        <BookmarkPill name="main" />
      </Labeled>
      <Labeled caption="dimmed">
        <BookmarkPill name="release/1.0" dimmed />
      </Labeled>
    </Row>
  ),
});

export const variants = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="default">
        <BookmarkPill name="main" />
      </Labeled>
      <Labeled caption="accent (selected)">
        <BookmarkPill name="main" variant="accent" />
      </Labeled>
      <Labeled caption="accent, dimmed">
        <BookmarkPill name="release/1.0" variant="accent" dimmed />
      </Labeled>
    </Row>
  ),
});

export const truncation = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="long name (ellipsis)">
        <div style={{ width: 140, display: "flex" }}>
          <BookmarkPill name="feature/very-long-branch-name" />
        </div>
      </Labeled>
    </Row>
  ),
});
