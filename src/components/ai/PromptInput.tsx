import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, shade } from "../../theme/adwaita";
import {
  InputGroup,
  InputGroupButton,
} from "../../components/InputGroup";
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
  style?: Partial<StyleDesc>;
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
  style,
}: PromptInputProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const isEmpty = (value ?? "").trim().length === 0;
  return (
    <InputGroup align="block-end" style={{ minWidth: 0, ...style }}>
      <PromptInputTextarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={2}
        disabled={disabled}
        autoFocus={autoFocus}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.gap,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <InputGroupButton
          onClick={() => {}}
          style={{
            width: 32,
            height: 32,
            borderRadius: radii.pill,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.button_bg,
          }}
        >
          <Icon name="plus" size={14} color={colors.dim_fg} />
        </InputGroupButton>
        <div style={{ flexGrow: 1 }} />
        {models && models.length > 0 ? (
          <ModelSelector
            models={models}
            value={model}
            defaultValue={models[0]?.id}
            onValueChange={onModelChange}
            style={{ minWidth: 100 }}
          />
        ) : null}
        {efforts && efforts.length > 0 ? (
          <ModelSelectorEffort
            efforts={efforts}
            value={effort}
            defaultValue={efforts[0]?.id}
            onValueChange={onEffortChange}
            showLabel
            style={{ minWidth: 80 }}
          />
        ) : null}
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
  const { colors, radii } = t;
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
        borderRadius: radii.pill,
        backgroundColor: colors.accent,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "default" : "pointer",
        flexShrink: 0,
        hover: disabled ? undefined : { backgroundColor: shade(colors.accent, -0.08) },
        active: disabled ? undefined : { backgroundColor: shade(colors.accent, -0.18) },
        ...style,
      }}
    >
      <Icon name="arrowUp" size={16} color={colors.accent_fg} />
    </div>
  );
}
