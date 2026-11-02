import { type ReactNode, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { MenuBarShell, MenuRow } from "./menu";
import { FloatingPanel } from "./FloatingPanel";
import { PANEL_SHADOW } from "./overlay";
import { Icon } from "./icons";
import {
  makeMenuParts,
  type MenuGroupProps,
  type MenuItemPartProps,
  type MenuLabelPartProps,
  type MenuRadioGroupPartProps,
  type MenuRadioItemPartProps,
  type MenuSeparatorPartProps,
  type MenuShortcutPartProps,
  type MenuSubContentPartProps,
  type MenuSubPartProps,
  type MenuSubTriggerPartProps,
  type MenuCheckboxItemPartProps,
} from "./menu-parts";

const BAR_ROW: Partial<StyleDesc> = {
  gap: 6,
  padding: 6,
  paddingLeft: 10,
  paddingRight: 10,
};

export interface MenubarProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface MenubarMenuProps {
  label: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  style?: Partial<StyleDesc>;
}

export type MenubarItemProps = MenuItemPartProps;

export interface MenubarTriggerProps {
  label: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  style?: Partial<StyleDesc>;
}

export interface MenubarContentProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export type MenubarLabelProps = MenuLabelPartProps;

export type MenubarSeparatorProps = MenuSeparatorPartProps;

export type MenubarCheckboxItemProps = MenuCheckboxItemPartProps;

export type MenubarRadioItemProps = MenuRadioItemPartProps;

export type MenubarRadioGroupProps = MenuRadioGroupPartProps;

export type MenubarSubProps = MenuSubPartProps;

export type MenubarSubTriggerProps = MenuSubTriggerPartProps;

export type MenubarSubContentProps = MenuSubContentPartProps;

export type MenubarShortcutProps = MenuShortcutPartProps;

const menuParts = makeMenuParts(
  () => ({ open: false, onOpenChange: () => {} }),
  { rowStyle: BAR_ROW },
);

export function Menubar({ children, style }: MenubarProps) {
  return <MenuBarShell style={style}>{children}</MenuBarShell>;
}

function MenubarDropdown({
  label,
  children,
  defaultOpen,
  style,
}: MenubarMenuProps) {
  const t = useAdwaita();
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div style={{ display: "flex", position: "relative", ...style }}>
      <MenuRow
        label={label}
        onClick={() => setOpen(!open)}
        trailing={
          <Icon
            name="expandMore"
            size={12}
            color={t.color.text.dim}
            style={{ flexShrink: 0 }}
          />
        }
        style={{
          gap: 6,
          padding: 6,
          paddingLeft: 10,
          paddingRight: 10,
          backgroundColor: open ? t.color.accent.tint : "transparent",
          active: { backgroundColor: t.color.surface.buttonActive },
        }}
      />
      {open ? (
        <FloatingPanel
          minWidth={160}
          style={{
            boxShadow: PANEL_SHADOW,
          }}
        >
          {children}
        </FloatingPanel>
      ) : null}
    </div>
  );
}

export function MenubarMenu(props: MenubarMenuProps) {
  return <MenubarDropdown {...props} />;
}

export const MenubarItem = menuParts.Item;

export function MenubarTrigger({
  label,
  children,
  defaultOpen,
  style,
}: MenubarTriggerProps) {
  return (
    <MenubarDropdown
      label={label}
      children={children}
      defaultOpen={defaultOpen}
      style={style}
    />
  );
}

export function MenubarContent({ children, style }: MenubarContentProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 4,
        minWidth: 160,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const MenubarLabel = menuParts.Label;

export const MenubarSeparator = menuParts.Separator;

export const MenubarCheckboxItem = menuParts.CheckboxItem;

export const MenubarRadioGroup = menuParts.RadioGroup;

export const MenubarRadioItem = menuParts.RadioItem;

export const MenubarSub = menuParts.Sub;

export const MenubarSubTrigger = menuParts.SubTrigger;

export const MenubarSubContent = menuParts.SubContent;

export const MenubarShortcut = menuParts.Shortcut;
