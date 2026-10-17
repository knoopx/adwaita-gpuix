import { useState } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row, Column } from "./Box";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  Frame,
} from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Avatar } from "./Avatar";
import { Icon, type IconName } from "./icons";

export default defineMeta({
  title: "Adwaita/Card",
  component: Card,
  parameters: { width: 528, height: 440 },
});

export const variants = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="Card (title prop)">
        <Card title="Simple card">
          <T>Card body content.</T>
        </Card>
      </Labeled>
      <Labeled caption="Card (compound sub-parts + action)">
        <Card>
          <CardHeader>
            <Row gap={8} justify="space-between" align="start">
              <Column gap={4}>
                <CardTitle>Card title</CardTitle>
                <CardDescription>
                  A short description of the card.
                </CardDescription>
              </Column>
              <CardAction>
                <Badge>New</Badge>
              </CardAction>
            </Row>
          </CardHeader>
          <CardContent>
            <T>Card body content goes here.</T>
          </CardContent>
          <CardFooter>
            <Button label="Action" onClick={() => {}} />
            <Button variant="secondary" label="Details" onClick={() => {}} />
          </CardFooter>
        </Card>
      </Labeled>
      <Labeled caption="Frame (plain surface)">
        <Frame>
          <div style={{ padding: 16 }}>
            <T>Frame content.</T>
          </div>
        </Frame>
      </Labeled>
    </Column>
  ),
});

export function mediaHeader() {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <Labeled caption="Card (media area, token placeholder)">
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 96,
            borderRadius: radii.row,
            backgroundColor: colors.accentTint,
          }}
        >
          <Icon name="image" size={32} color={colors.dim_fg} />
        </div>
        <CardHeader>
          <CardTitle>Media card</CardTitle>
          <CardDescription>
            The media area is a token-driven placeholder, not a remote image.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <T>Card body content below the media area.</T>
        </CardContent>
      </Card>
    </Labeled>
  );
}
mediaHeader.parameters = { width: 528, height: 340 };

export const profileHeader = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Labeled caption="Card (avatar + badge in header)">
      <Card>
        <CardHeader>
          <Row gap={12} align="center">
            <Avatar name="Ada Lovelace" size={40} />
            <Column gap={4} grow={1}>
              <CardTitle>Ada Lovelace</CardTitle>
              <CardDescription>ada@lovelace.example</CardDescription>
            </Column>
            <CardAction>
              <Badge variant="success" icon="check">
                Active
              </Badge>
            </CardAction>
          </Row>
        </CardHeader>
        <CardContent>
          <T>Profile summary content.</T>
        </CardContent>
      </Card>
    </Labeled>
  ),
});

export function interactive() {
  const t = useAdwaita();
  const { colors } = t;
  const [selected, setSelected] = useState(0);
  return (
    <Labeled caption="Card (interactive, hover + selected border)">
      <Row gap={12}>
        {[0, 1].map((i) => (
          <div
            key={i}
            onClick={() => setSelected(i)}
            style={{ flexGrow: 1, minWidth: 0 }}
          >
            <Card
              style={{
                cursor: "pointer",
                borderColor: selected === i ? colors.accent : colors.border,
                borderWidth: selected === i ? 2 : 1,
                hover: { backgroundColor: colors.button_hover },
              }}
            >
              <CardHeader>
                <CardTitle>Option {i + 1}</CardTitle>
                <CardDescription>
                  {selected === i ? "Selected" : "Click to select"}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </Row>
    </Labeled>
  );
}
interactive.parameters = { width: 528, height: 240 };

const GRID_ITEMS: { icon: IconName; title: string; desc: string }[] = [
  { icon: "layers", title: "Storage", desc: "128 GB used of 512 GB" },
  { icon: "clock", title: "Uptime", desc: "34 days" },
  { icon: "user", title: "Members", desc: "8 active" },
  { icon: "settings", title: "Preferences", desc: "3 pending" },
];

export function grid() {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <Labeled caption="Card grid (2x2)">
      <Column gap={12}>
        {[0, 2].map((start) => (
          <Row key={start} gap={12}>
            {GRID_ITEMS.slice(start, start + 2).map((item) => (
              <Card key={item.title} style={{ flexGrow: 1, minWidth: 0 }}>
                <Row gap={8} align="center">
                  <Icon name={item.icon} size={16} color={colors.dim_fg} />
                  <CardTitle>{item.title}</CardTitle>
                </Row>
                <CardDescription>{item.desc}</CardDescription>
              </Card>
            ))}
          </Row>
        ))}
      </Column>
    </Labeled>
  );
}
grid.parameters = { width: 528, height: 320 };

export const dimmed = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Labeled caption="Card (disabled / dimmed)">
      <Card style={{ opacity: 0.5 }}>
        <CardHeader>
          <CardTitle>Unavailable card</CardTitle>
          <CardDescription>
            Dimmed to communicate a disabled state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <T>Content is not interactive.</T>
        </CardContent>
        <CardFooter>
          <Button label="Open" disabled />
          <Button variant="secondary" label="Details" disabled />
        </CardFooter>
      </Card>
    </Labeled>
  ),
});

export const longContent = defineStory({
  parameters: { width: 528, height: 400 },
  render: () => (
    <Labeled caption="Card (long content)">
      <Card>
        <CardHeader>
          <CardTitle>Long content</CardTitle>
          <CardDescription>
            Text wraps inside the card at any width.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <T>
            This card carries a long body of text. Cards grow with their
            content: the title and description stay fixed at the top, the
            body wraps line by line inside the frame, and the footer actions
            remain anchored at the bottom. Nothing is clipped and no
            scrolling is needed inside the card itself.
          </T>
        </CardContent>
        <CardFooter>
          <Button variant="suggested" label="Continue" onClick={() => {}} />
          <Button variant="text" label="Skip" onClick={() => {}} />
        </CardFooter>
      </Card>
    </Labeled>
  ),
});
