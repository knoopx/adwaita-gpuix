import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { type EventPayload, type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { MenuRow } from "../menu";
import { arrowStep, isActivateKey, stepIndex } from "../../lib/roving";
import { Icon, type IconName } from "../icons";
import { Sheet, SheetContent } from "../Sheet";

interface SidebarContextValue {
  open: boolean;

  collapsed: boolean;

  focused: string | null;
  onFocusRow: (id: string) => void;
  register: (id: string) => void;
  unregister: (id: string) => void;

  ordered: () => string[];
}

const SidebarCtx = createContext<SidebarContextValue | null>(null);

const FALLBACK_CTX: SidebarContextValue = {
  open: true,
  collapsed: false,
  focused: null,
  onFocusRow: () => {},
  register: () => {},
  unregister: () => {},
  ordered: () => [],
};

function useSidebarCtx(): SidebarContextValue {
  return useContext(SidebarCtx) ?? FALLBACK_CTX;
}

export interface SidebarProps {
  width?: number;

  open?: boolean;

  onOpenChange?: (open: boolean) => void;

  mobile?: boolean;

  contained?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Sidebar({
  width,
  open,
  onOpenChange,
  mobile = false,
  contained = false,
  children,
  style,
}: SidebarProps) {
  const t = useAdwaita();
  const [internalOpen, setInternalOpen] = useState(
    mobile ? (open ?? false) : (open ?? true),
  );
  const effectiveOpen = open ?? internalOpen;
  const collapsed = !effectiveOpen;

  const [focused, setFocused] = useState<string | null>(null);
  const orderedRef = useRef<string[]>([]);
  const register = (id: string) => {
    if (!orderedRef.current.includes(id)) orderedRef.current.push(id);
  };
  const unregister = (id: string) => {
    orderedRef.current = orderedRef.current.filter((x) => x !== id);
  };

  const ctxValue: SidebarContextValue = {
    open: effectiveOpen,
    collapsed,
    focused,
    onFocusRow: setFocused,
    register,
    unregister,
    ordered: () => orderedRef.current,
  };

  const handleOpenChange = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  const panel = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: t.color.surface.sidebar,
        borderWidth: 0,
        overflow: "hidden",
        borderRadius: 0,
        width: mobile
          ? "100%"
          : collapsed
            ? t.control.sidebarRailWidth
            : (width ?? t.control.sidebarWidth),
        ...style,
      }}
    >
      {children}
    </div>
  );

  if (mobile) {
    const sheetInset = {
      top: t.control.headerBarHeight,
      bottom: 0,
      height: undefined,
    };
    return (
      <Sheet
        open={effectiveOpen}
        onOpenChange={handleOpenChange}
        side="left"
        contained={contained}
        inset={sheetInset}
      >
        <SheetContent style={{ padding: 0, gap: 0 }}>
          <SidebarCtx.Provider value={ctxValue}>{panel}</SidebarCtx.Provider>
        </SheetContent>
      </Sheet>
    );
  }

  return <SidebarCtx.Provider value={ctxValue}>{panel}</SidebarCtx.Provider>;
}

export interface SidebarHeaderProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SidebarHeader({ children, style }: SidebarHeaderProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: t.control.headerGroupGap,
        height: t.control.headerBarHeight,
        paddingLeft: t.control.headerBarPaddingX,
        paddingRight: t.control.headerBarPaddingX,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface SidebarContentProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SidebarContent({ children, style }: SidebarContentProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        flexGrow: 1,
        paddingTop: t.space.sm,
        paddingBottom: t.space.sm,
        paddingLeft: t.control.sidebarRowInsetX,
        paddingRight: t.control.sidebarRowInsetEnd,
        display: "flex",
        flexDirection: "column",
        gap: t.space.sm,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface SidebarGroupProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SidebarGroup({ children, style }: SidebarGroupProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.sm,

        flexGrow: 1,
        minHeight: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface SidebarGroupLabelProps {
  children?: ReactNode;

  icon?: IconName;
  style?: Partial<StyleDesc>;
}

export function SidebarGroupLabel({
  children,
  icon,
  style,
}: SidebarGroupLabelProps) {
  const t = useAdwaita();
  const { collapsed } = useSidebarCtx();

  if (collapsed && icon) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          ...style,
        }}
      >
        <Icon name={icon} size={16} color={t.color.text.dim} />
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: 8, paddingRight: 8, ...style }}>
      <T size="caption" color={t.color.text.dim}>
        {children}
      </T>
    </div>
  );
}

export interface SidebarGroupContentProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SidebarGroupContent({
  children,
  style,
}: SidebarGroupContentProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, ...style }}>
      {children}
    </div>
  );
}

export interface SidebarFooterProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SidebarFooter({ children, style }: SidebarFooterProps) {
  const t = useAdwaita();
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <div
        style={{
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export interface SidebarMenuItemProps {
  icon?: IconName;

  label?: string;

  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}

let nextSidebarItemId = 0;

function menuItemShellStyle(
  t: AdwaitaTheme,
  isFocused: boolean,
  disabled: boolean,
): Partial<StyleDesc> {
  return {
    borderRadius: t.radius.sm,
    borderWidth: isFocused ? 1 : 0,
    borderColor: t.color.accent.base,
    cursor: disabled ? "default" : "pointer",
  };
}

function menuItemLabel(collapsed: boolean, label: string | undefined): string {
  if (collapsed) return "";
  return label ?? "";
}

function menuItemIconColor(
  t: AdwaitaTheme,
  selected: boolean | undefined,
): string {
  return selected ? t.color.text.primary : t.color.text.dim;
}

function menuItemRowStyle(
  t: AdwaitaTheme,
  collapsed: boolean,
  selected: boolean | undefined,
): Partial<StyleDesc> {
  const c = t.control;
  const padX = collapsed ? c.sidebarRowPaddingY : c.sidebarRowPaddingX;
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: c.sidebarRowGap,
    paddingTop: c.sidebarRowPaddingY,
    paddingBottom: c.sidebarRowPaddingY,
    minHeight: c.rowHeight,
    borderRadius: t.radius.sm,
    justifyContent: collapsed ? "center" : "flex-start",
    paddingLeft: padX,
    paddingRight: padX,
    backgroundColor: selected ? t.color.selection.muted : "transparent",
    active: { backgroundColor: t.color.surface.buttonActive },
  };
}

export function SidebarMenuItem({
  icon,
  label,
  selected,
  disabled = false,
  onClick,
  style,
}: SidebarMenuItemProps) {
  const t = useAdwaita();
  const ctx = useSidebarCtx();
  const collapsed = ctx.collapsed;

  const idRef = useRef<string | null>(null);
  if (idRef.current === null)
    idRef.current = `sidebar-item-${nextSidebarItemId++}`;
  const id = idRef.current;

  useEffect(() => {
    ctx.register(id);
    return () => ctx.unregister(id);
  }, [id]);

  const isFocused = ctx.focused === id;

  const handleKeyDown = (event: EventPayload) => {
    const key = event.key;
    if (isActivateKey(key, { space: true })) {
      onClick?.();
      return;
    }
    const step = arrowStep(key);
    if (step === 0) return;
    const ordered = ctx.ordered();
    if (ordered.length === 0) return;
    ctx.onFocusRow(
      ordered[stepIndex(ordered.indexOf(id), step, ordered.length)],
    );
  };

  return (
    <div
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onClick}
      onKeyDown={disabled ? undefined : handleKeyDown}
      style={{ ...menuItemShellStyle(t, isFocused, disabled), ...style }}
    >
      <MenuRow
        label={menuItemLabel(collapsed, label)}
        icon={icon}
        disabled={disabled}
        iconColor={menuItemIconColor(t, selected)}
        labelColor={t.color.text.primary}
        textSize="list"
        iconSize={t.control.navIconSize}
        hoverBackgroundColor={t.color.surface.buttonHover}
        style={menuItemRowStyle(t, collapsed, selected)}
      />
    </div>
  );
}
