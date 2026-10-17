import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  type ComboboxItemEntry,
} from "./Combobox";

const COMBO_ITEMS = ["low", "medium", "high"];

function Stage({
  height,
  children,
}: {
  height: number;
  children: ReactNode;
}) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={{
        position: "relative",
        width: 480,
        height,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function TriggerState({
  value,
  disabled,
  showClear,
}: {
  value?: string;
  disabled?: boolean;
  showClear?: boolean;
}) {
  return (
    <Combobox
      value={value}
      disabled={disabled}
      items={COMBO_ITEMS}
      onValueChange={() => {}}
      inputValue=""
      onInputValueChange={() => {}}
      style={{ width: 120, display: "flex", flexDirection: "column", gap: 8 }}
    >
      <Row gap={8} align="center">
        <ComboboxInput
          placeholder={showClear ? undefined : "Search…"}
          showClear={showClear}
          value={showClear ? value : undefined}
          onClear={showClear ? () => {} : undefined}
          disabled={disabled}
        />
        <ComboboxTrigger disabled={disabled} />
      </Row>
    </Combobox>
  );
}

function OpenCombobox({
  height,
  value,
  inputValue,
  items,
  children,
}: {
  height: number;
  value: string;
  inputValue: string;
  items?: readonly ComboboxItemEntry[];
  children: ReactNode;
}) {
  return (
    <Stage height={height}>
      <Row justify="center" align="start" style={{ height: "100%" }}>
        <Combobox
          open
          value={value}
          items={items ?? COMBO_ITEMS}
          onValueChange={() => {}}
          inputValue={inputValue}
          onInputValueChange={() => {}}
          style={{
            width: 320,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Row gap={8} align="center">
            <ComboboxInput placeholder="Search…" />
            <ComboboxTrigger />
          </Row>
          {children}
        </Combobox>
      </Row>
    </Stage>
  );
}

export default defineMeta({
  title: "Adwaita/Combobox",
  component: Combobox,
  parameters: { width: 528, height: 320 },
});

export const triggerStates = defineStory({
  parameters: { width: 528, height: 120 },
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="default value">
        <TriggerState value="medium" />
      </Labeled>
      <Labeled caption="empty (no value)">
        <TriggerState />
      </Labeled>
      <Labeled caption="disabled">
        <TriggerState value="medium" disabled />
      </Labeled>
      <Labeled caption="clear (showClear + value)">
        <TriggerState value="medium" showClear />
      </Labeled>
    </Row>
  ),
});

export const openItemStates = defineStory({
  parameters: { width: 528, height: 260 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="open · item states">
        <OpenCombobox height={200} value="medium" inputValue="">
          <ComboboxContent>
            <ComboboxGroup>
              <ComboboxLabel>Levels</ComboboxLabel>
              <ComboboxList>
                <ComboboxItem value="low">Low</ComboboxItem>
                <ComboboxItem value="medium" selected>
                  Medium
                </ComboboxItem>
                <ComboboxItem value="high">High</ComboboxItem>
              </ComboboxList>
            </ComboboxGroup>
            <ComboboxSeparator />
            <ComboboxGroup>
              <ComboboxLabel>Extra</ComboboxLabel>
              <ComboboxList>
                <ComboboxItem value="off" disabled>
                  Off (disabled)
                </ComboboxItem>
              </ComboboxList>
            </ComboboxGroup>
          </ComboboxContent>
        </OpenCombobox>
      </Labeled>
    </Column>
  ),
});

export const openWithIcons = defineStory({
  parameters: { width: 528, height: 260 },
  render: () => {
    const fonts = [
      { value: "sans", label: "Sans", icon: "type" as const },
      { value: "serif", label: "Serif", icon: "fileText" as const },
      { value: "mono", label: "Monospace", icon: "code" as const },
    ];
    return (
      <Column gap={16} align="center">
        <Labeled caption="open · icon options + selection">
          <OpenCombobox
            height={200}
            value="sans"
            inputValue=""
            items={fonts.map((f) => f.value)}
          >
            <ComboboxContent>
              <ComboboxGroup>
                <ComboboxLabel>Font</ComboboxLabel>
                <ComboboxList>
                  {fonts.map((f) => (
                    <ComboboxItem
                      key={f.value}
                      value={f.value}
                      icon={f.icon}
                      selected={f.value === "sans"}
                    >
                      {f.label}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxGroup>
            </ComboboxContent>
          </OpenCombobox>
        </Labeled>
      </Column>
    );
  },
});

const MANY_ITEMS = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`);

export const manyOptions = defineStory({
  parameters: { width: 528, height: 320 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="open · 40 options (virtual list)">
        <OpenCombobox
          height={280}
          value="Item 1"
          inputValue=""
          items={MANY_ITEMS}
        >
          <ComboboxContent>
            <virtual-list
              estimatedItemHeight={36}
              style={{ maxHeight: 200, width: "100%" }}
            >
              {MANY_ITEMS.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: 36,
                  }}
                >
                  <ComboboxItem value={item}>{item}</ComboboxItem>
                </div>
              ))}
            </virtual-list>
          </ComboboxContent>
        </OpenCombobox>
      </Labeled>
    </Column>
  ),
});

export const openEmpty = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="open · empty (no match)">
        <OpenCombobox height={140} value="" inputValue="zzz">
          <ComboboxContent>
            <ComboboxList>
              <ComboboxEmpty>No results for “zzz”</ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </OpenCombobox>
      </Labeled>
    </Column>
  ),
});

export const multiSelectChips = defineStory({
  parameters: { width: 528, height: 120 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="multi-select chips">
        <Combobox
          multiple
          onValueChange={() => {}}
          style={{
            width: 480,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <ComboboxChips
            values={["Low", "Medium"]}
            onRemove={() => {}}
            inputValue=""
            onInputChange={() => {}}
            placeholder="Add…"
          />
        </Combobox>
      </Labeled>
    </Column>
  ),
});
