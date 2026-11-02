import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon, type IconName } from "../../components/icons";
import { Collapsible, useControllableOpen } from "../../components/Collapsible";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";
import { DisclosureRow } from "./DisclosureRow";
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
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  const heading = title ?? "Sources";
  return (
    <Collapsible open={isOpen} onOpenChange={setOpen} style={style}>
      <CollapsibleTriggerRow
        icon={<Glyph name="globe" size={14} color={t.color.text.dim} />}
        title={
          <DisclosureRow
            label={heading}
            gap={6}
            style={{ minWidth: 0, flexShrink: 1 }}
            trailing={
              count !== undefined ? (
                <T size="caption" color={t.color.text.dim}>
                  {count}
                </T>
              ) : null
            }
          />
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

export function Source({
  title,
  url,
  icon,
  onClick,
  children,
  style,
}: SourceProps) {
  const t = useAdwaita();
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
        borderRadius: t.radius.sm,
        cursor: "pointer",
        hover: { backgroundColor: t.color.surface.buttonHover },
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
          borderRadius: t.radius.sm,
          borderWidth: 0,
          backgroundColor: t.color.surface.button,
          flexShrink: 0,
          pointerEvents: "none",
        }}
      >
        <Icon name={icon ?? "link"} size={14} color={t.color.text.primary} />
      </div>
      <T
        size="body"
        color={t.color.text.primary}
        style={{ flexShrink: 1, textOverflow: "ellipsis" }}
      >
        {title}
      </T>
      <T size="caption" color={t.color.text.dim} style={{ flexShrink: 0 }}>
        {hostnameOf(url)}
      </T>
      <Icon name="arrowForward" size={12} color={t.color.text.dim} />
    </div>
  );
}
