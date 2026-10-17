import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import { Kbd, KbdGroup } from "./Kbd";
import type { IconName } from "./icons";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandDialog,
} from "./Command";
import { Stage } from "./.storybook/story-helpers";

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
            <CommandGroup label="General">
              <CommandItem
                label="New file"
                icon="plus"
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
              <CommandItem
                label="Search files"
                icon="search"
                searchTerms="find locate"
                onSelect={() => {}}
              />
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup label="Actions">
              <CommandItem
                label="Delete"
                icon="trash"
                shortcut="Del"
                disabled
                onSelect={() => {}}
              />
              <CommandItem label="Rename" icon="fileText" onSelect={() => {}} />
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
            <CommandGroup label="General">
              <CommandItem
                label="New file"
                icon="plus"
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
              <CommandItem label="Save" icon="fileText" shortcut="Ctrl+S" />
            </CommandGroup>
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
      { label: "New file", icon: "plus" },
      { label: "Open folder", icon: "folder", selected: true },
      { label: "Refresh", icon: "refresh" },
      { label: "Clipboard history", icon: "copy" },
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
              <CommandItem label="Copy" icon="copy" shortcut="Ctrl+C" />
              <CommandItem
                label="Paste"
                icon="copy"
                shortcut="Ctrl+V"
                disabled
              />
              <CommandItem label="Select all" icon="list" shortcut="Ctrl+A" />
              <CommandItem label="Clear history" icon="trash" disabled />
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
        <Stage width={480} height={220} radius={12}>
          <Row justify="center" align="center" style={{ height: "100%" }}>
            <CommandDialog open={true} onOpenChange={() => {}} contained>
              <CommandInput placeholder="Type a command…" />
              <CommandList>
                <CommandGroup label="General">
                  <CommandItem
                    label="New file"
                    icon="plus"
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
