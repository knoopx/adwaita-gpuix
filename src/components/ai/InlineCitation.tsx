import { type ReactNode, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import {
  type AdwaitaTheme,
  hexToRgba,
  isDarkScheme,
  useAdwaita,
} from "../../theme/adwaita";
import { T } from "../text";
import { Icon } from "../../components/icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
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

const MARKER_HOVER_ALPHA: Record<"light" | "dark", number> = {
  light: 0.24,
  dark: 0.36,
};

function markerHoverBg(t: AdwaitaTheme): string {
  return hexToRgba(
    t.color.accent.base,
    MARKER_HOVER_ALPHA[isDarkScheme(t.scheme) ? "dark" : "light"],
  );
}

function CitationQuote({ source }: { source: CitationSource }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderLeftWidth: 2,
        borderColor: t.color.accent.base,
        backgroundColor: t.color.accent.tint,
        paddingLeft: 8,
      }}
    >
      <T size="caption" color={t.color.text.dim}>
        {source.quote}
      </T>
    </div>
  );
}

function CitationSourceMeta({ source }: { source: CitationSource }) {
  const t = useAdwaita();
  return (
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
        color={t.color.accent.base}
        style={{ flexShrink: 1, textOverflow: "ellipsis" }}
      >
        {hostnameOf(source.url)}
      </T>
      <Icon name="link" size={10} color={t.color.text.dim} />
    </div>
  );
}

function CitationDefaultBody({
  source,
  quote,
}: {
  source: CitationSource | undefined;
  quote: boolean;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 0,
      }}
    >
      {quote && source?.quote ? <CitationQuote source={source} /> : null}
      {source ? (
        <T
          size="body"
          weight={600}
          color={t.color.text.primary}
          style={{ flexShrink: 1, textOverflow: "ellipsis" }}
        >
          {source.title}
        </T>
      ) : null}
      {source ? <CitationSourceMeta source={source} /> : null}
    </div>
  );
}

export function InlineCitationCard({
  sources,
  index = 1,
  label = String(index),
  quote = false,
  open = false,
  onOpenChange = () => {},
  children,
  style,
}: InlineCitationCardProps) {
  const t = useAdwaita();
  const source = sources[index - 1] ?? sources[0];
  return (
    <HoverCard open={open} onOpenChange={onOpenChange}>
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
          borderRadius: t.radius.full,
          backgroundColor: t.color.accent.tint,
          flexShrink: 0,
          hover: { backgroundColor: markerHoverBg(t) },
          ...style,
        }}
      >
        <T
          size="caption"
          weight={600}
          color={t.color.accent.base}
          style={{ pointerEvents: "none" }}
        >
          {label}
        </T>
      </HoverCardTrigger>
      <HoverCardContent style={{ minWidth: 256, gap: 4 }}>
        {children ?? <CitationDefaultBody source={source} quote={quote} />}
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
