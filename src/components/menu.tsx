import { type StyleDesc } from "@gpuix/react";
import { type ReactNode, createContext, useContext, useState } from "react";
import { rowStyle } from "./Box";
import { FieldSlot } from "./Field";
import { FloatingPanel } from "./FloatingPanel";
import { DISABLED_OPACITY } from "./disabled";
import { Icon, type IconName } from "./icons";
import { T, type TextSize } from "./text";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";

function menuRowStyle(
  t: AdwaitaTheme,
  disabled: boolean | undefined,
  hoverBackgroundColor: string | undefined,
): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 6,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? DISABLED_OPACITY : 1,
    hover: { backgroundColor: hoverBackgroundColor ?? t.color.accent.tint },
  };
}

function MenuRowGlyph({
  icon,
  size,
  color,
}: {
  icon?: IconName;
  size: number;
  color?: string;
}) {
  const t = useAdwaita();
  if (!icon) return null;
  return (
    <Icon
      name={icon}
      size={size}
      color={color ?? t.color.text.primary}
      style={{ pointerEvents: "none" }}
    />
  );
}

function MenuRowSlot({ node }: { node?: ReactNode }) {
  if (!node) return null;
  return <FieldSlot>{node}</FieldSlot>;
}

export function MenuRow({
  label,
  icon,
  leading,
  trailing,
  onClick,
  disabled,
  labelColor,
  iconColor,
  hoverBackgroundColor,
  textSize = "body",
  iconSize = 14,
  style,
}: {
  label: string;
  icon?: IconName;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  labelColor?: string;
  iconColor?: string;
  hoverBackgroundColor?: string;
  textSize?: TextSize;
  iconSize?: number;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        ...menuRowStyle(t, disabled, hoverBackgroundColor),
        ...style,
      }}
    >
      <MenuRowSlot node={leading} />
      <MenuRowGlyph icon={icon} size={iconSize} color={iconColor} />
      <T
        size={textSize}
        color={labelColor ?? t.color.text.primary}
        style={{ flexGrow: 1 }}
      >
        {label}
      </T>
      <MenuRowSlot node={trailing} />
    </div>
  );
}

export function MenuIndicator({
  kind = "checkbox",
  active,
  style,
}: {
  kind?: "checkbox" | "radio";
  active: boolean;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  if (kind === "radio") {
    return (
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: active ? t.color.accent.base : t.color.border.default,
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        {active ? (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: t.color.accent.base,
            }}
          />
        ) : null}
      </div>
    );
  }
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: active ? t.color.accent.base : t.color.border.default,
        backgroundColor: active ? t.color.accent.base : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {active ? (
        <Icon
          name="check"
          size={12}
          color={t.color.text.onAccent}
          style={{ pointerEvents: "none" }}
        />
      ) : null}
    </div>
  );
}

export function MenuShortcut({
  children,
  style,
}: {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <T size="caption" color={t.color.text.dim} style={style}>
      {children}
    </T>
  );
}

export function MenuLabel({
  children,
  style,
}: {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div style={{ padding: 8, paddingBottom: 4, ...style }}>
      <T size="caption" color={t.color.text.dim}>
        {children}
      </T>
    </div>
  );
}

export function MenuSeparator({ style }: { style?: Partial<StyleDesc> }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        height: 1,
        backgroundColor: t.color.border.default,
        margin: 4,
        ...style,
      }}
    />
  );
}

export function MenuGroup({
  children,
  style,
}: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, ...style }}>
      {children}
    </div>
  );
}

export interface MenuRadioGroupValue {
  value: string | undefined;
  onSelect: (value: string) => void;
}

const MenuRadioGroupCtx = createContext<MenuRadioGroupValue | null>(null);

export function useMenuRadioGroup(): MenuRadioGroupValue | null {
  return useContext(MenuRadioGroupCtx);
}

function useMenuRadioGroupState(
  value: string | undefined,
  defaultValue: string | undefined,
  onValueChange?: (value: string) => void,
) {
  const [internal, setInternal] = useState<string | undefined>(
    value ?? defaultValue,
  );
  const current = value ?? internal;
  const onSelect: MenuRadioGroupValue["onSelect"] = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };
  return { current, onSelect };
}

export function MenuRadioGroupShell({
  value,
  defaultValue,
  onValueChange,
  children,
  style,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const { current, onSelect } = useMenuRadioGroupState(
    value,
    defaultValue,
    onValueChange,
  );
  return (
    <MenuRadioGroupCtx.Provider value={{ value: current, onSelect }}>
      <MenuGroup style={style}>{children}</MenuGroup>
    </MenuRadioGroupCtx.Provider>
  );
}

export function MenuRadioRow({
  label,
  value,
  selected,
  group,
  onSelect,
  onAfterSelect,
  style,
}: {
  label: string;
  value?: string;
  selected?: boolean;
  group?: MenuRadioGroupValue | null;
  onSelect?: () => void;

  onAfterSelect?: () => void;
  style?: Partial<StyleDesc>;
}) {
  const isSelected =
    selected ?? (value !== undefined && group?.value === value);
  return (
    <MenuRow
      label={label}
      leading={<MenuIndicator kind="radio" active={isSelected} />}
      onClick={() => {
        if (value !== undefined && group) group.onSelect(value);
        onSelect?.();
        onAfterSelect?.();
      }}
      style={style}
    />
  );
}

export interface MenuRadioItemProps {
  label: string;
  value?: string;
  selected?: boolean;
  onSelect?: () => void;
  style?: Partial<StyleDesc>;
}

export function makeMenuRadioItem(
  useFamily: () => { onOpenChange?: (open: boolean) => void },
) {
  return function MenuRadioItem({
    label,
    value,
    selected,
    onSelect,
    style,
  }: MenuRadioItemProps) {
    const { onOpenChange } = useFamily();
    const group = useMenuRadioGroup();
    return (
      <MenuRadioRow
        label={label}
        value={value}
        selected={selected}
        group={group}
        onSelect={onSelect}
        onAfterSelect={() => onOpenChange?.(false)}
        style={style}
      />
    );
  };
}

interface MenuSubValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MenuSubCtx = createContext<MenuSubValue | null>(null);

function useMenuSub(): MenuSubValue {
  const ctx = useContext(MenuSubCtx);
  if (!ctx) throw new Error("MenuSub components must be used within <MenuSub>");
  return ctx;
}

export function MenuSub({
  children,
  style,
  defaultOpen,
}: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <MenuSubCtx.Provider value={{ open, setOpen }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          ...style,
        }}
      >
        {children}
      </div>
    </MenuSubCtx.Provider>
  );
}

export function MenuSubTrigger({
  label,
  icon,
  rowStyle,
  style,
}: {
  label: string;
  icon?: IconName;

  rowStyle?: Partial<StyleDesc>;
  style?: Partial<StyleDesc>;
}) {
  const { open, setOpen } = useMenuSub();
  const t = useAdwaita();
  return (
    <MenuRow
      label={label}
      icon={icon}
      onClick={() => setOpen(!open)}
      trailing={
        <Icon
          name="chevronRight"
          size={12}
          color={t.color.text.dim}
          style={{ flexShrink: 0 }}
        />
      }
      style={{
        backgroundColor: open ? t.color.accent.tint : "transparent",
        ...rowStyle,
        ...style,
      }}
    />
  );
}

export function MenuSubContent({
  children,
  style,
}: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const { open } = useMenuSub();

  if (!open) return null;

  return (
    <FloatingPanel side="right" sideOffset={4} minWidth={160} style={style}>
      {children}
    </FloatingPanel>
  );
}

export function MenuBarShell({
  children,
  style,
}: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={rowStyle(t, {
        gap: 4,
        padding: 4,
        paddingRight: 8,
        backgroundColor: t.color.surface.view,
        ...style,
      })}
    >
      {children}
    </div>
  );
}

export function destructiveRowProps(t: AdwaitaTheme) {
  return {
    labelColor: t.color.functional.destructive,
    iconColor: t.color.functional.destructive,
    hoverBackgroundColor: t.color.functional.destructiveTint,
  };
}

export interface MenuControlItemProps {
  label: string;
  icon?: IconName;
  onClick?: () => void;
  disabled?: boolean;
  inset?: boolean;
  variant?: "default" | "destructive";
  shortcut?: string;
  style?: Partial<StyleDesc>;
}

export interface MenuItemRowProps extends Omit<MenuControlItemProps, "inset"> {
  onOpenChange: (open: boolean) => void;
}

export function MenuItemRow({
  label,
  icon,
  onClick,
  onOpenChange,
  disabled,
  variant,
  shortcut,
  style,
}: MenuItemRowProps) {
  const t = useAdwaita();
  const destructive = variant === "destructive";
  return (
    <MenuRow
      label={label}
      icon={icon}
      disabled={disabled}
      onClick={() => {
        onClick?.();
        onOpenChange(false);
      }}
      {...(destructive ? destructiveRowProps(t) : {})}
      trailing={shortcut ? <MenuShortcut>{shortcut}</MenuShortcut> : undefined}
      style={style}
    />
  );
}
