import { createContext, useContext, useState, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba, isDarkScheme } from "../theme/adwaita";
import { T } from "./common";
import { Icon, type IconName } from "./icons";

export interface TabItem {
  id: string;
  label: string;
  icon?: IconName;
  closable?: boolean;
  disabled?: boolean;
}

export interface TabsProps {
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
  onClose?: (id: string) => void;
}

const TabsCtx = createContext<TabsCtxValue | null>(null);

export function useTabs(): TabsCtxValue | null {
  return useContext(TabsCtx);
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
  const { colors, radii } = t;
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        ...(grow ? { flexGrow: 1 } : {}),
        borderRadius: radii.pill,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        backgroundColor: selected ? colors.button_bg : "transparent",
        hover: disabled
          ? undefined
          : {
              backgroundColor: selected
                ? colors.button_hover
                : hexToRgba(colors.fg, isDarkScheme(t.scheme) ? 0.06 : 0.04),
            },
        ...style,
      }}
    >
      {children}
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
  const { colors, spacing } = t;
  const disabled = item.disabled ?? false;
  const closable = item.closable && !!onClose && !disabled;
  const iconColor = disabled
    ? colors.dim_fg
    : selected
      ? colors.accent
      : colors.dim_fg;
  const labelColor = disabled
    ? colors.dim_fg
    : selected
      ? colors.fg
      : colors.dim_fg;

  return (
    <TabShell
      selected={selected}
      disabled={disabled}
      onClick={() => onSelect(item.id)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.gap,
          minHeight: 38,
          paddingLeft: spacing.paddingTight,
          paddingRight: closable ? 6 : spacing.paddingTight,
        }}
      >
        {item.icon ? (
          <Icon name={item.icon} size={16} color={iconColor} />
        ) : null}
        <T
          size="body"
          weight={selected ? 600 : 400}
          color={labelColor}
        >
          {item.label}
        </T>
        {closable ? (
          <div
            onClick={() => onClose?.(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 18,
              height: 18,
              borderRadius: 9,
              marginLeft: 2,
              cursor: "pointer",
              hover: { backgroundColor: hexToRgba(colors.fg, 0.12) },
            }}
          >
            <Icon name="close" size={12} color={colors.dim_fg} />
          </div>
        ) : null}
      </div>
    </TabShell>
  );
}

export interface TabsListProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}


export function TabsList({ children, style }: TabsListProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const isVertical = useTabs()?.orientation === "vertical";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        gap: 4,
        padding: 4,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
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
  const { colors, spacing } = t;
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
          gap: spacing.gap,
          minHeight: 38,
          padding: spacing.paddingTight,
        }}
      >
        <T
          size="body"
          weight={selected ? 600 : 400}
          color={selected ? colors.fg : colors.dim_fg}
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
  const { spacing } = t;
  const ctx = useTabs();
  const active = ctx?.value === value;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: spacing.paddingTight,
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
  onClose,
  orientation = "horizontal",
  children,
  style,
}: TabsProps) {
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
    onClose,
  };

  return (
    <TabsCtx.Provider value={ctxValue}>
      <div
        style={{
          display: "flex",
          flexDirection: orientation === "vertical" ? "row" : "column",
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

export const TabBar = Tabs;
