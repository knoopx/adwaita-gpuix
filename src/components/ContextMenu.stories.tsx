import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./text";
import { Row } from "./Box";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./ContextMenu";
import { LabeledStage } from "../../.storybook/story-helpers";

function CtxMenuFull() {
  return (
    <ContextMenu open={true} onOpenChange={() => {}}>
      <ContextMenuContent>
        <ContextMenuLabel>Selection</ContextMenuLabel>
        <ContextMenuItem label="Copy" icon="contentCopy" shortcut="Ctrl+C" />
        <ContextMenuItem label="Paste" icon="add" shortcut="Ctrl+V" />
        <ContextMenuItem label="Cut" icon="remove" shortcut="Ctrl+X" />
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem
            label="Delete"
            icon="delete"
            variant="destructive"
            shortcut="Del"
          />
          <ContextMenuItem label="Restore" icon="rotateLeft" disabled />
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
  return (
    <Row gap={16} align="center">
      <Labeled caption="trigger area (closed — right-click to open)">
        <ContextMenu open={false} onOpenChange={() => {}}>
          <ContextMenuTrigger>
            <div
              style={{
                padding: 16,
                borderRadius: t.radius.sm,
                borderColor: t.color.border.default,
                borderWidth: 1,
                backgroundColor: t.color.surface.button,
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
