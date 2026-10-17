import { Children } from "react";
import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import {
  Select as SelectRootPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue as SelectValuePrimitive,
  SelectContent as SelectContentPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectGroup as SelectGroupPrimitive,
  SelectLabel as SelectLabelPrimitive,
  SelectSeparator as SelectSeparatorPrimitive,
} from "@gpuix/react/select";
import { useAdwaita } from "../theme/adwaita";
import { T, listPanelStyle, selectTriggerStyle } from "./common";
import { Icon } from "./icons";

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
  const { colors } = t;
  return (
    <SelectTriggerPrimitive
      disabled={disabled}
      style={({ open, disabled: d }) => {
        const base = selectTriggerStyle(t, {
          minHeight: size === "sm" ? 28 : 34,
        });
        return d
          ? { ...base, cursor: "default", opacity: 0.5, hover: undefined, ...style }
          : open
            ? { ...base, borderColor: colors.accent, ...style }
            : { ...base, ...style };
      }}
    >
      {children}
      <Icon name="chevronDown" size={14} color={colors.dim_fg} />
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
  const { colors, typography } = t;
  const placeholderNode =
    placeholder === undefined
      ? undefined
      : typeof placeholder === "string"
        ? (
            <T size="body" color={colors.dim_fg}>
              {placeholder}
            </T>
          )
        : placeholder;
  return (
    <SelectValuePrimitive
      placeholder={placeholderNode}
      style={{
        color: colors.fg,
        fontSize: typography.body,
        fontFamily: typography.fontFamily,
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
  const { colors, radii } = t;
  return (
    <SelectItemPrimitive
      value={value}
      disabled={disabled}
      style={({ selected, highlighted, disabled: d }) => ({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        padding: 8,
        borderRadius: radii.row,
        cursor: d ? "default" : "pointer",
        backgroundColor:
          selected || highlighted ? colors.accentTint : "transparent",
        opacity: d ? 0.5 : 1,
        ...style,
      })}
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
          {selected ? <Icon name="check" size={14} color={colors.accent} /> : null}
          <T size="body" color={colors.fg}>
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
      <T size="caption" color={t.colors.dim_fg}>
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
        backgroundColor: t.colors.border,
        ...style,
      }}
    />
  );
}
