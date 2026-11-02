import { defineMeta } from "storybook";
import { type ReactNode } from "react";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./text";
import { Column, Row } from "./Box";
import { Icon, type IconName } from "./icons";
import { Badge } from "./Badge";

function Swatch({ color, size = 24 }: { color: string; size?: number }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: t.radius.sm,
        backgroundColor: color,
      }}
    />
  );
}

function SwatchRow({
  justify,
}: {
  justify?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly";
}) {
  const t = useAdwaita();
  return (
    <Row gap={8} justify={justify} align="center">
      <Swatch color={t.color.accent.base} />
      <Swatch color={t.color.functional.success} />
      <Swatch color={t.color.functional.warning} />
      <Swatch color={t.color.functional.destructive} />
    </Row>
  );
}

function ColumnDemo({ align }: { align: "start" | "center" }) {
  const t = useAdwaita();
  return (
    <Column gap={8} align={align}>
      <Swatch color={t.color.accent.base} />
      <Swatch color={t.color.functional.success} />
      <Swatch color={t.color.functional.destructive} />
    </Column>
  );
}

function GrowDemo() {
  const t = useAdwaita();
  return (
    <Row gap={8} style={{ height: 80 }}>
      <Column grow={1} padding={8} gap={4} align="center">
        <Swatch color={t.color.accent.base} />
        <Swatch color={t.color.functional.warning} />
      </Column>
      <Column grow={2} padding={8} gap={4} align="center">
        <Swatch color={t.color.functional.success} />
      </Column>
    </Row>
  );
}

function TintRow({
  bg,
  icon,
  iconColor,
  label,
}: {
  bg: string;
  icon: "info" | "checkCircle" | "warning" | "error";
  iconColor: string;
  label: string;
}) {
  const t = useAdwaita();
  return (
    <Row
      gap={8}
      padding={12}
      align="center"
      style={{
        borderRadius: t.radius.sm,
        backgroundColor: bg,
      }}
    >
      <Icon name={icon} size={14} color={iconColor} />
      <T size="body" color={t.color.text.primary}>
        {label}
      </T>
    </Row>
  );
}

function BorderedBox({
  bg,
  borderColor,
  children,
}: {
  bg: string;
  borderColor: string;
  children: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <Column
      gap={8}
      padding={16}
      style={{
        borderRadius: t.radius.sm,
        borderWidth: 1,
        borderColor,
        backgroundColor: bg,
      }}
    >
      {children}
    </Column>
  );
}

function ContentRow({
  caption,
  bg,
  icon,
  iconColor,
  label,
  badgeVariant,
  badge,
}: {
  caption: string;
  bg: string;
  icon: IconName;
  iconColor: string;
  label: string;
  badgeVariant: "secondary" | "success";
  badge: string;
}) {
  const t = useAdwaita();
  return (
    <Labeled caption={caption}>
      <Row
        gap={12}
        padding={16}
        align="center"
        style={{
          borderRadius: t.radius.sm,
          borderWidth: 1,
          borderColor: t.color.border.default,
          backgroundColor: bg,
        }}
      >
        <Icon name={icon} size={16} color={iconColor} />
        <T size="body" color={t.color.text.primary}>
          {label}
        </T>
        <div style={{ flexGrow: 1 }} />
        <Badge variant={badgeVariant}>{badge}</Badge>
      </Row>
    </Labeled>
  );
}

export default defineMeta({
  title: "Adwaita/Box",
  component: Row,
  parameters: { width: 528, height: 440 },
});

export function layout() {
  return (
    <Column gap={16}>
      <Labeled caption="Row — gap 8, align center">
        <SwatchRow />
      </Labeled>
      <Labeled caption="Row — justify start">
        <SwatchRow justify="start" />
      </Labeled>
      <Labeled caption="Row — justify center">
        <SwatchRow justify="center" />
      </Labeled>
      <Labeled caption="Row — justify end">
        <SwatchRow justify="end" />
      </Labeled>
      <Labeled caption="Row — justify space-between">
        <SwatchRow justify="space-between" />
      </Labeled>
      <Labeled caption="Column — gap 8, align center">
        <ColumnDemo align="center" />
      </Labeled>
      <Labeled caption="Column — align start">
        <ColumnDemo align="start" />
      </Labeled>
      <Labeled caption="grow + padding">
        <GrowDemo />
      </Labeled>
    </Column>
  );
}
layout.parameters = { height: 640 };

export function padding() {
  const t = useAdwaita();
  return (
    <Column gap={16}>
      <Labeled caption="plain — padding 0">
        <Row gap={8} align="center">
          <Swatch color={t.color.accent.base} />
          <T size="body" color={t.color.text.primary}>
            Tight
          </T>
        </Row>
      </Labeled>
      <Labeled caption="padding 8">
        <Row gap={8} padding={8} align="center">
          <Swatch color={t.color.accent.base} />
          <T size="body" color={t.color.text.primary}>
            Compact
          </T>
        </Row>
      </Labeled>
      <Labeled caption="padding 16">
        <Row gap={8} padding={16} align="center">
          <Swatch color={t.color.accent.base} />
          <T size="body" color={t.color.text.primary}>
            Relaxed
          </T>
        </Row>
      </Labeled>
      <Labeled caption="padding 24">
        <Row gap={8} padding={24} align="center">
          <Swatch color={t.color.accent.base} />
          <T size="body" color={t.color.text.primary}>
            Roomy
          </T>
        </Row>
      </Labeled>
    </Column>
  );
}
padding.parameters = { height: 360 };

export function bordered() {
  const t = useAdwaita();
  return (
    <Column gap={16}>
      <Labeled caption="bordered — view_bg surface">
        <BorderedBox
          bg={t.color.surface.view}
          borderColor={t.color.border.default}
        >
          <T size="body" color={t.color.text.primary}>
            A bordered container on the view surface.
          </T>
          <T size="caption" color={t.color.text.dim}>
            radius card, 1px border
          </T>
        </BorderedBox>
      </Labeled>
      <Labeled caption="bordered — button_bg surface">
        <BorderedBox
          bg={t.color.surface.button}
          borderColor={t.color.border.default}
        >
          <T size="body" color={t.color.text.primary}>
            Raised fill with a neutral border.
          </T>
        </BorderedBox>
      </Labeled>
      <Labeled caption="accent border">
        <BorderedBox
          bg={t.color.surface.view}
          borderColor={t.color.accent.base}
        >
          <T size="body" color={t.color.text.primary}>
            Focus / highlighted edge.
          </T>
        </BorderedBox>
      </Labeled>
    </Column>
  );
}
bordered.parameters = { height: 360 };

export function tints() {
  const t = useAdwaita();
  return (
    <Column gap={16}>
      <Labeled caption="tinted — accent">
        <TintRow
          bg={t.color.accent.tint}
          icon="info"
          iconColor={t.color.accent.base}
          label="Accent-tinted background"
        />
      </Labeled>
      <Labeled caption="tinted — success">
        <TintRow
          bg={t.color.functional.successTint}
          icon="checkCircle"
          iconColor={t.color.functional.success}
          label="Success-tinted background"
        />
      </Labeled>
      <Labeled caption="tinted — warning">
        <TintRow
          bg={t.color.functional.warningTint}
          icon="warning"
          iconColor={t.color.functional.warning}
          label="Warning-tinted background"
        />
      </Labeled>
      <Labeled caption="tinted — destructive">
        <TintRow
          bg={t.color.functional.destructiveTint}
          icon="error"
          iconColor={t.color.functional.destructive}
          label="Destructive-tinted background"
        />
      </Labeled>
    </Column>
  );
}
tints.parameters = { height: 360 };

export function withContent() {
  const t = useAdwaita();
  return (
    <Column gap={16}>
      <ContentRow
        caption="box with icon + text + trailing component"
        bg={t.color.surface.view}
        icon="folder"
        iconColor={t.color.accent.base}
        label="Documents"
        badgeVariant="secondary"
        badge="12"
      />
      <ContentRow
        caption="box with icon + text + badge"
        bg={t.color.surface.button}
        icon="checkCircle"
        iconColor={t.color.functional.success}
        label="Sync complete"
        badgeVariant="success"
        badge="OK"
      />
    </Column>
  );
}
withContent.parameters = { height: 260 };

export function radii() {
  const t = useAdwaita();
  const cells: Array<[string, number]> = [
    ["radius button", t.radius.sm],
    ["radius row", t.radius.sm],
    ["radius card", t.radius.sm],
    ["radius pill", t.radius.full],
  ];
  return (
    <Column gap={16}>
      {cells.map(([caption, radius]) => (
        <Labeled key={caption} caption={caption}>
          <Row
            gap={8}
            padding={8}
            align="center"
            style={{
              borderRadius: radius,
              borderWidth: 1,
              borderColor: t.color.border.default,
              backgroundColor: t.color.surface.button,
            }}
          >
            <Swatch color={t.color.accent.base} size={16} />
            <T size="caption" color={t.color.text.primary}>
              {caption}
            </T>
          </Row>
        </Labeled>
      ))}
    </Column>
  );
}
radii.parameters = { height: 340 };

function NestedRow({
  swatch,
  title,
  sub,
}: {
  swatch: string;
  title: string;
  sub: string;
}) {
  const t = useAdwaita();
  return (
    <Row
      gap={8}
      padding={8}
      align="center"
      style={{
        borderRadius: t.radius.sm,
        backgroundColor: t.color.surface.button,
      }}
    >
      <Swatch color={swatch} size={16} />
      <Column gap={4}>
        <T size="body" color={t.color.text.primary}>
          {title}
        </T>
        <T size="caption" color={t.color.text.dim}>
          {sub}
        </T>
      </Column>
    </Row>
  );
}

export function nested() {
  const t = useAdwaita();
  return (
    <Labeled caption="nested — column of rows, each with a column">
      <Column
        gap={8}
        padding={16}
        style={{
          borderRadius: t.radius.sm,
          borderWidth: 1,
          borderColor: t.color.border.default,
          backgroundColor: t.color.surface.view,
        }}
      >
        <NestedRow
          swatch={t.color.accent.base}
          title="Outer row, inner column"
          sub="two levels deep"
        />
        <NestedRow
          swatch={t.color.functional.success}
          title="Second row"
          sub="same nesting"
        />
      </Column>
    </Labeled>
  );
}
nested.parameters = { height: 300 };

export function grid() {
  const t = useAdwaita();
  const items: Array<[string, IconName, string]> = [
    ["Home", "home", t.color.accent.base],
    ["Files", "folder", t.color.functional.success],
    ["Search", "search", t.color.functional.warning],
    ["Settings", "settings", t.color.accent.base],
    ["Clock", "clock", t.color.functional.success],
    ["Layers", "layers", t.color.functional.destructive],
  ];
  return (
    <Labeled caption="grid — rows of columns (3 × 2)">
      <Column gap={8}>
        {[0, 2].map((start) => (
          <Row key={start} gap={8}>
            {items.slice(start, start + 3).map(([label, icon, color]) => (
              <Column
                key={label}
                grow={1}
                gap={8}
                padding={12}
                align="center"
                style={{
                  borderRadius: t.radius.sm,
                  borderWidth: 1,
                  borderColor: t.color.border.default,
                  backgroundColor: t.color.surface.view,
                }}
              >
                <Icon name={icon} size={16} color={color} />
                <T size="caption" color={t.color.text.primary}>
                  {label}
                </T>
              </Column>
            ))}
          </Row>
        ))}
      </Column>
    </Labeled>
  );
}
grid.parameters = { height: 280 };

export function dim() {
  const t = useAdwaita();
  return (
    <Column gap={16}>
      <Labeled caption="dimmed — opacity 0.5">
        <Row
          gap={8}
          padding={12}
          align="center"
          style={{
            borderRadius: t.radius.sm,
            borderWidth: 1,
            borderColor: t.color.border.default,
            backgroundColor: t.color.surface.button,
            opacity: 0.5,
          }}
        >
          <Swatch color={t.color.accent.base} size={16} />
          <T size="body" color={t.color.text.primary}>
            Disabled row
          </T>
        </Row>
      </Labeled>
      <Labeled caption="dimmed text">
        <Row
          gap={8}
          padding={12}
          align="center"
          style={{
            borderRadius: t.radius.sm,
            backgroundColor: t.color.surface.button,
          }}
        >
          <Swatch color={t.color.text.dim} size={16} />
          <T size="body" color={t.color.text.dim}>
            Secondary content
          </T>
        </Row>
      </Labeled>
      <Labeled caption="swatch palette (dim fg)">
        <Row gap={8} align="center">
          <Swatch color={t.color.text.dim} size={16} />
          <Swatch color={t.color.border.default} size={16} />
          <Swatch color={t.color.surface.button} size={16} />
        </Row>
      </Labeled>
    </Column>
  );
}
dim.parameters = { height: 320 };
