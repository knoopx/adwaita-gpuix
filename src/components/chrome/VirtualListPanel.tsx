import type { ReactNode } from "react";
import type { PublicInstance, StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T, FieldSlot } from "../common";
import { Icon, type IconName } from "../icons";

export interface VirtualListPanelProps {
  listRef: { current: PublicInstance | null };
  estimatedItemHeight?: number;
  title?: string;
  children: ReactNode;
  style?: Partial<StyleDesc>;
  // Draw own border / corners / background. Defaults to true with a title
  // (standalone widget), false otherwise: inside a Panel the Panel already
  // owns the chrome, so framing here nests a pane in a pane.
  framed?: boolean;
}

export function VirtualListPanel({
  listRef,
  estimatedItemHeight = 40,
  title,
  children,
  style,
  framed,
}: VirtualListPanelProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const chrome = framed ?? title != null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        overflow: "hidden",
        ...(chrome
          ? {
              borderRadius: radii.card,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.view_bg,
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
            padding: spacing.paddingTight,
            backgroundColor: colors.headerbar_bg,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <T size="title4" weight={700} color={colors.fg}>
            {title}
          </T>
        </div>
      ) : null}
      <virtual-list
        ref={listRef}
        estimatedItemHeight={estimatedItemHeight}
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 0,
          width: "100%",
        }}
      >
        {children}
      </virtual-list>
    </div>
  );
}

export interface VirtualListRowProps {
  label: string;
  icon?: IconName;
  subtitle?: string;
  trailing?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}

const ROW_ELLIPSIS: Partial<StyleDesc> = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

export function VirtualListRow({
  label,
  icon,
  subtitle,
  trailing,
  selected = false,
  disabled = false,
  onClick,
  style,
}: VirtualListRowProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.gap,
        padding: spacing.paddingTight,
        minHeight: spacing.rowHeight,
        borderBottomWidth: 1,
        borderColor: colors.border,
        backgroundColor: selected ? colors.accentTint : "transparent",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        hover:
          selected || disabled
            ? undefined
            : { backgroundColor: colors.accentTint },
        ...style,
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={16}
          color={selected ? colors.fg : colors.dim_fg}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <T size="body" color={colors.fg} style={ROW_ELLIPSIS}>
          {label}
        </T>
        {subtitle ? (
          <T size="caption" color={colors.dim_fg} style={ROW_ELLIPSIS}>
            {subtitle}
          </T>
        ) : null}
      </div>
      {trailing ? <FieldSlot>{trailing}</FieldSlot> : null}
    </div>
  );
}


export { VirtualListPanel as ListPanel };
