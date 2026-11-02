import { type ReactNode } from "react";
import {
  type EventPayload,
  type PublicInstance,
  type StyleDesc,
} from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon, type IconName } from "../icons";
import { titleTruncate } from "../../lib/panel";

const LIST_STYLE = {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  minHeight: 0,
  width: "100%",
} as const;

export interface VirtualListPanelProps {
  listRef: { current: PublicInstance | null };
  estimatedItemHeight?: number;
  title?: string;
  children: ReactNode;

  itemCount?: number;
  windowStart?: number;
  overdraw?: number;
  onVisibleRange?: (event: EventPayload) => void;
  style?: Partial<StyleDesc>;

  bare?: boolean;
  framed?: boolean;
}

export function VirtualListPanel({
  listRef,
  estimatedItemHeight = 40,
  title,
  children,
  style,
  framed,
  itemCount,
  windowStart,
  overdraw,
  onVisibleRange,
  bare = false,
}: VirtualListPanelProps) {
  const t = useAdwaita();
  const chrome = framed ?? title != null;
  const shared = {
    ref: listRef,
    estimatedItemHeight,
    overdraw,
    onVisibleRange,
    style: LIST_STYLE,
  };
  const listProps =
    itemCount === undefined
      ? shared
      : { ...shared, itemCount, windowStart: windowStart ?? 0 };
  const list = <virtual-list {...listProps}>{children}</virtual-list>;
  if (bare) return list;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        overflow: "hidden",
        backgroundColor: t.color.surface.view,
        ...(chrome
          ? {
              borderRadius: t.radius.sm,
              borderWidth: 1,
              borderColor: t.color.border.default,
            }
          : {}),
        ...style,
      }}
    >
      {title ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: t.space.md,
            backgroundColor: t.color.surface.headerbar,
            borderBottomWidth: 1,
            borderColor: t.color.border.default,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <T
            size="title4"
            weight={700}
            color={t.color.text.primary}
            style={titleTruncate}
          >
            {title}
          </T>
        </div>
      ) : null}
      {list}
    </div>
  );
}

export interface VirtualListRowProps {
  label: string;
  icon?: IconName;
  subtitle?: string;
  trailing?: ReactNode;
  selected?: boolean;

  selectedStyle?: "inset" | "band";

  iconSize?: number;
  iconColor?: string;

  labelGrow?: number;

  dense?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}

const ROW_ELLIPSIS: Partial<StyleDesc> = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

function rowFrameStyle(t: AdwaitaTheme): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.control.listRowGap,
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    paddingLeft: t.space.md,
    paddingRight: t.space.md,
    borderBottomWidth: 1,
    borderColor: t.color.border.default,
  };
}

function rowDensityStyle(t: AdwaitaTheme, dense: boolean): Partial<StyleDesc> {
  const padY = dense ? t.space.xs : t.space.sm;
  return {
    paddingTop: padY,
    paddingBottom: padY,
    height: dense ? t.control.statusBarHeight : t.control.listRowHeight,
  };
}

function rowInsetStyle(t: AdwaitaTheme, inset: boolean): Partial<StyleDesc> {
  if (!inset) return { marginLeft: 0, marginRight: 0, borderRadius: 0 };
  return {
    marginLeft: t.control.listRowInsetX,
    marginRight: t.control.listRowInsetEnd,
    borderRadius: t.radius.sm,
  };
}

function rowSelectionFill(t: AdwaitaTheme, inset: boolean): string {
  return inset ? t.color.selection.faint : t.color.accent.tint;
}

function rowStateStyle(
  t: AdwaitaTheme,
  selected: boolean,
  disabled: boolean,
  fill: string,
): Partial<StyleDesc> {
  return {
    backgroundColor: selected ? fill : "transparent",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.5 : 1,
  };
}

function rowHoverStyle(
  t: AdwaitaTheme,
  selected: boolean,
  disabled: boolean,
): Partial<StyleDesc> {
  const enabled = !(selected || disabled);
  return {
    hover: enabled ? { backgroundColor: t.color.selection.faint } : undefined,
  };
}

function rowIconColor(
  t: AdwaitaTheme,
  selected: boolean,
  iconColor: string | undefined,
): string {
  if (iconColor !== undefined) return iconColor;
  return selected ? t.color.text.primary : t.color.text.dim;
}

function RowTextLabel({
  dense,
  label,
  subtitle,
  grow,
}: {
  dense: boolean;
  label: string;
  subtitle?: string;

  grow?: number;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: grow ?? 0,
        flexShrink: 1,
        minWidth: 0,
      }}
    >
      <T
        size={dense ? "body" : "list"}
        color={t.color.text.primary}
        style={ROW_ELLIPSIS}
      >
        {label}
      </T>
      {subtitle ? (
        <T size="caption" color={t.color.text.dim} style={ROW_ELLIPSIS}>
          {subtitle}
        </T>
      ) : null}
    </div>
  );
}

function RowTrailingSlot({
  children,
  contentSized,
}: {
  children: ReactNode;

  contentSized?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        ...(contentSized
          ? { flexGrow: 0, flexShrink: 0 }
          : { flexGrow: 1, flexShrink: 0, flexBasis: 0, minWidth: 0 }),
      }}
    >
      {children}
    </div>
  );
}

export function VirtualListRow({
  label,
  icon,
  subtitle,
  trailing,
  selected = false,
  selectedStyle = "inset",
  dense = false,
  iconSize,
  iconColor,
  labelGrow,
  disabled = false,
  onClick,
  style,
}: VirtualListRowProps) {
  const t = useAdwaita();
  const inset = selectedStyle === "inset";
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        ...rowFrameStyle(t),
        ...rowDensityStyle(t, dense),
        ...rowInsetStyle(t, inset),
        ...rowStateStyle(t, selected, disabled, rowSelectionFill(t, inset)),
        ...rowHoverStyle(t, selected, disabled),
        ...style,
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={iconSize ?? t.control.navIconSize}
          color={rowIconColor(t, selected, iconColor)}
        />
      ) : null}
      <RowTextLabel
        dense={dense}
        label={label}
        subtitle={subtitle}
        grow={labelGrow}
      />
      {trailing ? (
        <RowTrailingSlot contentSized={labelGrow !== undefined}>
          {trailing}
        </RowTrailingSlot>
      ) : null}
    </div>
  );
}
