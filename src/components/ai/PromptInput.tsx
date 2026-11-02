import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, shade, useAdwaita } from "../../theme/adwaita";
import { InputGroup } from "../../components/InputGroup";
import { Textarea } from "../../components/Textarea";
import { Icon } from "../../components/icons";
import { ModelSelector, ModelSelectorEffort } from "./ModelSelector";

export interface PromptInputModelOption {
  id: string;
  name: string;
  provider?: string;
}

export interface PromptInputEffortOption {
  id: string;
  label: string;
}

export interface PromptInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  models?: PromptInputModelOption[];
  efforts?: PromptInputEffortOption[];
  model?: string;
  onModelChange?: (model: string) => void;
  effort?: string;
  onEffortChange?: (effort: string) => void;
  placeholder?: string;

  modelDisabled?: boolean;
  style?: Partial<StyleDesc>;
}

function hasItems<T>(items: T[] | undefined): items is T[] {
  return items !== undefined && items.length > 0;
}

function promptInputToolbarStyle(t: AdwaitaTheme): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.space.sm,
    paddingTop: 0,
    paddingBottom: 0,
    flexShrink: 0,
  };
}

function modelSelectorDisabled(
  modelDisabled: boolean | undefined,
  disabled: boolean | undefined,
): boolean | undefined {
  return modelDisabled ?? disabled;
}

export function PromptInput({
  value,
  onChange,
  onSend,
  disabled,
  autoFocus,
  models,
  efforts,
  model,
  onModelChange,
  effort,
  onEffortChange,
  placeholder = "What would you like to know?",
  modelDisabled,
  style,
}: PromptInputProps) {
  const t = useAdwaita();
  const isEmpty = (value ?? "").trim().length === 0;
  const modelSelector = hasItems(models) ? (
    <ModelSelector
      models={models}
      value={model}
      defaultValue={models[0]?.id}
      onValueChange={onModelChange}
      disabled={modelSelectorDisabled(modelDisabled, disabled)}
      style={{ minWidth: 100 }}
    />
  ) : null;
  const effortSelector = hasItems(efforts) ? (
    <ModelSelectorEffort
      efforts={efforts}
      value={effort}
      defaultValue={efforts[0]?.id}
      onValueChange={onEffortChange}
      showLabel
      style={{ minWidth: 80 }}
    />
  ) : null;
  return (
    <InputGroup align="row" style={{ minWidth: 0, ...style }}>
      <PromptInputTextarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        autoFocus={autoFocus}
      />
      <div style={promptInputToolbarStyle(t)}>
        {modelSelector}
        {effortSelector}
        <PromptInputSubmit
          disabled={disabled || isEmpty}
          onClick={() => onSend?.(value ?? "")}
        />
      </div>
    </InputGroup>
  );
}

export interface PromptInputTextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  style?: Partial<StyleDesc>;
}

export function PromptInputTextarea({
  value,
  onChange,
  placeholder,
  rows,
  disabled,
  autoFocus,
  style,
}: PromptInputTextareaProps) {
  return (
    <Textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      autoFocus={autoFocus}
      style={{
        borderWidth: 0,
        borderRadius: 0,
        backgroundColor: "transparent",
        flexGrow: 1,
        ...style,
      }}
    />
  );
}

export interface PromptInputSubmitProps {
  disabled?: boolean;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}

export function PromptInputSubmit({
  disabled,
  onClick,
  style,
}: PromptInputSubmitProps) {
  const t = useAdwaita();
  return (
    <div
      onClick={disabled ? undefined : onClick}
      aria-label="Submit"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: t.radius.full,
        backgroundColor: t.color.accent.base,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "default" : "pointer",
        flexShrink: 0,
        hover: disabled
          ? undefined
          : { backgroundColor: shade(t.color.accent.base, -0.08) },
        active: disabled
          ? undefined
          : { backgroundColor: shade(t.color.accent.base, -0.18) },
        ...style,
      }}
    >
      <Icon name="arrowUpward" size={16} color={t.color.text.onAccent} />
    </div>
  );
}
