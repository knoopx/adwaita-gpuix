import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import {
  Combobox as ComboboxRootPrimitive,
  ComboboxInput as ComboboxInputPrimitive,
  ComboboxTrigger as ComboboxTriggerPrimitive,
  ComboboxValue as ComboboxValuePrimitive,
  ComboboxContent as ComboboxContentPrimitive,
  ComboboxList as ComboboxListPrimitive,
  ComboboxItem as ComboboxItemPrimitive,
  ComboboxEmpty as ComboboxEmptyPrimitive,
  ComboboxGroup as ComboboxGroupPrimitive,
  ComboboxLabel as ComboboxLabelPrimitive,
  ComboboxSeparator as ComboboxSeparatorPrimitive,
  type ComboboxValue as ComboboxValueType,
} from "@gpuix/react/combobox";
import { useAdwaita } from "../theme/adwaita";
import { T, listPanelStyle, textFieldStyle } from "./common";
import { Icon, type IconName } from "./icons";

export interface ComboboxProps {
  items?: readonly ComboboxItemEntry[];
  value?: ComboboxValueType;
  defaultValue?: ComboboxValueType;
  onValueChange?: (value: ComboboxValueType) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  multiple?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Combobox({ items, style, ...props }: ComboboxProps) {
  const stringItems = items?.map((item) =>
    typeof item === "string" ? item : item.value,
  );
  return <ComboboxRootPrimitive {...props} items={stringItems} style={style} />;
}

export interface ComboboxItemObject {
  value: string;
  label?: ReactNode;
}

export type ComboboxItemEntry = string | ComboboxItemObject;

export interface ComboboxInputProps {
  placeholder?: string;
  disabled?: boolean;

  showClear?: boolean;

  value?: string;

  onClear?: () => void;
  style?: Partial<StyleDesc>;
}

export function ComboboxInput({
  placeholder,
  disabled,
  showClear,
  value,
  onClear,
  style,
}: ComboboxInputProps) {
  const t = useAdwaita();
  const { radii, colors } = t;
  const showClearButton = showClear === true && (value ?? "").length > 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, ...style }}>
      <ComboboxInputPrimitive
        placeholder={placeholder}
        disabled={disabled}
        style={textFieldStyle(t, {
          flexGrow: 1,
          alignItems: "center",
          minHeight: 34,
          paddingLeft: 12,
          paddingRight: showClearButton ? 4 : 12,
          borderRadius: radii.button,
          opacity: disabled ? 0.5 : 1,
        })}
      />
      {showClearButton ? (
        <div
          onClick={onClear}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: radii.button,
            cursor: "pointer",
            hover: { backgroundColor: colors.button_hover },
            active: { backgroundColor: colors.button_active },
          }}
        >
          <Icon
            name="close"
            size={14}
            color={colors.dim_fg}
            style={{ pointerEvents: "none" }}
          />
        </div>
      ) : null}
    </div>
  );
}

export interface ComboboxTriggerProps {
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function ComboboxTrigger({ disabled, style }: ComboboxTriggerProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <ComboboxTriggerPrimitive
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        minHeight: 34,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        hover: disabled ? undefined : { backgroundColor: colors.button_hover },
        active: disabled
          ? undefined
          : { backgroundColor: colors.button_active },
        ...style,
      }}
    >
      <Icon
        name="chevronDown"
        size={14}
        color={colors.dim_fg}
        style={{ pointerEvents: "none" }}
      />
    </ComboboxTriggerPrimitive>
  );
}

export interface ComboboxValueProps {
  placeholder?: ReactNode;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ComboboxValue({
  placeholder,
  children,
  style,
}: ComboboxValueProps) {
  const t = useAdwaita();
  const { colors, typography } = t;
  return (
    <ComboboxValuePrimitive
      placeholder={placeholder}
      style={{
        fontSize: typography.body,
        fontFamily: typography.fontFamily,
        color: colors.fg,
        ...style,
      }}
    >
      {children}
    </ComboboxValuePrimitive>
  );
}

export interface ComboboxContentProps {
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  style?: Partial<StyleDesc>;
}

export function ComboboxContent({
  children,
  side,
  style,
}: ComboboxContentProps) {
  const t = useAdwaita();
  return (
    <ComboboxContentPrimitive
      side={side}
      style={listPanelStyle(t, { padding: 4, ...style })}
    >
      {children}
    </ComboboxContentPrimitive>
  );
}

export interface ComboboxListProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ComboboxList({ children, style }: ComboboxListProps) {
  return (
    <ComboboxListPrimitive
      style={{ display: "flex", flexDirection: "column", gap: 2, ...style }}
    >
      {children}
    </ComboboxListPrimitive>
  );
}

export interface ComboboxItemProps {
  value: string;
  disabled?: boolean;

  selected?: boolean;
  icon?: IconName;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ComboboxItem({
  value,
  disabled,
  selected,
  icon,
  children,
  style,
}: ComboboxItemProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <ComboboxItemPrimitive
      value={value}
      disabled={disabled}
      style={({ selected: isSelected, highlighted, disabled: d }) => ({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        padding: 8,
        borderRadius: t.radii.row,
        cursor: d ? "default" : "pointer",
        backgroundColor:
          isSelected || highlighted ? colors.accentTint : "transparent",
        opacity: d ? 0.5 : 1,
        ...style,
      })}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          flexGrow: 1,
          minWidth: 0,
          pointerEvents: "none",
        }}
      >
        {selected ? (
          <Icon
            name="success"
            size={14}
            color={colors.accent}
            style={{ pointerEvents: "none" }}
          />
        ) : null}
        {icon ? <Icon name={icon} size={16} color={colors.fg} /> : null}
        <T size="body" color={colors.fg}>
          {children}
        </T>
      </div>
    </ComboboxItemPrimitive>
  );
}

export interface ComboboxEmptyProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ComboboxEmpty({
  children = "No results",
  style,
}: ComboboxEmptyProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <ComboboxEmptyPrimitive style={{ padding: 8, ...style }}>
      <T size="body" color={colors.dim_fg}>
        {children}
      </T>
    </ComboboxEmptyPrimitive>
  );
}

export interface ComboboxLabelProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ComboboxLabel({ children, style }: ComboboxLabelProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <ComboboxLabelPrimitive style={{ padding: 8, paddingBottom: 4, ...style }}>
      <T size="caption" color={colors.dim_fg}>
        {children}
      </T>
    </ComboboxLabelPrimitive>
  );
}

export interface ComboboxGroupProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ComboboxGroup({ children, style }: ComboboxGroupProps) {
  return (
    <ComboboxGroupPrimitive style={style}>{children}</ComboboxGroupPrimitive>
  );
}

export interface ComboboxSeparatorProps {
  style?: Partial<StyleDesc>;
}

export function ComboboxSeparator({ style }: ComboboxSeparatorProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <ComboboxSeparatorPrimitive
      style={{
        height: 1,
        backgroundColor: colors.border,
        ...style,
      }}
    />
  );
}

export interface ComboboxChipsProps {
  values: string[];
  onRemove: (value: string) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  style?: Partial<StyleDesc>;
}

export function ComboboxChips({
  values,
  onRemove,
  inputValue,
  onInputChange,
  placeholder,
  style,
}: ComboboxChipsProps) {
  const t = useAdwaita();
  const { colors, radii, typography } = t;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        borderRadius: radii.button,
        minHeight: 34,
        padding: 4,
        paddingLeft: 8,
        ...style,
      }}
    >
      {values.map((v) => (
        <div
          key={v}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 4,
            paddingLeft: 8,
            paddingRight: 4,
            borderRadius: radii.pill,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.button_bg,
          }}
        >
          <T size="caption" color={colors.fg}>
            {v}
          </T>
          <div
            onClick={() => onRemove(v)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 16,
              height: 16,
              borderRadius: 4,
              cursor: "pointer",
              hover: { backgroundColor: colors.button_hover },
              active: { backgroundColor: colors.button_active },
            }}
          >
            <Icon
              name="close"
              size={10}
              color={colors.dim_fg}
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>
      ))}
      <input
        value={inputValue ?? ""}
        placeholder={placeholder}
        onChange={(e) => onInputChange?.(e.value ?? "")}
        style={{
          flexGrow: 1,
          minWidth: 60,
          borderWidth: 0,
          backgroundColor: "transparent",
          fontSize: typography.body,
          fontFamily: typography.fontFamily,
          color: colors.fg,
        }}
      />
    </div>
  );
}


