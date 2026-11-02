import { type ReactNode, createContext, useContext } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { disabledStyle } from "../disabled.ts";
import { Icon, type IconName } from "../../components/icons";
import { TextStack } from "./TextStack";

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

export function Suggestions({ onSelect, children, style }: SuggestionsProps) {
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

type SuggestionHandler = (suggestion: SuggestionItem) => void;

function suggestionInteractivity(
  t: AdwaitaTheme,
  handler: SuggestionHandler | null | undefined,
  disabled: boolean | undefined,
): Partial<StyleDesc> {
  return disabledStyle(disabled, {
    cursor: handler ? "pointer" : "default",
    hover: handler
      ? { backgroundColor: t.color.surface.buttonHover }
      : undefined,
    active: handler
      ? { backgroundColor: t.color.surface.buttonActive }
      : undefined,
  });
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
  const inherited = useContext(SuggestionsCtx);
  const handler = disabled ? undefined : (onSelect ?? inherited);
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
        borderRadius: t.radius.full,
        borderWidth: 0,
        backgroundColor: t.color.surface.button,
        flexShrink: 0,
        ...suggestionInteractivity(t, handler, disabled),
        ...style,
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={14}
          color={t.color.text.primary}
          style={{ pointerEvents: "none" }}
        />
      ) : null}
      <TextStack
        title={title}
        description={description}
        titleSize="caption"
        gap={2}
        pointerEvents="none"
      />
    </div>
  );
}
