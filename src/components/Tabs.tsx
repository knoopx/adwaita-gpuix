import { type ReactNode, createContext, useContext, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import {
  type AdwaitaTheme,
  hexToRgba,
  isDarkScheme,
  useAdwaita,
} from "../theme/adwaita";
import { T } from "./text";
import { Icon, type IconName } from "./icons";

export interface TabItem {
  id: string;
  label: string;
  icon?: IconName;
  closable?: boolean;
  disabled?: boolean;
}

export interface TabsProps {
  variant?: "pill" | "strip";
  items?: TabItem[];

  value?: string;

  defaultValue?: string;

  onSelect?: (id: string) => void;

  onClose?: (id: string) => void;

  orientation?: "horizontal" | "vertical";

  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface TabsCtxValue {
  value: string;

  setValue: (value: string) => void;
  orientation: "horizontal" | "vertical";
  variant: "pill" | "strip";
  onClose?: (id: string) => void;
}

const TabsCtx = createContext<TabsCtxValue | null>(null);

export function useTabs(): TabsCtxValue | null {
  return useContext(TabsCtx);
}

function tabShellStateStyle(
  t: AdwaitaTheme,
  disabled: boolean | undefined,
  selected: boolean,
): Partial<StyleDesc> {
  return {
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.5 : 1,
    backgroundColor: selected ? t.color.surface.button : "transparent",
  };
}

function tabShellHoverStyle(
  t: AdwaitaTheme,
  disabled: boolean | undefined,
  selected: boolean,
): Partial<StyleDesc> {
  if (disabled) return { hover: undefined };
  const tint = isDarkScheme(t.scheme) ? 0.06 : 0.04;
  return {
    hover: {
      backgroundColor: selected
        ? t.color.surface.hover
        : t.color.surface.raised,
    },
  };
}

function TabShell({
  selected,
  disabled,
  grow = false,
  onClick,
  style,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  grow?: boolean;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
  children: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        ...(grow ? { flexGrow: 1 } : {}),
        borderRadius: t.radius.full,
        ...tabShellStateStyle(t, disabled, selected),
        ...tabShellHoverStyle(t, disabled, selected),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function tabLabelWeight(selected: boolean): number {
  return selected ? 600 : 400;
}

function tabLabelColor(
  t: AdwaitaTheme,
  disabled: boolean,
  selected: boolean,
): string {
  if (disabled) return t.color.text.dim;
  return selected ? t.color.text.primary : t.color.text.dim;
}

function tabIconColor(
  t: AdwaitaTheme,
  disabled: boolean,
  selected: boolean,
): string {
  if (disabled) return t.color.text.dim;
  return selected ? t.color.accent.base : t.color.text.dim;
}

function TabCloseButton({
  style,
  iconSize,
  iconColor,
  onClose,
}: {
  style: Partial<StyleDesc>;
  iconSize: number;
  iconColor: string;
  onClose: () => void;
}) {
  return (
    <div onClick={onClose} style={style}>
      <Icon name="close" size={iconSize} color={iconColor} />
    </div>
  );
}

function pillCloseStyle(t: AdwaitaTheme): Partial<StyleDesc> {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 18,
    height: 18,
    borderRadius: 8,
    marginLeft: 2,
    cursor: "pointer",
    hover: { backgroundColor: t.color.surface.hover },
  };
}

function stripCloseStyle(t: AdwaitaTheme): Partial<StyleDesc> {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: t.control.tabStripCloseHitSize,
    height: t.control.tabStripCloseHitSize,
    borderRadius: t.control.tabStripCloseHitSize / 2,
    flexShrink: 0,
    cursor: "pointer",
    hover: { backgroundColor: t.color.selection.muted },
  };
}

function StripTab({
  item,
  selected,
  first,
  onSelect,
  onClose,
}: {
  item: TabItem;
  selected: boolean;
  first: boolean;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
}) {
  const t = useAdwaita();
  const closable = item.closable && !!onClose;
  return (
    <div
      onClick={() => onSelect(item.id)}
      style={{
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        flexBasis: 0,
        minWidth: 0,
        height: t.control.tabStripHeight,
        borderLeftWidth: first ? 0 : t.control.dividerThickness,
        borderColor: t.color.divider.default,
        cursor: "pointer",
        hover: selected
          ? undefined
          : { backgroundColor: t.color.selection.faint },
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: t.space.sm,
          flexGrow: 1,
          minWidth: 0,
          margin: t.control.tabStripInset,
          borderRadius: t.radius.sm,
          paddingLeft: t.control.tabStripPaddingX,
          paddingRight: t.control.tabStripPaddingX,
          backgroundColor: selected
            ? t.color.surface.buttonHover
            : "transparent",
        }}
      >
        <T
          size="body"
          weight={tabLabelWeight(selected)}
          color={tabLabelColor(t, false, selected)}
          style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
        >
          {item.label}
        </T>
        {closable ? (
          <TabCloseButton
            style={stripCloseStyle(t)}
            iconSize={t.control.caretIconSize}
            iconColor={t.color.text.dim}
            onClose={() => onClose?.(item.id)}
          />
        ) : null}
      </div>
    </div>
  );
}

function Tab({
  item,
  selected,
  onSelect,
  onClose,
}: {
  item: TabItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
}) {
  const t = useAdwaita();
  const disabled = item.disabled ?? false;
  const closable = item.closable && !!onClose && !disabled;

  return (
    <TabShell
      selected={selected}
      disabled={disabled}
      onClick={() => onSelect(item.id)}
    >
      <div style={tabInnerStyle(t, closable)}>
        {item.icon ? (
          <Icon
            name={item.icon}
            size={16}
            color={tabIconColor(t, disabled, selected)}
          />
        ) : null}
        <T
          size="body"
          weight={tabLabelWeight(selected)}
          color={tabLabelColor(t, disabled, selected)}
        >
          {item.label}
        </T>
        {closable ? (
          <TabCloseButton
            style={pillCloseStyle(t)}
            iconSize={12}
            iconColor={t.color.text.dim}
            onClose={() => onClose?.(item.id)}
          />
        ) : null}
      </div>
    </TabShell>
  );
}

function tabInnerStyle(
  t: AdwaitaTheme,
  closable: boolean | undefined,
): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.space.sm,
    minHeight: 38,
    paddingLeft: t.space.md,
    paddingRight: closable ? 6 : t.space.md,
  };
}

export interface TabsListProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TabsList({ children, style }: TabsListProps) {
  const t = useAdwaita();
  const isVertical = useTabs()?.orientation === "vertical";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        gap: 4,
        padding: 4,
        borderRadius: t.radius.full,
        borderWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TabsTrigger({ value, children, style }: TabsTriggerProps) {
  const t = useAdwaita();
  const ctx = useTabs();
  const selected = ctx?.value === value;

  return (
    <TabShell
      selected={selected}
      grow
      onClick={() => ctx?.setValue(value)}
      style={style}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: t.space.sm,
          minHeight: 38,
          padding: t.space.md,
        }}
      >
        <T
          size="body"
          weight={selected ? 600 : 400}
          color={selected ? t.color.text.primary : t.color.text.dim}
        >
          {children}
        </T>
      </div>
    </TabShell>
  );
}

export interface TabsContentProps {
  value: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TabsContent({ value, children, style }: TabsContentProps) {
  const t = useAdwaita();
  const ctx = useTabs();
  const active = ctx?.value === value;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: t.space.md,
        ...style,
      }}
    >
      {active ? children : null}
    </div>
  );
}

export function Tabs({
  items,
  value,
  defaultValue,
  onSelect,
  variant = "pill",
  onClose,
  orientation = "horizontal",
  children,
  style,
}: TabsProps) {
  const t = useAdwaita();
  const [internal, setInternal] = useState<string>(defaultValue ?? value ?? "");
  const current = value ?? internal;
  const setValue = (v: string) => {
    if (value === undefined) setInternal(v);
    onSelect?.(v);
  };

  const ctxValue: TabsCtxValue = {
    value: current,
    setValue,
    orientation,
    variant,
    onClose,
  };

  if (items && variant === "strip") {
    return (
      <TabsCtx.Provider value={ctxValue}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: t.control.tabStripHeight,
            backgroundColor: t.color.surface.headerbar,
            ...style,
          }}
        >
          {items.map((item, i) => (
            <StripTab
              key={item.id}
              item={item}
              first={i === 0}
              selected={item.id === current}
              onSelect={setValue}
              onClose={onClose}
            />
          ))}
        </div>
      </TabsCtx.Provider>
    );
  }

  return (
    <TabsCtx.Provider value={ctxValue}>
      <div
        style={{
          display: "flex",
          flexDirection: tabsShellDirection(orientation),
          gap: 4,
          ...style,
        }}
      >
        {items ? (
          <TabsList>
            {items.map((item) => (
              <Tab
                key={item.id}
                item={item}
                selected={item.id === current}
                onSelect={setValue}
                onClose={onClose}
              />
            ))}
          </TabsList>
        ) : null}
        {children}
      </div>
    </TabsCtx.Provider>
  );
}

function tabsShellDirection(orientation: "horizontal" | "vertical") {
  return orientation === "vertical" ? "row" : "column";
}
