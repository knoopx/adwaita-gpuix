import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type StyleDesc } from "@gpuix/react";
import {
  useAdwaita,
  hexToRgba,
  isDarkScheme,
  type AdwaitaTheme,
} from "../theme/adwaita";
import { Icon, type IconName } from "./icons";

export type TextSize =
  "title1" | "title2" | "title3" | "title4" | "body" | "caption" | "micro";

export interface TextProps {
  size?: TextSize;
  weight?: string | number;
  color?: string;
  align?: "left" | "center" | "right";
  clamp?: number;
  style?: Partial<StyleDesc>;
  children: ReactNode;
}

export function T({
  size = "body",
  weight,
  color,
  align,
  clamp,
  style,
  children,
}: TextProps) {
  const t = useAdwaita();
  return (
    <text
      style={{
        fontSize: t.typography[size],
        fontFamily: t.typography.fontFamily,
        fontWeight: weight,
        color: color ?? t.colors.fg,
        textAlign: align,
        lineClamp: clamp,
        ...style,
      }}
    >
      {children}
    </text>
  );
}

export function GapRow({
  children,
  style,
}: {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: t.spacing.gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function FieldSlot({
  children,
  style,
}: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface TextPartProps {
  size?: TextSize;
  weight?: string | number;

  dim?: boolean;
  style?: Partial<StyleDesc>;
  children: ReactNode;
}

export function TextPart({
  size = "body",
  weight,
  dim,
  style,
  children,
}: TextPartProps) {
  const t = useAdwaita();
  return (
    <T
      size={size}
      weight={weight}
      color={dim ? t.colors.dim_fg : t.colors.fg}
      style={style}
    >
      {children}
    </T>
  );
}

export interface LabeledProps {
  caption: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}


export function Labeled({ caption, children, style }: LabeledProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        ...style,
      }}
    >
      <T size="caption" color={t.colors.dim_fg}>
        {caption}
      </T>
      {children}
    </div>
  );
}

export function LabeledControl({
  control,
  label,
  disabled,
  labelPosition = "end",
  style,
}: {
  control: ReactNode;
  label: string;
  disabled?: boolean;
  labelPosition?: "start" | "end";
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const labelText = (
    <T size="body" color={t.colors.fg}>
      {label}
    </T>
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {labelPosition === "start" ? labelText : null}
      {control}
      {labelPosition === "end" ? labelText : null}
    </div>
  );
}

export function FloatingPanel({
  children,
  side = "bottom",
  sideOffset = 4,
  xOffset = 0,
  minWidth,
  fit = "switch",
  padding = 4,
  gap = 2,
  style,
}: {
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  xOffset?: number;
  minWidth?: number;

  fit?: "switch" | "snap";
  padding?: number;
  gap?: number;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <anchored
      side={side}
      align="start"
      gap={sideOffset}
      offset={{ x: xOffset, y: 0 }}
      fit={fit}
      snapMargin={8}
      deferred={true}
      priority={1}
      occlude={true}
      style={{
        borderRadius: radii.card,
        backgroundColor: colors.view_bg,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap,
          padding,
          ...(minWidth !== undefined ? { minWidth } : {}),
          borderRadius: radii.card,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.view_bg,
          ...style,
        }}
      >
        {children}
      </div>
    </anchored>
  );
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
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 8,
        borderRadius: 6,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        hover: { backgroundColor: hoverBackgroundColor ?? colors.accentTint },
        ...style,
      }}
    >
      {leading ? <FieldSlot>{leading}</FieldSlot> : null}
      {icon ? (
        <Icon
          name={icon}
          size={14}
          color={iconColor ?? colors.fg}
          style={{ pointerEvents: "none" }}
        />
      ) : null}
      <T size="body" color={labelColor ?? colors.fg} style={{ flexGrow: 1 }}>
        {label}
      </T>
      {trailing ? <FieldSlot>{trailing}</FieldSlot> : null}
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
  const { colors } = t;
  if (kind === "radio") {
    return (
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: active ? colors.accent : colors.border,
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
              backgroundColor: colors.accent,
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
        borderColor: active ? colors.accent : colors.border,
        backgroundColor: active ? colors.accent : "transparent",
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
          color={colors.accent_fg}
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
    <T size="caption" color={t.colors.dim_fg} style={style}>
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
      <T size="caption" color={t.colors.dim_fg}>
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
        backgroundColor: t.colors.border,
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

const MenuRadioGroupCtx = createContext<MenuRadioGroupValue | null>(
  null,
);

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
  const { colors } = t;
  return (
    <MenuRow
      label={label}
      icon={icon}
      onClick={() => setOpen(!open)}
      trailing={
        <Icon
          name="chevronRight"
          size={12}
          color={colors.dim_fg}
          style={{ flexShrink: 0 }}
        />
      }
      style={{
        backgroundColor: open ? colors.accentTint : "transparent",
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
  const { colors } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        padding: 4,
        paddingRight: 8,
        backgroundColor: colors.view_bg,
        borderBottomWidth: 1,
        borderColor: colors.border,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Scrim({
  position = "fixed",
  onDismiss,
  style,
}: {
  position?: "absolute" | "fixed";
  onDismiss?: () => void;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={onDismiss}
      style={{
        position,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: isDarkScheme(t.scheme)
          ? "rgba(0,0,0,0.5)"
          : "rgba(0,0,0,0.3)",
        pointerEvents: "auto",
        ...style,
      }}
    />
  );
}

export function OverlayShell({
  position = "fixed",
  onDismiss,
  children,
  style,
}: {
  position?: "absolute" | "fixed";
  onDismiss?: () => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  return (
    <div
      style={{
        position,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        ...style,
      }}
    >
      <Scrim position={position} onDismiss={onDismiss} />
      {children}
    </div>
  );
}

export function OverlayPanel({
  position = "fixed",
  panelStyle,
  children,
}: {
  position?: "absolute" | "fixed";
  panelStyle?: Partial<StyleDesc>;
  children?: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        position,
        display: "flex",
        flexDirection: "column",
        backgroundColor: t.colors.view_bg,
        ...panelStyle,
      }}
    >
      {children}
    </div>
  );
}

export function CloseButton({
  children,
  onClick,
  style,
}: {
  children?: ReactNode;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: 6,
        cursor: "pointer",
        hover: { backgroundColor: colors.button_hover },
        ...style,
      }}
    >
      {children ?? <Icon name="close" size={14} color={colors.dim_fg} />}
    </div>
  );
}

export function OverlayTitle({
  children,
  style,
}: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <T size="title2" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  );
}

export function OverlayDescription({
  children,
  style,
}: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  );
}

export type SidePanelSide = "bottom" | "left" | "right" | "top";

export function sidePanelStyle(
  side: SidePanelSide,
  colors: Pick<AdwaitaTheme["colors"], "border">,
): Partial<StyleDesc> {
  switch (side) {
    case "left":
      return {
        top: 0,
        left: 0,
        height: "100%",
        width: 320,
        borderRightWidth: 1,
        borderColor: colors.border,
      };
    case "right":
      return {
        top: 0,
        right: 0,
        height: "100%",
        width: 320,
        borderLeftWidth: 1,
        borderColor: colors.border,
      };
    case "bottom":
      return {
        bottom: 0,
        left: 0,
        width: "100%",
        borderTopWidth: 1,
        borderColor: colors.border,
      };
    case "top":
      return {
        top: 0,
        left: 0,
        width: "100%",
        borderBottomWidth: 1,
        borderColor: colors.border,
      };
  }
}

export interface SegmentedOptionCellProps {
  active: boolean;
  icon?: IconName;
  iconSize?: number;
  iconActiveColor?: string;
  label?: string;
  labelActiveColor?: string;
  labelSize?: TextSize;
  style?: Partial<StyleDesc>;
}

export function SegmentedOptionCell({
  active,
  icon,
  iconSize = 16,
  iconActiveColor,
  label,
  labelActiveColor,
  labelSize = "body",
  style,
}: SegmentedOptionCellProps) {
  const t = useAdwaita();
  const dim = t.colors.dim_fg;
  return (
    <>
      {icon ? (
        <Icon
          name={icon}
          size={iconSize}
          color={active ? (iconActiveColor ?? t.colors.fg) : dim}
        />
      ) : null}
      {label ? (
        <T
          size={labelSize}
          weight={active ? 600 : 400}
          color={active ? (labelActiveColor ?? t.colors.fg) : dim}
          style={style}
        >
          {label}
        </T>
      ) : null}
    </>
  );
}

export function DisclosureTrigger({
  children,
  onToggle,
  iconSize = 14,
  iconPosition = "end",
  iconName = "chevronDown",
  disabled,
  style,
}: {
  children: ReactNode;
  onToggle?: () => void;
  iconSize?: number;
  iconPosition?: "start" | "end";
  iconName?: IconName;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const chevron = (
    <Icon
      name={iconName}
      size={iconSize}
      color={colors.dim_fg}
      style={{ flexShrink: 0, pointerEvents: "none" }}
    />
  );
  return (
    <div
      onClick={disabled ? undefined : onToggle}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") onToggle?.();
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.gap,
        minHeight: 36,
        borderRadius: radii.row,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        hover: disabled ? undefined : { backgroundColor: hexToRgba(colors.fg, 0.04) },
        ...style,
      }}
    >
      {iconPosition === "start" ? chevron : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        {children}
      </div>
      {iconPosition === "end" ? chevron : null}
    </div>
  );
}

export function CodeChip({
  children,
  padding = 4,
  centered = false,
  style,
}: {
  children: ReactNode;
  padding?: number;
  centered?: boolean;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const { colors, typography } = t;
  return (
    <div
      style={{
        display: "flex",
        ...(centered ? { alignItems: "center", justifyContent: "center" } : {}),
        padding,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.button_bg,
        ...style,
      }}
    >
      <T
        size="caption"
        color={colors.fg}
        style={{ fontFamily: typography.fontFamilyMono }}
      >
        {children}
      </T>
    </div>
  );
}

export function dialogCardStyle(
  t: AdwaitaTheme,
  opts: { gap?: number; minWidth?: number } = {},
): Partial<StyleDesc> {
  const { colors, radii } = t;
  const { gap = 12, minWidth = 320 } = opts;
  return {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap,
    padding: 20,
    minWidth,
    maxWidth: 480,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.view_bg,
  };
}

export function textFieldStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  const { colors, typography } = t;
  return {
    display: "flex",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.view_bg,
    fontSize: typography.body,
    fontFamily: typography.fontFamily,
    color: colors.fg,
    ...style,
  };
}

export function listPanelStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  const { colors, radii } = t;
  return {
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.view_bg,
    maxHeight: 200,
    ...style,
  };
}

export function selectTriggerStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  const { colors, radii } = t;
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 34,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.view_bg,
    cursor: "pointer",
    hover: { backgroundColor: colors.button_bg },
    ...style,
  };
}


export function inputShellStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  const { colors, radii } = t;
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    paddingLeft: 12,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.button_bg,
    ...style,
  };
}

export function destructiveRowProps(t: AdwaitaTheme) {
  const { colors } = t;
  return {
    labelColor: colors.destructive,
    iconColor: colors.destructive,
    hoverBackgroundColor: colors.destructiveTint,
  };
}

export interface MenuItemRowProps {
  label: string;
  icon?: IconName;
  onClick?: () => void;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  shortcut?: string;
  style?: Partial<StyleDesc>;
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

export function DisclosureContent({
  open,
  children,
  style,
}: {
  open: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const { spacing } = t;
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="disclosure-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            paddingLeft: spacing.paddingTight,
            paddingRight: spacing.gap,
            paddingTop: 0,
            paddingBottom: spacing.gap,
            ...style,
          }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export interface AdwaitaInputBaseProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  onSubmit?: () => void;

  mask?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  style?: Partial<StyleDesc>;
  testId?: string;
}

export function resolveFieldBorderColor(
  disabled: boolean | undefined,
  focused: boolean,
  invalid: boolean | undefined,
  colors: AdwaitaTheme["colors"],
): string {
  if (disabled) return colors.border;
  if (focused) return colors.accent;
  if (invalid) return colors.destructive;
  return colors.border;
}

function InputOverlay({
  testId,
  value,
  placeholder,
  autoFocus,
  disabled,
  accent,
  onFocus,
  onBlur,
  onChange,
  onSubmit,
}: {
  testId?: string;
  value: string;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  accent: string;
  onFocus: () => void;
  onBlur: () => void;
  onChange: ((event: { value?: string }) => void) | undefined;
  onSubmit?: () => void;
}) {
  return (
    <input
      {...(testId ? { testId } : {})}
      value={value}
      placeholder={placeholder}
      autoFocus={autoFocus && !disabled ? true : undefined}
      readOnly={disabled}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={disabled ? undefined : onChange}
      onSubmit={disabled ? undefined : onSubmit}
      theme={{ caret: accent }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0,
        borderWidth: 0,
        backgroundColor: "transparent",
      }}
    />
  );
}

function InputDisplay({
  displayed,
  placeholder,
  showPlaceholder,
  colors,
}: {
  displayed: string;
  placeholder?: string;
  showPlaceholder: boolean;
  colors: AdwaitaTheme["colors"];
}) {
  if (displayed.length === 0 && !showPlaceholder) return null;
  return (
    <T
      size="body"
      color={showPlaceholder ? colors.dim_fg : colors.fg}
      style={{
        flexShrink: 1,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {displayed || placeholder}
    </T>
  );
}

export function AdwaitaInputBase({
  value,
  onChange,
  placeholder,
  disabled,
  invalid,
  autoFocus,
  onSubmit,
  mask,
  leading,
  trailing,
  style,
  testId,
}: AdwaitaInputBaseProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const [internal, setInternal] = useState<string>(value ?? "");
  const [focused, setFocused] = useState(false);
  const current = value ?? internal;

  const displayed = mask ? "•".repeat(current.length) : current;
  const showPlaceholder = current.length === 0 && placeholder !== undefined;
  const borderColor = resolveFieldBorderColor(disabled, focused, invalid, colors);

  const handleChange = (event: { value?: string }) => {
    const next = event.value ?? "";
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  const focusRing = focused
    ? {
        boxShadow: {
          offsetX: 0,
          offsetY: 0,
          blurRadius: 8,
          spreadRadius: 0,
          color: hexToRgba(colors.accent, 0.4),
        },
      }
    : {};

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
        minHeight: 34,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor,
        backgroundColor: colors.view_bg,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "text",
        ...focusRing,
        ...style,
      }}
    >
      {leading ? <FieldSlot>{leading}</FieldSlot> : null}
      <InputOverlay
        testId={testId}
        value={current}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        accent={colors.accent}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      <InputDisplay
        displayed={displayed}
        placeholder={placeholder}
        showPlaceholder={showPlaceholder}
        colors={colors}
      />
      {trailing ? <FieldSlot>{trailing}</FieldSlot> : null}
    </div>
  );
}
