import type { ReactElement, ReactNode } from "react";
import { Frame } from "../components/Card";
import { T } from "../components/common";
import { Icon, type IconName } from "../components/icons";
import { Spinner } from "../components/Spinner";
import {
  rowHoverBg,
  selectionBg,
  useAdwaita,
} from "../theme/adwaita";

export interface PanelProps {
  title: ReactNode;
  focused?: boolean;
  trailing?: ReactNode;
  headerless?: boolean;
  
  bordered?: boolean;
  children: ReactNode;
  style?: Record<string, unknown>;
}

export function Panel({
  title,
  focused = false,
  trailing,
  headerless = false,
  bordered = true,
  children,
  style = {},
}: PanelProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <Frame
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        borderRadius: radii.card,
        borderWidth: bordered ? 1 : 0,
        borderColor: focused ? colors.accent : colors.border,
        ...(bordered ? {} : { borderRadius: 0 }),
        ...style,
      }}
    >
      {!headerless && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.headerbar_bg,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            {typeof title === "string" ? (
              <T
                size="title4"
                weight={600}
                color={focused ? colors.accent : colors.fg}
                style={{ minWidth: 0, whiteSpace: "nowrap" }}
              >
                {title}
              </T>
            ) : (
              title
            )}
          </div>
          {trailing}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 0,
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </Frame>
  );
}

export function ListRow({
  selected = false,
  current = false,
  
  focused = true,
  onClick,
  children,
  height = 24,
  style = {},
}: {
  selected?: boolean;
  current?: boolean;
  
  focused?: boolean;
  onClick?: () => void;
  children: ReactNode;
  height?: number;
  style?: Record<string, unknown>;
}) {
  const t = useAdwaita();
  const sel = selectionBg(t, focused);
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: selected ? sel : "transparent",
        cursor: "pointer",
        hover: { backgroundColor: selected ? sel : rowHoverBg(t) },
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Line({
  children,
  color,
  bold = false,
  indent = 0,
}: {
  children: ReactNode;
  color?: string;
  bold?: boolean;
  indent?: number;
}) {
  const t = useAdwaita();
  return (
    <div style={{ display: "flex", paddingLeft: indent, height: 18 }}>
      <T
        size="body"
        weight={bold ? 600 : 400}
        color={color ?? t.colors.fg}
        style={{ whiteSpace: "nowrap" }}
      >
        {children}
      </T>
    </div>
  );
}

export function RowShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        minWidth: 0,
        flexGrow: 1,
      }}
    >
      {children}
    </div>
  );
}

function DefaultPill({ name, dimmed }: { name: string; dimmed?: boolean }) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const fg = dimmed ? colors.dim_fg : colors.fg;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 22,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        flexShrink: 1,
        minWidth: 0,
      }}
    >
      <T
        size="caption"
        color={fg}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0,
        }}
      >
        {name}
      </T>
    </div>
  );
}

export function PillGroup({
  names,
  dimmed = false,
  renderPill,
}: {
  names: string[];
  dimmed?: boolean;
  renderPill?: (name: string, dimmed?: boolean) => ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 4,
        minWidth: 0,
        flexShrink: 1,
        overflow: "hidden",
      }}
    >
      {names.map((n) => (
        <div key={n} style={{ display: "flex", minWidth: 0, flexShrink: 1 }}>
          {renderPill ? renderPill(n, dimmed) : <DefaultPill name={n} dimmed={dimmed} />}
        </div>
      ))}
    </div>
  );
}

export function RowIcon({
  name,
  color,
  size = 14,
}: {
  name: IconName;
  color: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: 14,
        flexShrink: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Icon name={name} size={size} color={color} />
    </div>
  );
}

export function MonoBadge({ text }: { text: string | null }) {
  const t = useAdwaita();
  const { colors } = t;
  if (!text) return null;
  return (
    <T
      size="caption"
      color={colors.dim_fg}
      style={{
        fontFamily: t.typography.fontFamilyMono,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </T>
  );
}

export function PanelTrailing({
  loading,
  badge,
}: {
  loading: boolean;
  badge: ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {loading && <Spinner size={16} />}
      {badge}
    </div>
  );
}

export function FileListTitle({
  description,
  focused,
}: {
  description: string | null | undefined;
  focused: boolean;
}): ReactElement {
  const { colors } = useAdwaita();
  if (!description)
    return (
      <T
        size="title4"
        weight={600}
        color={focused ? colors.accent : colors.fg}
        style={{ minWidth: 0, whiteSpace: "nowrap" }}
      >
        Files
      </T>
    );
  const noDesc = description === "" || description === "(no description)";
  if (noDesc)
    return (
      <T
        size="title4"
        color={colors.dim_fg}
        style={{ whiteSpace: "nowrap" }}
      >
        (no description)
      </T>
    );
  return (
    <T
      size="title4"
      weight={600}
      color={focused ? colors.accent : colors.fg}
      style={{ whiteSpace: "nowrap" }}
    >
      {description}
    </T>
  );
}
