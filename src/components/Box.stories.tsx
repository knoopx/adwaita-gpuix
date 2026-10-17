import { defineMeta } from "storybook";
import type { ReactNode } from "react";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row, Column } from "./Box";
import { Icon, type IconName } from "./icons";
import { Badge } from "./Badge";

function Swatch({ color, size = 24 }: { color: string; size?: number }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: t.radii.button,
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
      <Swatch color={t.colors.accent} />
      <Swatch color={t.colors.success} />
      <Swatch color={t.colors.warning} />
      <Swatch color={t.colors.destructive} />
    </Row>
  );
}

function ColumnDemo({ align }: { align: "start" | "center" }) {
  const t = useAdwaita();
  return (
    <Column gap={8} align={align}>
      <Swatch color={t.colors.accent} />
      <Swatch color={t.colors.success} />
      <Swatch color={t.colors.destructive} />
    </Column>
  );
}

function GrowDemo() {
  const t = useAdwaita();
  return (
    <Row gap={8} style={{ height: 80 }}>
      <Column grow={1} padding={8} gap={4} align="center">
        <Swatch color={t.colors.accent} />
        <Swatch color={t.colors.warning} />
      </Column>
      <Column grow={2} padding={8} gap={4} align="center">
        <Swatch color={t.colors.success} />
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
  icon: "info" | "success" | "warning" | "alert";
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
        borderRadius: t.radii.row,
        backgroundColor: bg,
      }}
    >
      <Icon name={icon} size={14} color={iconColor} />
      <T size="body" color={t.colors.fg}>
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
        borderRadius: t.radii.card,
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
          borderRadius: t.radii.card,
          borderWidth: 1,
          borderColor: t.colors.border,
          backgroundColor: bg,
        }}
      >
        <Icon name={icon} size={16} color={iconColor} />
        <T size="body" color={t.colors.fg}>
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
          <Swatch color={t.colors.accent} />
          <T size="body" color={t.colors.fg}>
            Tight
          </T>
        </Row>
      </Labeled>
      <Labeled caption="padding 8">
        <Row gap={8} padding={8} align="center">
          <Swatch color={t.colors.accent} />
          <T size="body" color={t.colors.fg}>
            Compact
          </T>
        </Row>
      </Labeled>
      <Labeled caption="padding 16">
        <Row gap={8} padding={16} align="center">
          <Swatch color={t.colors.accent} />
          <T size="body" color={t.colors.fg}>
            Relaxed
          </T>
        </Row>
      </Labeled>
      <Labeled caption="padding 24">
        <Row gap={8} padding={24} align="center">
          <Swatch color={t.colors.accent} />
          <T size="body" color={t.colors.fg}>
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
        <BorderedBox bg={t.colors.view_bg} borderColor={t.colors.border}>
          <T size="body" color={t.colors.fg}>
            A bordered container on the view surface.
          </T>
          <T size="caption" color={t.colors.dim_fg}>
            radius card, 1px border
          </T>
        </BorderedBox>
      </Labeled>
      <Labeled caption="bordered — button_bg surface">
        <BorderedBox bg={t.colors.button_bg} borderColor={t.colors.border}>
          <T size="body" color={t.colors.fg}>
            Raised fill with a neutral border.
          </T>
        </BorderedBox>
      </Labeled>
      <Labeled caption="accent border">
        <BorderedBox bg={t.colors.view_bg} borderColor={t.colors.accent}>
          <T size="body" color={t.colors.fg}>
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
          bg={t.colors.accentTint}
          icon="info"
          iconColor={t.colors.accent}
          label="Accent-tinted background"
        />
      </Labeled>
      <Labeled caption="tinted — success">
        <TintRow
          bg={t.colors.successTint}
          icon="success"
          iconColor={t.colors.success}
          label="Success-tinted background"
        />
      </Labeled>
      <Labeled caption="tinted — warning">
        <TintRow
          bg={t.colors.warningTint}
          icon="warning"
          iconColor={t.colors.warning}
          label="Warning-tinted background"
        />
      </Labeled>
      <Labeled caption="tinted — destructive">
        <TintRow
          bg={t.colors.destructiveTint}
          icon="alert"
          iconColor={t.colors.destructive}
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
        bg={t.colors.view_bg}
        icon="folder"
        iconColor={t.colors.accent}
        label="Documents"
        badgeVariant="secondary"
        badge="12"
      />
      <ContentRow
        caption="box with icon + text + badge"
        bg={t.colors.button_bg}
        icon="success"
        iconColor={t.colors.success}
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
    ["radius button", t.radii.button],
    ["radius row", t.radii.row],
    ["radius card", t.radii.card],
    ["radius pill", t.radii.pill],
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
              borderColor: t.colors.border,
              backgroundColor: t.colors.button_bg,
            }}
          >
            <Swatch color={t.colors.accent} size={16} />
            <T size="caption" color={t.colors.fg}>
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
        borderRadius: t.radii.row,
        backgroundColor: t.colors.button_bg,
      }}
    >
      <Swatch color={swatch} size={16} />
      <Column gap={4}>
        <T size="body" color={t.colors.fg}>
          {title}
        </T>
        <T size="caption" color={t.colors.dim_fg}>
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
          borderRadius: t.radii.card,
          borderWidth: 1,
          borderColor: t.colors.border,
          backgroundColor: t.colors.view_bg,
        }}
      >
        <NestedRow
          swatch={t.colors.accent}
          title="Outer row, inner column"
          sub="two levels deep"
        />
        <NestedRow
          swatch={t.colors.success}
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
    ["Home", "home", t.colors.accent],
    ["Files", "folder", t.colors.success],
    ["Search", "search", t.colors.warning],
    ["Settings", "settings", t.colors.accent],
    ["Clock", "clock", t.colors.success],
    ["Layers", "layers", t.colors.destructive],
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
                  borderRadius: t.radii.card,
                  borderWidth: 1,
                  borderColor: t.colors.border,
                  backgroundColor: t.colors.view_bg,
                }}
              >
                <Icon name={icon} size={16} color={color} />
                <T size="caption" color={t.colors.fg}>
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
            borderRadius: t.radii.row,
            borderWidth: 1,
            borderColor: t.colors.border,
            backgroundColor: t.colors.button_bg,
            opacity: 0.5,
          }}
        >
          <Swatch color={t.colors.accent} size={16} />
          <T size="body" color={t.colors.fg}>
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
            borderRadius: t.radii.row,
            backgroundColor: t.colors.button_bg,
          }}
        >
          <Swatch color={t.colors.dim_fg} size={16} />
          <T size="body" color={t.colors.dim_fg}>
            Secondary content
          </T>
        </Row>
      </Labeled>
      <Labeled caption="swatch palette (dim fg)">
        <Row gap={8} align="center">
          <Swatch color={t.colors.dim_fg} size={16} />
          <Swatch color={t.colors.border} size={16} />
          <Swatch color={t.colors.button_bg} size={16} />
        </Row>
      </Labeled>
    </Column>
  );
}
dim.parameters = { height: 320 };
