import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./text";
import { Column, Row } from "./Box";
import { Kbd, KbdGroup } from "./Kbd";
import { type IconName } from "./icons";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./Command";
import { Stage } from "../../.storybook/story-helpers";
import { type ReactNode } from "react";

const GENERAL_ITEMS: {
  label: string;
  icon: IconName;
  shortcut?: string;
  searchTerms?: string;
  selected?: boolean;
}[] = [
  { label: "New file", icon: "add", shortcut: "Ctrl+N" },
  {
    label: "Open file",
    icon: "folder",
    shortcut: "Ctrl+O",
    selected: true,
  },
];

function GeneralGroup({ extra }: { extra?: ReactNode }) {
  return (
    <CommandGroup label="General">
      {GENERAL_ITEMS.map((item) => (
        <CommandItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          shortcut={item.shortcut}
          searchTerms={item.searchTerms}
          selected={item.selected}
          onSelect={() => {}}
        />
      ))}
      {extra}
    </CommandGroup>
  );
}

export default defineMeta({
  title: "Adwaita/Command",
  component: Command,
  parameters: { width: 528, height: 700 },
});

export const openPalette = defineStory({
  parameters: { width: 420, height: 640 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="groups + items (icons / shortcuts / selected / disabled) + separator">
        <Command anchored={false}>
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <GeneralGroup
              extra={
                <CommandItem
                  label="Search files"
                  icon="search"
                  searchTerms="find locate"
                  onSelect={() => {}}
                />
              }
            />
            <CommandSeparator />
            <CommandGroup label="Actions">
              <CommandItem
                label="Delete"
                icon="delete"
                shortcut="Del"
                disabled
                onSelect={() => {}}
              />
              <CommandItem label="Rename" icon="article" onSelect={() => {}} />
            </CommandGroup>
          </CommandList>
        </Command>
      </Labeled>
      <Labeled caption="empty state">
        <Command anchored={false}>
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <CommandEmpty />
          </CommandList>
        </Command>
      </Labeled>
    </Column>
  ),
});

export const floatingPalette = defineStory({
  parameters: { width: 420, height: 320 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="floating (window-anchored)">
        <Command>
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <GeneralGroup
              extra={
                <CommandItem label="Save" icon="article" shortcut="Ctrl+S" />
              }
            />
          </CommandList>
        </Command>
      </Labeled>
    </Column>
  ),
});

export const filteredResults = defineStory({
  parameters: { width: 420, height: 300 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="filtered (query “open”)">
        <Command anchored={false} defaultQuery="open">
          <CommandInput />
          <CommandList>
            <CommandGroup label="General">
              <CommandItem label="New file" shortcut="Ctrl+N" />
              <CommandItem label="Open file" shortcut="Ctrl+O" selected />
              <CommandItem label="Open recent" searchTerms="recent history" />
              <CommandItem label="Search files" searchTerms="find locate" />
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup label="Nothing matches">
              <CommandItem label="Delete" shortcut="Del" />
              <CommandItem label="Rename" />
            </CommandGroup>
          </CommandList>
        </Command>
      </Labeled>
    </Column>
  ),
});

export const withIcons = defineStory({
  parameters: { width: 420, height: 320 },
  render: () => {
    const commands: { label: string; icon: IconName; selected?: boolean }[] = [
      { label: "Preferences", icon: "settings" },
      { label: "New file", icon: "add" },
      { label: "Open folder", icon: "folder", selected: true },
      { label: "Refresh", icon: "refresh" },
      { label: "Clipboard history", icon: "contentCopy" },
    ];
    return (
      <Column gap={16} align="center">
        <Labeled caption="items with icons">
          <Command anchored={false}>
            <CommandInput placeholder="Type a command…" />
            <CommandList>
              <CommandGroup>
                {commands.map((c) => (
                  <CommandItem
                    key={c.label}
                    label={c.label}
                    icon={c.icon}
                    selected={c.selected}
                    onSelect={() => {}}
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </Labeled>
      </Column>
    );
  },
});

export const shortcutHints = defineStory({
  parameters: { width: 420, height: 300 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="shortcut hints (dim text + kbd keys)">
        <Command anchored={false}>
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <CommandGroup>
              <CommandItem label="New file" shortcut="Ctrl+N" />
              <CommandItem label="Open file" shortcut="Ctrl+O" />
              <CommandItem
                label="Go to line"
                trailing={
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>G</Kbd>
                  </KbdGroup>
                }
              />
              <CommandItem
                label="Command palette"
                trailing={
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>Shift</Kbd>
                    <Kbd>P</Kbd>
                  </KbdGroup>
                }
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </Labeled>
    </Column>
  ),
});

export const disabledItems = defineStory({
  parameters: { width: 420, height: 300 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="disabled items">
        <Command anchored={false}>
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <CommandGroup>
              <CommandItem label="Copy" icon="contentCopy" shortcut="Ctrl+C" />
              <CommandItem
                label="Paste"
                icon="contentCopy"
                shortcut="Ctrl+V"
                disabled
              />
              <CommandItem label="Select all" icon="list" shortcut="Ctrl+A" />
              <CommandItem label="Clear history" icon="delete" disabled />
            </CommandGroup>
          </CommandList>
        </Command>
      </Labeled>
    </Column>
  ),
});

const MANY_ITEMS = Array.from({ length: 24 }, (_, i) => `Command ${i + 1}`);

export const manyItems = defineStory({
  parameters: { width: 420, height: 340 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="many items (virtual list)">
        <Command anchored={false}>
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <CommandGroup>
              {MANY_ITEMS.map((label) => (
                <CommandItem key={label} label={label} onSelect={() => {}} />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </Labeled>
    </Column>
  ),
});

export const commandDialog = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="command dialog (contained, in a stage)">
        <Stage width={480} height={220} radius={8}>
          <Row justify="center" align="center" style={{ height: "100%" }}>
            <CommandDialog open={true} onOpenChange={() => {}} contained>
              <CommandInput placeholder="Type a command…" />
              <CommandList>
                <CommandGroup label="General">
                  <CommandItem
                    label="New file"
                    icon="add"
                    shortcut="Ctrl+N"
                    onSelect={() => {}}
                  />
                  <CommandItem
                    label="Open file"
                    icon="folder"
                    shortcut="Ctrl+O"
                    selected
                    onSelect={() => {}}
                  />
                </CommandGroup>
              </CommandList>
            </CommandDialog>
          </Row>
        </Stage>
      </Labeled>
    </Column>
  ),
});
