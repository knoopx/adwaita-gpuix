import { createContext, useContext, useState, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { MenuBarShell, FloatingPanel, MenuRow } from "./common";
import { Icon, type IconName } from "./icons";

export interface NavigationMenuProps {
  children?: ReactNode;
  defaultOpenItem?: string;
  style?: Partial<StyleDesc>;
}

export interface NavigationMenuListProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface NavigationMenuIndicatorProps {
  style?: Partial<StyleDesc>;
}

export interface NavigationMenuItemProps {
  children?: ReactNode;
  item?: string;
  style?: Partial<StyleDesc>;
}

export interface NavigationMenuTriggerProps {
  children: ReactNode;
  item?: string;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export interface NavigationMenuContentProps {
  children?: ReactNode;
  item?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  style?: Partial<StyleDesc>;
}

export interface NavigationMenuLinkProps {
  label: string;
  icon?: IconName;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

interface NavigationMenuContextValue {
  open: string | null;
  setOpen: (item: string | null) => void;
}

const NavMenuCtx = createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenu(): NavigationMenuContextValue | null {
  return useContext(NavMenuCtx);
}

export function NavigationMenu({
  children,
  defaultOpenItem,
  style,
}: NavigationMenuProps) {
  const [open, setOpen] = useState<string | null>(defaultOpenItem ?? null);
  return (
    <NavMenuCtx.Provider value={{ open, setOpen }}>
      <MenuBarShell style={style}>{children}</MenuBarShell>
    </NavMenuCtx.Provider>
  );
}

export function NavigationMenuList({
  children,
  style,
}: NavigationMenuListProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function NavigationMenuIndicator({
  style,
}: NavigationMenuIndicatorProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        width: 12,
        height: 3,
        borderRadius: 2,
        backgroundColor: t.colors.accent,
        ...style,
      }}
    />
  );
}

export function NavigationMenuItem({
  children,
  item,
  style,
}: NavigationMenuItemProps) {
  const ctx = useNavigationMenu();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        ...style,
      }}
    >
      {children}
      {item !== undefined && ctx?.open === item ? (
        <NavigationMenuIndicator />
      ) : null}
    </div>
  );
}

export function NavigationMenuTrigger({
  children,
  item,
  disabled,
  style,
}: NavigationMenuTriggerProps) {
  const t = useAdwaita();
  const { colors } = t;
  const ctx = useNavigationMenu();
  const open = item !== undefined && ctx?.open === item;
  return (
    <div
      onClick={
        disabled
          ? undefined
          : () => {
              if (item !== undefined && ctx)
                ctx.setOpen(ctx.open === item ? null : item);
            }
      }
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        padding: 6,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 6,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        backgroundColor: open ? colors.accentTint : "transparent",
        ...(disabled
          ? {}
          : {
              hover: { backgroundColor: colors.accentTint },
              active: { backgroundColor: colors.button_active },
            }),
        ...style,
      }}
    >
      {children}
      <Icon name="chevronDown" size={12} color={colors.dim_fg} />
    </div>
  );
}

export function NavigationMenuContent({
  children,
  item,
  side = "bottom",
  sideOffset = 4,
  style,
}: NavigationMenuContentProps) {
  const ctx = useNavigationMenu();
  if (item !== undefined && ctx?.open !== item) return null;
  return (
    <FloatingPanel
      side={side}
      sideOffset={sideOffset}
      minWidth={180}
      padding={8}
      style={{
        boxShadow: {
          offsetX: 0,
          offsetY: 4,
          blurRadius: 16,
          spreadRadius: 0,
          color: "rgba(0,0,0,0.35)",
        },
        ...style,
      }}
    >
      {children}
    </FloatingPanel>
  );
}

export function NavigationMenuLink({
  label,
  icon,
  onClick,
  active,
  disabled,
  style,
}: NavigationMenuLinkProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <MenuRow
      label={label}
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      labelColor={active ? colors.accent : undefined}
      style={{
        backgroundColor: active ? colors.accentTint : "transparent",
        ...style,
      }}
    />
  );
}
