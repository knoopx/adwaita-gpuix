import { Children, type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import {
  Select as SelectRootPrimitive,
  SelectContent as SelectContentPrimitive,
  SelectGroup as SelectGroupPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectLabel as SelectLabelPrimitive,
  SelectSeparator as SelectSeparatorPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue as SelectValuePrimitive,
} from "@gpuix/react/select";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { listPanelStyle } from "./FloatingPanel";
import { Icon } from "./icons";
import { DISABLED_OPACITY } from "./disabled";

export interface SelectProps {
  items?: readonly { value: string; label?: ReactNode; textValue?: string }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Select({ style, ...props }: SelectProps) {
  return <SelectRootPrimitive {...props} style={style} />;
}

export interface SelectTriggerProps {
  children?: ReactNode;
  disabled?: boolean;

  size?: "sm" | "default";
  style?: Partial<StyleDesc>;
}

export function SelectTrigger({
  children,
  disabled,
  size = "default",
  style,
}: SelectTriggerProps) {
  const t = useAdwaita();
  return (
    <SelectTriggerPrimitive
      disabled={disabled}
      style={({ open, disabled: d }) => {
        const base = selectTriggerStyle(t, {
          minHeight: size === "sm" ? 28 : 34,
        });
        return d
          ? {
              ...base,
              cursor: "default",
              opacity: 0.5,
              hover: undefined,
              ...style,
            }
          : open
            ? { ...base, borderColor: t.color.accent.base, ...style }
            : { ...base, ...style };
      }}
    >
      {children}
      <Icon name="expandMore" size={14} color={t.color.text.dim} />
    </SelectTriggerPrimitive>
  );
}

export interface SelectValueProps {
  placeholder?: ReactNode;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SelectValue({
  placeholder,
  children,
  style,
}: SelectValueProps) {
  const t = useAdwaita();
  const placeholderNode =
    placeholder === undefined ? undefined : typeof placeholder === "string" ? (
      <T size="body" color={t.color.text.dim}>
        {placeholder}
      </T>
    ) : (
      placeholder
    );
  return (
    <SelectValuePrimitive
      placeholder={placeholderNode}
      style={{
        color: t.color.text.primary,
        fontSize: t.type.body,
        fontFamily: t.type.fontFamily,
        flexGrow: 1,
        minWidth: 0,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        ...style,
      }}
    >
      {children}
    </SelectValuePrimitive>
  );
}

export interface SelectContentProps {
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;

  virtual?: boolean;
  style?: Partial<StyleDesc>;
}

export function SelectContent({
  children,
  side = "bottom",
  sideOffset = 4,
  virtual = false,
  style,
}: SelectContentProps) {
  const t = useAdwaita();
  return (
    <SelectContentPrimitive
      side={side}
      sideOffset={sideOffset}
      style={{
        overflowY: "scroll",
        overflowX: "hidden",
        ...listPanelStyle(t, { padding: 4, ...style }),
      }}
    >
      {virtual ? (
        <virtual-list
          estimatedItemHeight={36}
          style={{ maxHeight: 200, width: "100%" }}
        >
          {Children.map(children, (child) => (
            <div
              style={{ display: "flex", flexDirection: "column", height: 36 }}
            >
              {child}
            </div>
          ))}
        </virtual-list>
      ) : (
        children
      )}
    </SelectContentPrimitive>
  );
}

export interface SelectItemProps {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SelectItem({
  value,
  disabled,
  children,
  style,
}: SelectItemProps) {
  const t = useAdwaita();
  return (
    <SelectItemPrimitive
      value={value}
      disabled={disabled}
      style={({ selected, highlighted, disabled: d }) =>
        optionItemStyle(t, { selected, highlighted, disabled: d }, style)
      }
    >
      {({ selected }) => (
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
            <Icon name="check" size={14} color={t.color.accent.base} />
          ) : null}
          <T size="body" color={t.color.text.primary}>
            {children}
          </T>
        </div>
      )}
    </SelectItemPrimitive>
  );
}

export interface SelectGroupProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SelectGroup({ children, style }: SelectGroupProps) {
  return <SelectGroupPrimitive style={style}>{children}</SelectGroupPrimitive>;
}

export interface SelectLabelProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SelectLabel({ children, style }: SelectLabelProps) {
  const t = useAdwaita();
  return (
    <SelectLabelPrimitive
      style={{
        padding: 8,
        paddingBottom: 4,
        ...style,
      }}
    >
      <T size="caption" color={t.color.text.dim}>
        {children}
      </T>
    </SelectLabelPrimitive>
  );
}

export interface SelectSeparatorProps {
  style?: Partial<StyleDesc>;
}

export function SelectSeparator({ style }: SelectSeparatorProps) {
  const t = useAdwaita();
  return (
    <SelectSeparatorPrimitive
      style={{
        height: 1,
        backgroundColor: t.color.border.default,
        ...style,
      }}
    />
  );
}

export function selectTriggerStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 34,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: t.radius.full,
    borderWidth: 1,
    borderColor: t.color.border.default,
    backgroundColor: t.color.surface.view,
    cursor: "pointer",
    hover: { backgroundColor: t.color.surface.button },
    ...style,
  };
}

export interface OptionState {
  selected: boolean;
  highlighted: boolean;
  disabled: boolean;
}

export function optionItemStyle(
  t: AdwaitaTheme,
  { selected, highlighted, disabled }: OptionState,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: 8,
    borderRadius: t.radius.sm,
    cursor: disabled ? "default" : "pointer",
    backgroundColor:
      selected || highlighted ? t.color.accent.tint : "transparent",
    opacity: disabled ? DISABLED_OPACITY : 1,
    ...style,
  };
}
