import { useState } from "react";
import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba, isDarkScheme } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon } from "../../components/icons";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../../components/HoverCard";

export interface CitationSource {
  title: string;
  url: string;
  quote?: string;
}

export interface InlineCitationCardProps {
  sources: CitationSource[];
  index?: number;
  label?: string;
  quote?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function InlineCitationCard({
  sources,
  index = 1,
  label,
  quote = false,
  open = false,
  onOpenChange,
  children,
  style,
}: InlineCitationCardProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const source = sources[index - 1] ?? sources[0];
  const markerText = label ?? String(index);
  const hoverBg = hexToRgba(
    colors.accent,
    isDarkScheme(t.scheme) ? 0.36 : 0.24,
  );
  return (
    <HoverCard open={open} onOpenChange={onOpenChange ?? (() => {})}>
      <HoverCardTrigger
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 5,
          paddingRight: 5,
          borderRadius: radii.pill,
          backgroundColor: colors.accentTint,
          flexShrink: 0,
          hover: { backgroundColor: hoverBg },
          ...style,
        }}
      >
        <T
          size="caption"
          weight={600}
          color={colors.accent}
          style={{ pointerEvents: "none" }}
        >
          {markerText}
        </T>
      </HoverCardTrigger>
      <HoverCardContent style={{ minWidth: 256, gap: 4 }}>
        {children ?? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minWidth: 0,
            }}
          >
            {quote && source?.quote ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderLeftWidth: 2,
                  borderColor: colors.accent,
                  paddingLeft: 8,
                }}
              >
                <T size="caption" color={colors.dim_fg}>
                  {source.quote}
                </T>
              </div>
            ) : null}
            {source ? (
              <T
                size="body"
                weight={600}
                color={colors.fg}
                style={{ flexShrink: 1, textOverflow: "ellipsis" }}
              >
                {source.title}
              </T>
            ) : null}
            {source ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  minWidth: 0,
                }}
              >
                <T
                  size="caption"
                  color={colors.accent}
                  style={{ flexShrink: 1, textOverflow: "ellipsis" }}
                >
                  {hostnameOf(source.url)}
                </T>
                <Icon name="link" size={10} color={colors.dim_fg} />
              </div>
            ) : null}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

export type InlineCitationProps = InlineCitationCardProps;

export function InlineCitation({
  sources,
  index = 1,
  label,
  quote,
  open,
  onOpenChange,
  children,
  style,
}: InlineCitationProps) {
  const [internal, setInternal] = useState(false);
  const isOpen = open ?? internal;
  return (
    <InlineCitationCard
      sources={sources}
      index={index}
      label={label}
      quote={quote}
      open={isOpen}
      onOpenChange={(next) => {
        if (open === undefined) setInternal(next);
        onOpenChange?.(next);
      }}
      style={style}
    >
      {children}
    </InlineCitationCard>
  );
}
