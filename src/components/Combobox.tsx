import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import {
  Combobox as ComboboxRootPrimitive,
  ComboboxContent as ComboboxContentPrimitive,
  ComboboxEmpty as ComboboxEmptyPrimitive,
  ComboboxGroup as ComboboxGroupPrimitive,
  ComboboxInput as ComboboxInputPrimitive,
  ComboboxItem as ComboboxItemPrimitive,
  ComboboxLabel as ComboboxLabelPrimitive,
  ComboboxList as ComboboxListPrimitive,
  ComboboxSeparator as ComboboxSeparatorPrimitive,
  ComboboxTrigger as ComboboxTriggerPrimitive,
  ComboboxValue as ComboboxValuePrimitive,
  type ComboboxValue as ComboboxValueType,
} from "@gpuix/react/combobox";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { listPanelStyle } from "./FloatingPanel";
import { textFieldStyle } from "./input-base";
import { optionItemStyle } from "./Select";
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
          borderRadius: t.radius.sm,
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
            borderRadius: t.radius.sm,
            cursor: "pointer",
            hover: { backgroundColor: t.color.surface.buttonHover },
            active: { backgroundColor: t.color.surface.buttonActive },
          }}
        >
          <Icon
            name="close"
            size={14}
            color={t.color.text.dim}
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
  return (
    <ComboboxTriggerPrimitive
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        minHeight: 34,
        borderRadius: t.radius.sm,
        borderWidth: 0,
        backgroundColor: t.color.surface.button,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        hover: disabled
          ? undefined
          : { backgroundColor: t.color.surface.buttonHover },
        active: disabled
          ? undefined
          : { backgroundColor: t.color.surface.buttonActive },
        ...style,
      }}
    >
      <Icon
        name="expandMore"
        size={14}
        color={t.color.text.dim}
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
  return (
    <ComboboxValuePrimitive
      placeholder={placeholder}
      style={{
        fontSize: t.type.body,
        fontFamily: t.type.fontFamily,
        color: t.color.text.primary,
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
  return (
    <ComboboxItemPrimitive
      value={value}
      disabled={disabled}
      style={({ selected: isSelected, highlighted, disabled: d }) =>
        optionItemStyle(
          t,
          { selected: isSelected, highlighted, disabled: d },
          style,
        )
      }
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
            name="checkCircle"
            size={14}
            color={t.color.accent.base}
            style={{ pointerEvents: "none" }}
          />
        ) : null}
        {icon ? (
          <Icon name={icon} size={16} color={t.color.text.primary} />
        ) : null}
        <T size="body" color={t.color.text.primary}>
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
  return (
    <ComboboxEmptyPrimitive style={{ padding: 8, ...style }}>
      <T size="body" color={t.color.text.dim}>
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
  return (
    <ComboboxLabelPrimitive style={{ padding: 8, paddingBottom: 4, ...style }}>
      <T size="caption" color={t.color.text.dim}>
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
  return (
    <ComboboxSeparatorPrimitive
      style={{
        height: 1,
        backgroundColor: t.color.border.default,
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
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: t.color.border.default,
        backgroundColor: t.color.surface.view,
        borderRadius: t.radius.sm,
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
            borderRadius: t.radius.full,
            borderWidth: 0,
            backgroundColor: t.color.surface.button,
          }}
        >
          <T size="caption" color={t.color.text.primary}>
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
              hover: { backgroundColor: t.color.surface.buttonHover },
              active: { backgroundColor: t.color.surface.buttonActive },
            }}
          >
            <Icon
              name="close"
              size={10}
              color={t.color.text.dim}
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
          fontSize: t.type.body,
          fontFamily: t.type.fontFamily,
          color: t.color.text.primary,
        }}
      />
    </div>
  );
}
