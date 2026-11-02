import { type ComponentType, type ReactNode } from "react";
import { useAdwaita } from "../src/theme/adwaita";
import { type StyleDesc } from "@gpuix/react";
import { Labeled, T } from "../src/components/text";
import { Column, Row } from "../src/components/Box";
import { Entry } from "../src/components/Entry";
import { Icon } from "../src/components/icons";
import { ACCENTS } from "../src/theme/tokens";

export function Stage({
  width,
  height,
  radius = "card",
  center = false,
  children,
}: {
  width: number;
  height: number;
  radius?: "card" | 8;
  center?: boolean;
  children: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        ...(center
          ? { display: "flex", alignItems: "center", justifyContent: "center" }
          : {}),
        borderRadius: radius === "card" ? t.radius.sm : radius,
        borderWidth: 1,
        borderColor: t.color.border.default,
        backgroundColor: t.color.surface.view,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

export function LabeledStage({
  caption,
  width,
  height,
  radius = "card",
  center = false,
  children,
}: {
  caption: string;
  width: number;
  height: number;
  radius?: "card" | 8;
  center?: boolean;
  children: ReactNode;
}) {
  return (
    <Column gap={16} align="center">
      <Labeled caption={caption}>
        <Stage width={width} height={height} radius={radius} center={center}>
          {children}
        </Stage>
      </Labeled>
    </Column>
  );
}

export function SettingGroup({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <Column
      gap={8}
      padding={12}
      style={{
        borderRadius: t.radius.sm,
        borderWidth: 1,
        borderColor: t.color.border.default,
      }}
    >
      <T size="caption" color={t.color.text.dim}>
        {caption}
      </T>
      {children}
    </Column>
  );
}

export function PaddedColumn({ children }: { children: ReactNode }) {
  return (
    <Column gap={8} padding={16} style={{ width: "100%", minWidth: 0 }}>
      {children}
    </Column>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 16,
        backgroundColor: t.color.surface.view,
      }}
    >
      {children}
    </div>
  );
}

export function FullWidth({ children }: { children: ReactNode }) {
  return (
    <Column gap={16} align="center" style={{ width: "100%" }}>
      {children}
    </Column>
  );
}
export function FullWidthLabeled({
  caption,
  children,
}: {
  caption: string;
  children?: ReactNode;
}) {
  return (
    <Labeled caption={caption} style={{ width: "100%" }}>
      {children}
    </Labeled>
  );
}

const SIDE_TEXTS = [
  "Above the trigger",
  "Right of the trigger",
  "Below the trigger",
  "Left of the trigger",
] as const;

const SIDE_STAGE = { width: 480, height: 120 };

export function SidesShowcase({
  caption,
  Side,
  texts = SIDE_TEXTS,
  stage = SIDE_STAGE,
  rowGap = 16,
  centerRow = true,
}: {
  caption?: string;
  Side: ComponentType<{
    side: "top" | "right" | "bottom" | "left";
    text: string;
  }>;
  texts?: readonly [string, string, string, string];
  stage?: { width: number; height: number } | null;
  rowGap?: number;
  centerRow?: boolean;
}) {
  const sides = ["top", "right", "bottom", "left"] as const;
  const row = (
    <Row gap={rowGap} align="center" justify={centerRow ? "center" : undefined}>
      {sides.map((side, i) => (
        <Labeled key={side} caption={`side=${side}`}>
          <Side side={side} text={texts[i]} />
        </Labeled>
      ))}
    </Row>
  );
  return (
    <Column gap={16} align="center">
      {caption ? (
        <Labeled caption={caption}>
          {stage ? (
            <Stage width={stage.width} height={stage.height} center>
              {row}
            </Stage>
          ) : (
            row
          )}
        </Labeled>
      ) : (
        row
      )}
    </Column>
  );
}

export const noop = () => {};
export function PanelStage({
  height = 220,
  children,
}: {
  height?: number;
  children: ReactNode;
}) {
  const t = useAdwaita();
  const stageStyle: Partial<StyleDesc> = {
    position: "relative",
    width: 360,
    height,
    borderRadius: t.radius.sm,
    borderWidth: 0,
    backgroundColor: t.color.surface.view,
    overflow: "hidden",
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={stageStyle}>{children}</div>
    </div>
  );
}
export function PanelBody({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  return (
    <Column gap={t.space.sm} padding={t.space.lg}>
      {children}
    </Column>
  );
}

export function PanelFormBody() {
  const t = useAdwaita();
  return (
    <PanelBody>
      <T size="caption" color={t.color.text.dim}>
        Name
      </T>
      <Entry placeholder="Item name" />
      <T size="caption" color={t.color.text.dim}>
        Email
      </T>
      <Entry placeholder="name@example.com" type="email" />
    </PanelBody>
  );
}
export const PANEL_LIST_ITEMS = Array.from({ length: 40 }, (_, i) => ({
  title: `Item ${i + 1}`,
  subtitle: `Description for item ${i + 1}`,
}));
export function PanelList({
  items = PANEL_LIST_ITEMS,
}: {
  items?: { title: string; subtitle: string }[];
}) {
  const t = useAdwaita();
  return (
    <Column
      grow={1}
      padding={t.space.lg}
      style={{ minHeight: 0, paddingTop: 0 }}
    >
      <virtual-list
        estimatedItemHeight={48}
        style={{ flexGrow: 1, minHeight: 0 }}
      >
        {items.map((item, i) => (
          <div
            key={item.title}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: t.space.md,
              borderBottomWidth: i < items.length - 1 ? 1 : 0,
              borderColor: t.color.border.default,
            }}
          >
            <T>{item.title}</T>
            <T size="caption" color={t.color.text.dim}>
              {item.subtitle}
            </T>
          </div>
        ))}
      </virtual-list>
    </Column>
  );
}

export interface PanelStoryPart {
  side: "top" | "right" | "bottom" | "left";
  title: string;
  height?: number;
  children?: ReactNode;
}

export function bottomPanelStory(
  Panel: ComponentType<PanelStoryPart>,
  {
    caption,
    title,
    height = 200,
    body,
  }: { caption: string; title: string; height?: number; body?: ReactNode },
) {
  return (
    <Labeled caption={caption}>
      <Panel side="bottom" title={title} height={height}>
        {body}
      </Panel>
    </Labeled>
  );
}

export const FIELD_CELL_WIDTH = 240;
export type FieldStoryType =
  "text" | "password" | "email" | "number" | "search" | "url";
export interface FieldStoryProps {
  placeholder?: string;
  value?: string;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  type?: FieldStoryType;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export function FieldIcon({ name }: { name: "search" | "user" | "eye" }) {
  const t = useAdwaita();
  return <Icon name={name} size={16} color={t.color.text.dim} />;
}
export function fieldStatesStory<Field extends ComponentType<FieldStoryProps>>(
  Field: Field,
) {
  return (
    <Column gap={16} align="center">
      <Labeled caption="placeholder" style={{ width: FIELD_CELL_WIDTH }}>
        <Field placeholder="Type here…" />
      </Labeled>
      <Labeled caption="with value" style={{ width: FIELD_CELL_WIDTH }}>
        <Field value="Hello world" />
      </Labeled>
      <Labeled caption="invalid" style={{ width: FIELD_CELL_WIDTH }}>
        <Field value="invalid value" invalid />
      </Labeled>
      <Labeled caption="disabled" style={{ width: FIELD_CELL_WIDTH }}>
        <Field value="Read only" disabled />
      </Labeled>
    </Column>
  );
}
export function fieldFocusedStory<Field extends ComponentType<FieldStoryProps>>(
  Field: Field,
  placeholder: string,
) {
  return (
    <Column gap={16} align="center">
      <Labeled
        caption="focused (autoFocus)"
        style={{ width: FIELD_CELL_WIDTH }}
      >
        <Field autoFocus placeholder={placeholder} />
      </Labeled>
    </Column>
  );
}
export function fieldTypesStory<Field extends ComponentType<FieldStoryProps>>(
  Field: Field,
) {
  return (
    <Column gap={16} align="center">
      <Labeled caption="text" style={{ width: FIELD_CELL_WIDTH }}>
        <Field type="text" placeholder="Plain text" />
      </Labeled>
      <Labeled caption="password" style={{ width: FIELD_CELL_WIDTH }}>
        <Field type="password" value="hunter2" />
      </Labeled>
      <Labeled caption="password (empty)" style={{ width: FIELD_CELL_WIDTH }}>
        <Field type="password" placeholder="Password" />
      </Labeled>
      <Labeled caption="email" style={{ width: FIELD_CELL_WIDTH }}>
        <Field type="email" placeholder="you@example.com" />
      </Labeled>
      <Labeled caption="number" style={{ width: FIELD_CELL_WIDTH }}>
        <Field type="number" placeholder="42" />
      </Labeled>
      <Labeled caption="search" style={{ width: FIELD_CELL_WIDTH }}>
        <Field type="search" placeholder="Search…" />
      </Labeled>
      <Labeled caption="url" style={{ width: FIELD_CELL_WIDTH }}>
        <Field type="url" placeholder="https://…" />
      </Labeled>
    </Column>
  );
}
export function fieldIconsStory<Field extends ComponentType<FieldStoryProps>>(
  Field: Field,
) {
  return (
    <Column gap={16} align="center">
      <Labeled
        caption="search (leading icon)"
        style={{ width: FIELD_CELL_WIDTH }}
      >
        <Field
          type="search"
          leading={<FieldIcon name="search" />}
          placeholder="Search…"
        />
      </Labeled>
      <Labeled
        caption="email (leading icon)"
        style={{ width: FIELD_CELL_WIDTH }}
      >
        <Field
          type="email"
          leading={<FieldIcon name="user" />}
          placeholder="you@example.com"
        />
      </Labeled>
      <Labeled
        caption="password (trailing icon)"
        style={{ width: FIELD_CELL_WIDTH }}
      >
        <Field
          type="password"
          value="hunter2"
          trailing={<FieldIcon name="eye" />}
        />
      </Labeled>
    </Column>
  );
}

export const SELECT_LEVELS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
export const SELECT_SIZES = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "3xl", label: "3XL" },
  { value: "4xl", label: "4XL" },
  { value: "5xl", label: "5XL" },
  { value: "6xl", label: "6XL" },
  { value: "7xl", label: "7XL" },
  { value: "8xl", label: "8XL" },
  { value: "9xl", label: "9XL" },
];

export const TALLY_COUNTERS: { name: string; count: number }[] = [
  { name: "Chickadees", count: 5 },
  { name: "Cardinals", count: 2 },
  { name: "Blue Jays", count: 1 },
  { name: "Chipmunks", count: 9 },
  { name: "Finches", count: 4 },
  { name: "Crows", count: 3 },
  { name: "Grackles", count: 2 },
];

export const TALLY_INKS: (string | null)[] = [
  null,
  ACCENTS.red,
  ACCENTS.blue,
  ACCENTS.orange,
  ACCENTS.yellow,
  ACCENTS.purple,
  ACCENTS.green,
];

export const HP_MP_ROWS: string[][] = [
  ["name", "hp", "mp"],
  ["orc", "12", "0"],
  ["elf", "8", "4"],
];
