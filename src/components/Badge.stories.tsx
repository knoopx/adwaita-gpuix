import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import { Badge } from "./Badge";

export default defineMeta({
  title: "Adwaita/Badge",
  component: Badge,
  parameters: { width: 528, height: 420 },
});

export const variants = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="default">
        <Badge>New</Badge>
      </Labeled>
      <Labeled caption="secondary">
        <Badge variant="secondary">Secondary</Badge>
      </Labeled>
      <Labeled caption="destructive">
        <Badge variant="destructive">Destructive</Badge>
      </Labeled>
      <Labeled caption="success">
        <Badge variant="success">Success</Badge>
      </Labeled>
      <Labeled caption="warning">
        <Badge variant="warning">Warning</Badge>
      </Labeled>
      <Labeled caption="outline">
        <Badge variant="outline">Outline</Badge>
      </Labeled>
    </Row>
  ),
});

export const withIcons = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="accent + info / secondary + user / destructive + alert">
        <Row gap={8} align="center">
          <Badge icon="info">Update</Badge>
          <Badge variant="secondary" icon="user">
            4 members
          </Badge>
          <Badge variant="destructive" icon="alert">
            2 errors
          </Badge>
        </Row>
      </Labeled>
      <Labeled caption="success + success / warning + warning / outline + check">
        <Row gap={8} align="center">
          <Badge variant="success" icon="success">
            Ready
          </Badge>
          <Badge variant="warning" icon="warning">
            Review
          </Badge>
          <Badge variant="outline" icon="check">
            Verified
          </Badge>
        </Row>
      </Labeled>
    </Column>
  ),
});

export const counts = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="count badges (accent / secondary / destructive)">
        <Row gap={8} align="center">
          <Badge>3</Badge>
          <Badge variant="secondary">12</Badge>
          <Badge variant="destructive">99</Badge>
        </Row>
      </Labeled>
      <Labeled caption="overflow counts (success / warning / 99+)">
        <Row gap={8} align="center">
          <Badge variant="success">42</Badge>
          <Badge variant="warning">128</Badge>
          <Badge variant="destructive">99+</Badge>
        </Row>
      </Labeled>
    </Column>
  ),
});

export const indicators = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="status dots (one per variant, md)">
        <Row gap={16} align="center">
          <Badge dot />
          <Badge variant="secondary" dot />
          <Badge variant="destructive" dot />
          <Badge variant="success" dot />
          <Badge variant="warning" dot />
          <Badge variant="outline" dot />
        </Row>
      </Labeled>
      <Labeled caption="small dots (sm)">
        <Row gap={12} align="center">
          <Badge size="sm" dot />
          <Badge size="sm" variant="destructive" dot />
          <Badge size="sm" variant="success" dot />
          <Badge size="sm" variant="warning" dot />
          <Badge size="sm" variant="outline" dot />
        </Row>
      </Labeled>
    </Column>
  ),
});

export const sizes = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="small (tight padding, 11px text, 10px icon)">
        <Row gap={8} align="center">
          <Badge size="sm">Compact</Badge>
          <Badge size="sm" variant="destructive" icon="alert">
            Errors
          </Badge>
          <Badge size="sm" variant="success">
            42
          </Badge>
          <Badge size="sm" variant="outline">
            Outline
          </Badge>
        </Row>
      </Labeled>
      <Labeled caption="medium (default)">
        <Row gap={8} align="center">
          <Badge>Comfortable</Badge>
          <Badge variant="destructive" icon="alert">
            Errors
          </Badge>
          <Badge variant="success">42</Badge>
          <Badge variant="outline">Outline</Badge>
        </Row>
      </Labeled>
    </Column>
  ),
});

export const longText = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="long label (stays on one line, pill shaped)">
        <Badge>Everything synced, all changes saved</Badge>
      </Labeled>
      <Labeled caption="very long label with icon">
        <Badge variant="warning" icon="warning">
          Storage almost full, free up space soon
        </Badge>
      </Labeled>
    </Column>
  ),
});

export const disabled = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="disabled (50% opacity, all variants)">
        <Row gap={8} align="center">
          <Badge disabled>New</Badge>
          <Badge variant="secondary" disabled>
            Paused
          </Badge>
          <Badge variant="destructive" disabled>
            Failed
          </Badge>
          <Badge variant="success" disabled>
            Done
          </Badge>
          <Badge variant="outline" disabled>
            Draft
          </Badge>
        </Row>
      </Labeled>
    </Column>
  ),
});
