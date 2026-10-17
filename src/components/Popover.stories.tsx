import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T, Labeled, MenuRow, destructiveRowProps } from "./common";
import { Row } from "./Box";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "./Popover";
import { Button } from "./Button";
import { Icon } from "./icons";
import { LabeledStage, SidesShowcase } from "./.storybook/story-helpers";

function SidePopover({
  side,
  text,
}: {
  side: "top" | "right" | "bottom" | "left";
  text: string;
}) {
  return (
    <Popover open={true} onOpenChange={() => {}}>
      <PopoverAnchor>
        <PopoverTrigger>
          <Button label={side} onClick={() => {}} />
        </PopoverTrigger>
        <PopoverContent side={side}>
          <T size="caption">{text}</T>
        </PopoverContent>
      </PopoverAnchor>
    </Popover>
  );
}

export default defineMeta({
  title: "Adwaita/Popover",
  component: Popover,
  parameters: { width: 528, height: 400 },
});

export function closedTrigger() {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <Row gap={16} align="center">
      <Labeled caption="button trigger (panel closed)">
        <Popover open={false} onOpenChange={() => {}}>
          <PopoverTrigger>
            <Button label="Open popover" onClick={() => {}} />
          </PopoverTrigger>
        </Popover>
      </Labeled>
      <Labeled caption="bare text trigger (icon + label)">
        <Popover open={false} onOpenChange={() => {}}>
          <PopoverTrigger>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                padding: 8,
              }}
            >
              <Icon name="settings" size={16} color={colors.dim_fg} />
              <T size="body">Settings</T>
            </div>
          </PopoverTrigger>
        </Popover>
      </Labeled>
    </Row>
  );
}

export const sides = defineStory({
  render: () => (
    <SidesShowcase
      caption="side prop, anchored in a stage"
      Side={SidePopover}
      texts={[
        "Above the trigger",
        "Right of the trigger",
        "Below the trigger",
        "Left of the trigger",
      ]}
      stage={{ width: 480, height: 120 }}
    />
  ),
});

export const richContent = defineStory({
  render: () => (
    <LabeledStage
      caption="header + title + description + action"
      width={480}
      height={170}
      center
    >
      <Popover open={true} onOpenChange={() => {}}>
        <PopoverAnchor>
          <PopoverTrigger>
            <Button label="Open popover" onClick={() => {}} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Popover title</PopoverTitle>
              <PopoverDescription>
                A dim description line under the title.
              </PopoverDescription>
            </PopoverHeader>
            <Button label="Confirm" onClick={() => {}} />
          </PopoverContent>
        </PopoverAnchor>
      </Popover>
    </LabeledStage>
  ),
});

export function listContent() {
  const t = useAdwaita();
  const destructive = destructiveRowProps(t);
  return (
    <LabeledStage
      caption="open · list of actions (menu-in-popover idiom)"
      width={480}
      height={260}
      center
    >
      <Popover open={true} onOpenChange={() => {}}>
        <PopoverAnchor>
          <PopoverTrigger>
            <Button label="Actions" icon="menu" onClick={() => {}} />
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            style={{ padding: 4, gap: 2, minWidth: 180 }}
          >
            <MenuRow label="Copy link" icon="link" onClick={() => {}} />
            <MenuRow label="Duplicate" icon="copy" onClick={() => {}} />
            <MenuRow label="Rename" icon="user" onClick={() => {}} />
            <MenuRow
              label="Delete"
              icon="trash"
              onClick={() => {}}
              labelColor={destructive.labelColor}
              iconColor={destructive.iconColor}
              hoverBackgroundColor={destructive.hoverBackgroundColor}
            />
          </PopoverContent>
        </PopoverAnchor>
      </Popover>
    </LabeledStage>
  );
}
