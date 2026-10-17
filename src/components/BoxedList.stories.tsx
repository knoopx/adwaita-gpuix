import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Column } from "./Box";
import {
  BoxedList,
  ActionRow,
  EntryRow,
  SwitchRow,
  SpinRow,
  ComboRow,
  ExpanderRow,
  ButtonRow,
} from "./BoxedList";

export default defineMeta({
  title: "Adwaita/BoxedList",
  component: BoxedList,
  parameters: { width: 528, height: 320 },
});

export const actionRow = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with prefix + suffix icons">
        <BoxedList>
          <ActionRow
            title="Open settings"
            subtitle="Configure the application"
            prefix="settings"
            suffix="chevronDown"
            onClick={() => {}}
          />
        </BoxedList>
      </Labeled>
      <Labeled caption="plain (no icons)">
        <BoxedList>
          <ActionRow
            title="Open settings"
            subtitle="Configure the application"
            onClick={() => {}}
          />
        </BoxedList>
      </Labeled>
    </Column>
  ),
});

export const entryRow = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with value">
        <BoxedList>
          <EntryRow title="Display name" value="Ada Lovelace" />
        </BoxedList>
      </Labeled>
      <Labeled caption="placeholder (empty)">
        <BoxedList>
          <EntryRow title="Display name" placeholder="Type here…" />
        </BoxedList>
      </Labeled>
    </Column>
  ),
});

export const switchRow = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="on">
        <BoxedList>
          <SwitchRow
            title="Notifications"
            subtitle="Show badges"
            checked={true}
            onChange={() => {}}
          />
        </BoxedList>
      </Labeled>
      <Labeled caption="off">
        <BoxedList>
          <SwitchRow
            title="Notifications"
            checked={false}
            onChange={() => {}}
          />
        </BoxedList>
      </Labeled>
    </Column>
  ),
});

export const spinRow = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="mid range">
        <BoxedList>
          <SpinRow title="Volume" value={40} onChange={() => {}} />
        </BoxedList>
      </Labeled>
      <Labeled caption="at min (− disabled)">
        <BoxedList>
          <SpinRow title="Volume" value={0} onChange={() => {}} />
        </BoxedList>
      </Labeled>
      <Labeled caption="at max (+ disabled)">
        <BoxedList>
          <SpinRow title="Volume" value={99} onChange={() => {}} />
        </BoxedList>
      </Labeled>
    </Column>
  ),
});

export const comboRow = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="cycling pill">
        <BoxedList>
          <ComboRow
            title="Language"
            value="English"
            options={["English", "Español", "Français"]}
            onChange={() => {}}
          />
        </BoxedList>
      </Labeled>
    </Column>
  ),
});

export const expanderRow = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="collapsed (expanded is internal state)">
        <BoxedList>
          <ExpanderRow title="Advanced" subtitle="More options">
            <T>Advanced details revealed here.</T>
          </ExpanderRow>
        </BoxedList>
      </Labeled>
    </Column>
  ),
});

export const buttonRow = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="accent">
        <BoxedList>
          <ButtonRow title="Share project" label="Share" onClick={() => {}} />
        </BoxedList>
      </Labeled>
      <Labeled caption="destructive">
        <BoxedList>
          <ButtonRow
            title="Delete project"
            label="Delete"
            destructive
            onClick={() => {}}
          />
        </BoxedList>
      </Labeled>
    </Column>
  ),
});

const selectedRowsItems = [
  { title: "Inbox", subtitle: "12 new messages", icon: "inbox" as const, selected: false, suffix: undefined as "check" | undefined },
  { title: "Drafts", subtitle: "2 unsent", icon: "fileText" as const, selected: true, suffix: "check" as const },
  { title: "Sent", subtitle: "34 this week", icon: "arrowUp" as const, selected: false, suffix: undefined as "check" | undefined },
  { title: "Archive", subtitle: "Nothing new", icon: "folder" as const, selected: false, suffix: undefined as "check" | undefined },
];

export const selectedRows = defineStory({
  parameters: { width: 528, height: 260 },
  render: () => (
    <Labeled
      caption="multi-line rows · separators · selected row · trailing check"
      style={{ alignItems: "center" }}
    >
      <BoxedList>
        {selectedRowsItems.map((item) => (
          <ActionRow
            key={item.title}
            title={item.title}
            subtitle={item.subtitle}
            prefix={item.icon}
            suffix={item.suffix}
            selected={item.selected}
            onClick={() => {}}
          />
        ))}
      </BoxedList>
    </Labeled>
  ),
});

export const disabledRows = defineStory({
  parameters: { width: 528, height: 220 },
  render: () => (
    <Labeled
      caption="disabled rows (dimmed, non-interactive)"
      style={{ alignItems: "center" }}
    >
      <BoxedList>
        <ActionRow
          title="Sync account"
          subtitle="Not connected"
          prefix="refresh"
          disabled
        />
        <SwitchRow
          title="Night mode"
          checked={true}
          onChange={() => {}}
          disabled
        />
        <ButtonRow title="Delete project" label="Delete" destructive disabled />
      </BoxedList>
    </Labeled>
  ),
});

export const emptyList = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <Labeled
      caption="empty list (emptyLabel)"
      style={{ alignItems: "center" }}
    >
      <BoxedList emptyLabel="No items" />
    </Labeled>
  ),
});

const virtualRowsItems = Array.from({ length: 40 }, (_, i) => ({
  title: `Row ${i + 1}`,
  subtitle: `Item ${i + 1} of 40`,
}));

export function virtualRows() {
  const t = useAdwaita();
  return (
    <Labeled caption="many rows (virtual-list)" style={{ alignItems: "center" }}>
      <BoxedList style={{ height: 280 }}>
        <virtual-list
          estimatedItemHeight={56}
          style={{ flexGrow: 1, minHeight: 0 }}
        >
          {virtualRowsItems.map((item, i) => (
            <div
              key={item.title}
              style={{
                borderBottomWidth: i < virtualRowsItems.length - 1 ? 1 : 0,
                borderColor: t.colors.border,
              }}
            >
              <ActionRow
                title={item.title}
                subtitle={item.subtitle}
                prefix="list"
                onClick={() => {}}
              />
            </div>
          ))}
        </virtual-list>
      </BoxedList>
    </Labeled>
  );
}
virtualRows.parameters = { width: 528, height: 320 };
