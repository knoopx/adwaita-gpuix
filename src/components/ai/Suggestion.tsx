import { createContext, useContext, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon, type IconName } from "../../components/icons";

export interface SuggestionItem {
  title: string;
  description?: string;
  icon?: IconName;
}

const SuggestionsCtx = createContext<((s: SuggestionItem) => void) | null>(
  null,
);

export interface SuggestionsProps {
  onSelect?: (suggestion: SuggestionItem) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Suggestions({
  onSelect,
  children,
  style,
}: SuggestionsProps) {
  return (
    <SuggestionsCtx.Provider value={onSelect ?? null}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          minWidth: 0,
          ...style,
        }}
      >
        {children}
      </div>
    </SuggestionsCtx.Provider>
  );
}

export interface SuggestionProps {
  suggestion: SuggestionItem;
  onSelect?: (suggestion: SuggestionItem) => void;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function Suggestion({
  suggestion,
  onSelect,
  disabled,
  style,
}: SuggestionProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const inherited = useContext(SuggestionsCtx);
  const handler = disabled ? undefined : onSelect ?? inherited;
  const { icon, title, description } = suggestion;
  return (
    <div
      onClick={handler ? () => handler(suggestion) : undefined}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        padding: 6,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.button_bg,
        flexShrink: 0,
        cursor: handler ? "pointer" : "default",
        opacity: disabled ? 0.5 : 1,
        hover: handler ? { backgroundColor: colors.button_hover } : undefined,
        active: handler ? { backgroundColor: colors.button_active } : undefined,
        ...style,
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={14}
          color={colors.fg}
          style={{ pointerEvents: "none" }}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pointerEvents: "none",
        }}
      >
        <T size="caption" color={colors.fg}>
          {title}
        </T>
        {description ? (
          <T size="caption" color={colors.dim_fg}>
            {description}
          </T>
        ) : null}
      </div>
    </div>
  );
}
