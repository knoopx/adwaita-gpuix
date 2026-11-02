import { type ReactElement, type ReactNode } from "react";
import { T } from "../components/text";
import { Icon, type IconName } from "../components/icons";
import { Spinner } from "../components/Spinner";
import { Frame } from "../components/Card";
import {
  headerStripBg,
  rowHoverBg,
  selectionBg,
  useAdwaita,
} from "../theme/adwaita";

export const titleTruncate: Record<string, unknown> = {
  minWidth: 0,
  flexShrink: 1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export interface PanelProps {
  title: ReactNode;
  focused?: boolean;
  trailing?: ReactNode;
  headerless?: boolean;

  headerRadiusStart?: number;
  headerRadiusEnd?: number;

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
  headerRadiusStart,
  headerRadiusEnd,
  children,
  style = {},
}: PanelProps) {
  const t = useAdwaita();
  return (
    <Frame
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        borderRadius: t.radius.lg,
        borderWidth: bordered ? 1 : 0,
        borderColor: focused ? t.color.accent.base : t.color.border.default,
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
            borderColor: t.color.border.default,
            backgroundColor: headerStripBg(t),
            borderTopLeftRadius: headerRadiusStart,
            borderTopRightRadius: headerRadiusEnd,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              flexShrink: 1,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {typeof title === "string" ? (
              <T
                size="title4"
                weight={600}
                color={focused ? t.color.accent.base : t.color.text.primary}
                style={titleTruncate}
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
        color={color ?? t.color.text.primary}
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
  const fg = dimmed ? t.color.text.dim : t.color.text.primary;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 22,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: t.radius.full,
        backgroundColor: t.color.surface.button,
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
          {renderPill ? (
            renderPill(n, dimmed)
          ) : (
            <DefaultPill name={n} dimmed={dimmed} />
          )}
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
  if (!text) return null;
  return (
    <T
      size="caption"
      color={t.color.text.dim}
      style={{
        fontFamily: t.type.fontFamilyMono,
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
  const t = useAdwaita();
  if (!description)
    return (
      <T
        size="title4"
        weight={600}
        color={focused ? t.color.accent.base : t.color.text.primary}
        style={titleTruncate}
      >
        Files
      </T>
    );
  const noDesc = description === "" || description === "(no description)";
  if (noDesc)
    return (
      <T size="title4" color={t.color.text.dim} style={titleTruncate}>
        (no description)
      </T>
    );
  return (
    <T
      size="title4"
      weight={600}
      color={focused ? t.color.accent.base : t.color.text.primary}
      style={titleTruncate}
    >
      {description}
    </T>
  );
}
