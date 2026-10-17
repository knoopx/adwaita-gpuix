import { type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon, type IconName } from "../../components/icons";
import {
  Collapsible,
  useControllableOpen,
} from "../../components/Collapsible";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";
import { Glyph } from "./Glyph";

export interface SourcesProps {
  count?: number;
  title?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Sources({
  count,
  title,
  open,
  defaultOpen,
  onOpenChange,
  children,
  style,
}: SourcesProps) {
  const t = useAdwaita();
  const { colors } = t;
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  const heading = title ?? "Sources";
  return (
    <Collapsible open={isOpen} onOpenChange={setOpen} style={style}>
      <CollapsibleTriggerRow
        icon={<Glyph name="globe" size={14} color={colors.dim_fg} />}
        title={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              minWidth: 0,
              flexShrink: 1,
            }}
          >
            <T
              size="body"
              color={colors.fg}
              style={{ flexShrink: 1, textOverflow: "ellipsis" }}
            >
              {heading}
            </T>
            {count !== undefined ? (
              <T size="caption" color={colors.dim_fg}>
                {count}
              </T>
            ) : null}
          </div>
        }
        open={isOpen}
        onToggle={() => setOpen(!isOpen)}
        spacer
      />
      {children}
    </Collapsible>
  );
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export interface SourceProps {
  title: ReactNode;
  url: string;
  icon?: IconName;
  onClick?: () => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Source({ title, url, icon, onClick, children, style }: SourceProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  if (children) {
    return <div style={{ minWidth: 0, ...style }}>{children}</div>;
  }
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
        padding: 4,
        borderRadius: radii.row,
        cursor: "pointer",
        hover: { backgroundColor: colors.button_hover },
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 24,
          height: 24,
          borderRadius: radii.button,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.button_bg,
          flexShrink: 0,
          pointerEvents: "none",
        }}
      >
        <Icon name={icon ?? "link"} size={14} color={colors.fg} />
      </div>
      <T
        size="body"
        color={colors.fg}
        style={{ flexShrink: 1, textOverflow: "ellipsis" }}
      >
        {title}
      </T>
      <T size="caption" color={colors.dim_fg} style={{ flexShrink: 0 }}>
        {hostnameOf(url)}
      </T>
      <Icon name="arrowRight" size={12} color={colors.dim_fg} />
    </div>
  );
}
