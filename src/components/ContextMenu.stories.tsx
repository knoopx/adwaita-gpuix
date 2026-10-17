import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row } from "./Box";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuGroup,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "./ContextMenu";
import { LabeledStage } from "./.storybook/story-helpers";

function CtxMenuFull() {
  return (
    <ContextMenu open={true} onOpenChange={() => {}}>
      <ContextMenuContent>
        <ContextMenuLabel>Selection</ContextMenuLabel>
        <ContextMenuItem label="Copy" icon="copy" shortcut="Ctrl+C" />
        <ContextMenuItem label="Paste" icon="plus" shortcut="Ctrl+V" />
        <ContextMenuItem label="Cut" icon="minus" shortcut="Ctrl+X" />
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem
            label="Delete"
            icon="trash"
            variant="destructive"
            shortcut="Del"
          />
          <ContextMenuItem label="Restore" icon="rotateCcw" disabled />
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          label="Show hidden"
          checked={true}
          onCheckedChange={() => {}}
        />
        <ContextMenuCheckboxItem
          label="Wrap lines"
          checked={false}
          onCheckedChange={() => {}}
        />
        <ContextMenuRadioGroup defaultValue="a">
          <ContextMenuRadioItem label="Small" value="a" />
          <ContextMenuRadioItem label="Large" value="b" />
        </ContextMenuRadioGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger label="Submenu" icon="chevronRight" />
          <ContextMenuSubContent>
            <ContextMenuItem label="Sub item" />
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default defineMeta({
  title: "Adwaita/ContextMenu",
  component: ContextMenu,
  parameters: { width: 528, height: 460 },
});

export function triggerArea() {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <Row gap={16} align="center">
      <Labeled caption="trigger area (closed — right-click to open)">
        <ContextMenu open={false} onOpenChange={() => {}}>
          <ContextMenuTrigger>
            <div
              style={{
                padding: 16,
                borderRadius: radii.button,
                borderColor: colors.border,
                borderWidth: 1,
                backgroundColor: colors.button_bg,
                display: "flex",
                alignItems: "center",
              }}
            >
              <T>Right-click me</T>
            </div>
          </ContextMenuTrigger>
        </ContextMenu>
      </Labeled>
    </Row>
  );
}

export const openAllRowKinds = defineStory({
  render: () => (
    <LabeledStage
      caption="open · all row kinds (icons, shortcuts, destructive, disabled)"
      width={480}
      height={420}
    >
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
        <CtxMenuFull />
      </div>
    </LabeledStage>
  ),
});

export const submenuOpen = defineStory({
  render: () => (
    <LabeledStage caption="open · submenu expanded" width={520} height={180}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 8,
        }}
      >
        <ContextMenu open={true} onOpenChange={() => {}}>
          <ContextMenuContent>
            <ContextMenuItem label="Share" icon="link" />
            <ContextMenuSub defaultOpen>
              <ContextMenuSubTrigger label="More" icon="chevronRight" />
              <ContextMenuSubContent>
                <ContextMenuItem
                  label="Copy link"
                  icon="link"
                  shortcut="Ctrl+L"
                />
                <ContextMenuItem label="Copy as image" />
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </LabeledStage>
  ),
});
