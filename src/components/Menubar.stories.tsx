import { defineMeta, defineStory } from "storybook";
import { type ReactNode } from "react";
import { useAdwaita } from "../theme/adwaita";
import { Labeled } from "./text";
import { Column } from "./Box";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./Menubar";

function ContentFrame({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 4,
        borderRadius: t.radius.sm,
        borderWidth: 1,
        borderColor: t.color.border.default,
        backgroundColor: t.color.surface.view,
      }}
    >
      {children}
    </div>
  );
}

function ViewTrigger() {
  return (
    <MenubarTrigger label="View">
      <MenubarContent>
        <MenubarItem label="Zoom in" icon="add" />
      </MenubarContent>
    </MenubarTrigger>
  );
}

function HelpTrigger() {
  return (
    <MenubarTrigger label="Help">
      <MenubarContent>
        <MenubarItem label="About" icon="info" />
      </MenubarContent>
    </MenubarTrigger>
  );
}

export default defineMeta({
  title: "Adwaita/Menubar",
  component: Menubar,
  parameters: { width: 528, height: 480 },
});

export const bar = defineStory({
  render: () => (
    <Column gap={16} align="start">
      <Labeled caption="bar · all menus closed">
        <Menubar>
          <MenubarMenu label="File">
            <MenubarContent>
              <MenubarItem label="New file" icon="add" shortcut="Ctrl+N" />
              <MenubarItem label="Open" icon="folder" shortcut="Ctrl+O" />
            </MenubarContent>
          </MenubarMenu>
          <MenubarTrigger label="Edit">
            <MenubarContent>
              <MenubarItem label="Cut" icon="remove" shortcut="Ctrl+X" />
              <MenubarItem label="Copy" icon="contentCopy" shortcut="Ctrl+C" />
            </MenubarContent>
          </MenubarTrigger>
          <MenubarTrigger label="View">
            <MenubarContent>
              <MenubarItem label="Zoom in" icon="add" />
              <MenubarItem label="Zoom out" icon="remove" />
            </MenubarContent>
          </MenubarTrigger>
          <HelpTrigger />
        </Menubar>
      </Labeled>
    </Column>
  ),
});

export const openMenu = defineStory({
  render: () => (
    <Column gap={16} align="start">
      <Labeled caption="menu open · items, separators, shortcut, destructive">
        <Menubar>
          <MenubarMenu label="File" defaultOpen>
            <MenubarContent>
              <MenubarItem label="New file" icon="add" shortcut="Ctrl+N" />
              <MenubarItem label="Open" icon="folder" shortcut="Ctrl+O" />
              <MenubarSeparator />
              <MenubarItem label="Save" icon="contentCopy" shortcut="Ctrl+S" />
              <MenubarItem label="Delete" icon="delete" variant="destructive" />
              <MenubarSeparator />
              <MenubarItem label="Close" icon="close" />
            </MenubarContent>
          </MenubarMenu>
          <MenubarTrigger label="Edit">
            <MenubarContent>
              <MenubarItem label="Cut" icon="remove" shortcut="Ctrl+X" />
            </MenubarContent>
          </MenubarTrigger>
          <ViewTrigger />
        </Menubar>
      </Labeled>
    </Column>
  ),
});

export const submenu = defineStory({
  render: () => (
    <Column gap={16} align="start">
      <Labeled caption="menu open · submenu expanded">
        <Menubar>
          <MenubarMenu label="View" defaultOpen>
            <MenubarContent>
              <MenubarItem label="Zoom in" icon="add" shortcut="Ctrl+Plus" />
              <MenubarItem
                label="Zoom out"
                icon="remove"
                shortcut="Ctrl+Minus"
              />
              <MenubarSeparator />
              <MenubarSub defaultOpen>
                <MenubarSubTrigger label="Zoom" icon="chevronRight" />
                <MenubarSubContent>
                  <MenubarItem label="Zoom in" icon="add" />
                  <MenubarItem label="Zoom out" icon="remove" />
                  <MenubarItem label="Reset zoom" />
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <HelpTrigger />
        </Menubar>
      </Labeled>
    </Column>
  ),
});

export const disabledItems = defineStory({
  render: () => (
    <Column gap={16} align="start">
      <Labeled caption="menu open · disabled rows">
        <Menubar>
          <MenubarMenu label="Edit" defaultOpen>
            <MenubarContent>
              <MenubarItem label="Cut" icon="remove" disabled />
              <MenubarItem label="Copy" icon="contentCopy" shortcut="Ctrl+C" />
              <MenubarItem label="Paste" shortcut="Ctrl+V" disabled />
              <MenubarSeparator />
              <MenubarItem label="Delete" icon="delete" variant="destructive" />
            </MenubarContent>
          </MenubarMenu>
          <ViewTrigger />
        </Menubar>
      </Labeled>
    </Column>
  ),
});

export const contentItemVariants = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="static content block (item variants)">
        <ContentFrame>
          <MenubarContent>
            <MenubarLabel>Editing</MenubarLabel>
            <MenubarItem label="Cut" icon="remove" shortcut="Ctrl+X" />
            <MenubarItem label="Copy" icon="contentCopy" />
            <MenubarItem label="Indented row" icon="list" inset />
            <MenubarItem label="Delete" icon="delete" variant="destructive" />
            <MenubarSeparator />
            <MenubarCheckboxItem
              label="Show hidden"
              checked={true}
              onCheckedChange={() => {}}
            />
            <MenubarRadioGroup defaultValue="dark">
              <MenubarRadioItem label="Light theme" value="light" />
              <MenubarRadioItem label="Dark theme" value="dark" />
            </MenubarRadioGroup>
            <MenubarSub>
              <MenubarSubTrigger label="Submenu" icon="chevronRight" />
              <MenubarSubContent>
                <MenubarItem label="Sub item" />
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </ContentFrame>
      </Labeled>
    </Column>
  ),
});
