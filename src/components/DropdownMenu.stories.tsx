import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row } from "./Box";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./DropdownMenu";
import { Button } from "./Button";
import { LabeledStage } from "./.storybook/story-helpers";

function DDMFullMenu() {
  return (
    <DropdownMenu open={true} onOpenChange={() => {}}>
      <DropdownMenuContent>
        <DropdownMenuLabel>File</DropdownMenuLabel>
        <DropdownMenuItem label="New file" icon="plus" shortcut="Ctrl+N" />
        <DropdownMenuItem label="Open" icon="folder" shortcut="Ctrl+O" />
        <DropdownMenuItem label="Indented row" icon="list" inset />
        <DropdownMenuItem label="Disabled item" icon="user" disabled />
        <DropdownMenuItem label="Delete" icon="trash" variant="destructive" />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            label="Show hidden files"
            checked={true}
            onCheckedChange={() => {}}
          />
          <DropdownMenuCheckboxItem
            label="Wrap lines"
            checked={false}
            onCheckedChange={() => {}}
          />
        </DropdownMenuGroup>
        <DropdownMenuRadioGroup defaultValue="dark">
          <DropdownMenuRadioItem label="Light theme" value="light" />
          <DropdownMenuRadioItem label="Dark theme" value="dark" />
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger label="Submenu" icon="chevronRight" />
          <DropdownMenuSubContent>
            <DropdownMenuItem label="Sub item" />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default defineMeta({
  title: "Adwaita/DropdownMenu",
  component: DropdownMenu,
  parameters: { width: 528, height: 480 },
});

export const closedTrigger = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="trigger">
        <DropdownMenu open={false} onOpenChange={() => {}}>
          <DropdownMenuTrigger>
            <Button label="Open menu" onClick={() => {}} />
          </DropdownMenuTrigger>
        </DropdownMenu>
      </Labeled>
    </Row>
  ),
});

export const openAllRowKinds = defineStory({
  render: () => (
    <LabeledStage caption="open · all row kinds" width={480} height={450}>
      <Row justify="center" style={{ paddingTop: 8 }}>
        <DDMFullMenu />
      </Row>
    </LabeledStage>
  ),
});

export const basicMenu = defineStory({
  render: () => (
    <LabeledStage caption="open · basic items + separators" width={280} height={230}>
      <Row justify="center" style={{ paddingTop: 8 }}>
        <DropdownMenu open={true} onOpenChange={() => {}}>
          <DropdownMenuContent>
            <DropdownMenuItem label="New file" icon="plus" shortcut="Ctrl+N" />
            <DropdownMenuItem label="Open" icon="folder" shortcut="Ctrl+O" />
            <DropdownMenuSeparator />
            <DropdownMenuItem label="Save" icon="copy" shortcut="Ctrl+S" />
            <DropdownMenuSeparator />
            <DropdownMenuItem label="Close" />
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>
    </LabeledStage>
  ),
});

export const submenuOpen = defineStory({
  render: () => (
    <LabeledStage caption="open · submenu expanded" width={460} height={200}>
      <Row justify="center" style={{ paddingTop: 8 }}>
        <DropdownMenu open={true} onOpenChange={() => {}}>
          <DropdownMenuContent>
            <DropdownMenuItem label="Share" icon="link" />
            <DropdownMenuSub defaultOpen>
              <DropdownMenuSubTrigger label="More" icon="chevronRight" />
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  label="Copy link"
                  icon="link"
                  shortcut="Ctrl+L"
                />
                <DropdownMenuItem label="Copy as image" />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>
    </LabeledStage>
  ),
});

export const sideLeft = defineStory({
  render: () => (
    <LabeledStage caption="open · side=left" width={480} height={140}>
      <Row justify="center" align="center" style={{ height: "100%" }}>
        <DropdownMenu open={true} onOpenChange={() => {}}>
          <DropdownMenuContent side="left">
            <DropdownMenuLabel>Side</DropdownMenuLabel>
            <DropdownMenuItem label="Left-anchored item" icon="plus" />
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>
    </LabeledStage>
  ),
});
