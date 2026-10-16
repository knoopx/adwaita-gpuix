import { createContext, useContext, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba, isDarkScheme, type AdwaitaTheme } from '../theme/adwaita'
import { Icon, type IconName } from './icons'

export type TextSize = 'title1' | 'title2' | 'title3' | 'title4' | 'body' | 'caption'

export interface TextProps {
  size?: TextSize
  weight?: string | number
  color?: string
  align?: 'left' | 'center' | 'right'
  clamp?: number
  style?: Partial<StyleDesc>
  children: ReactNode
}

/**
 * A GPUix `<text>` with an explicit colour. GPUI does not inherit colour, so
 * every text node sets one — this defaults it to the theme foreground.
 */
export function T({ size = 'body', weight, color, align, clamp, style, children }: TextProps) {
  const t = useAdwaita()
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
  )
}

/** A section heading used across the showcase (title4, dim). */
export function SectionTitle({ children }: { children: ReactNode }) {
  const t = useAdwaita()
  return (
    <text
      style={{
        fontSize: t.typography.caption,
        fontFamily: t.typography.fontFamily,
        fontWeight: 700,
        color: t.colors.dim_fg,
      }}
    >
      {children}
    </text>
  )
}

/** A `SectionTitle` label above a flex row (or column) of variants. */
export function Row({ label, children, col = false }: { label: string; children: ReactNode; col?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SectionTitle>{label}</SectionTitle>
      <div style={{ display: 'flex', flexDirection: col ? 'column' : 'row', gap: 16, alignItems: 'center' }}>
        {children}
      </div>
    </div>
  )
}

/**
 * A bounded `position: relative` stage that contains an open floating panel
 * (Dialog/Drawer/Sheet rendered with `contained`), so the panel + scrim sit
 * fully inside the stage in static renders.
 */
export function FloatingStage({
  children,
  width = 420,
  height = 320,
}: {
  children: ReactNode
  width?: number
  height?: number
}) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}

/* ── Shared overlay / menu building blocks ─────────────────────────────── */

/** Card shadow used by floating panels and dropdown lists. */
export const cardShadow = {
  offsetX: 0,
  offsetY: 4,
  blurRadius: 12,
  spreadRadius: 0,
  color: 'rgba(0,0,0,0.15)',
} as const

/**
 * A bordered card panel anchored to a positioned parent — the shared shell
 * behind Popover / HoverCard / DropdownMenu / ContextMenu / NavigationMenu
 * content and Menubar popdowns.
 */
export function FloatingPanel({
  children,
  side = 'bottom',
  sideOffset = 4,
  xOffset = 0,
  minWidth,
  padding = 4,
  gap = 2,
  style,
}: {
  children?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  xOffset?: number
  minWidth?: number
  padding?: number
  gap?: number
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  const { colors, radii } = t
  return (
    <anchored side={side} offset={{ x: xOffset, y: sideOffset }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap,
          padding,
          ...(minWidth !== undefined ? { minWidth } : {}),
          borderRadius: radii.card,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.view_bg,
          boxShadow: cardShadow,
          ...style,
        }}
      >
        {children}
      </div>
    </anchored>
  )
}

/**
 * A menu row: optional leading node (indicator), optional icon, a body-text
 * label, and an optional trailing node. Shared by DropdownMenuItem,
 * ContextMenuItem, MenubarItem/Trigger, NavigationMenuLink, and CommandItem.
 *
 * `labelColor` / `iconColor` override the default foreground (destructive
 * variants); `hoverBackgroundColor` overrides the accentTint hover wash.
 */
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
  label: string
  icon?: IconName
  leading?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  disabled?: boolean
  labelColor?: string
  iconColor?: string
  hoverBackgroundColor?: string
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        borderRadius: 6,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        hover: { backgroundColor: hoverBackgroundColor ?? colors.accentTint },
        ...style,
      }}
    >
      {leading}
      {icon ? <Icon name={icon} size={14} color={iconColor ?? colors.fg} /> : null}
      <T size="body" color={labelColor ?? colors.fg}>
        {label}
      </T>
      {trailing}
    </div>
  )
}

/**
 * The 16×16 leading indicator for checkbox / radio menu rows: a rounded box
 * (checkbox) or circle (radio) that fills with the accent and shows a check
 * icon / inner dot when active. Shared by the DropdownMenu / ContextMenu /
 * Menubar checkbox + radio items (extracted so the markup lives in one place).
 */
export function MenuIndicator({
  kind = 'checkbox',
  active,
  style,
}: {
  kind?: 'checkbox' | 'radio'
  active: boolean
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  const { colors } = t
  if (kind === 'radio') {
    return (
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: active ? colors.accent : colors.border,
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        {active ? (
          <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent }} />
        ) : null}
      </div>
    )
  }
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: active ? colors.accent : colors.border,
        backgroundColor: active ? colors.accent : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {active ? <Icon name="success" size={10} color={colors.accent_fg} /> : null}
    </div>
  )
}

/** A trailing keyboard-shortcut hint for a menu row (caption, dim). */
export function MenuShortcut({ children, style }: { children: ReactNode; style?: Partial<StyleDesc> }) {
  const t = useAdwaita()
  return (
    <T size="caption" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

/** A caption-dim label above a menu group (DropdownMenuLabel / MenubarLabel). */
export function MenuLabel({ children, style }: { children: ReactNode; style?: Partial<StyleDesc> }) {
  const t = useAdwaita()
  return (
    <div style={{ padding: 8, paddingBottom: 4, ...style }}>
      <T size="caption" color={t.colors.dim_fg}>{children}</T>
    </div>
  )
}

/** A 1px horizontal separator between menu groups. */
export function MenuSeparator({ style }: { style?: Partial<StyleDesc> }) {
  const t = useAdwaita()
  return (
    <div
      style={{
        height: 1,
        backgroundColor: t.colors.border,
        margin: 4,
        ...style,
      }}
    />
  )
}

/* ── Menu family shared components (ContextMenu / DropdownMenu / Menubar) ── */

/** A column of menu entries (flex, gap 2). Shared by the Group / RadioGroup
 *  wrappers of the ContextMenu / DropdownMenu / Menubar families. */
export function MenuGroup({ children, style }: { children?: ReactNode; style?: Partial<StyleDesc> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, ...style }}>
      {children}
    </div>
  )
}

export interface MenuRadioGroupValue {
  value: string | undefined
  onSelect: (value: string) => void
}

/**
 * The shared menu radio-group context: one selection shared by all menu
 * radio items (the menu families do not nest across each other, so a
 * single context serves all three).
 */
export const MenuRadioGroupCtx = createContext<MenuRadioGroupValue | null>(null)

/** Read the surrounding menu radio-group context (null outside a group). */
export function useMenuRadioGroup(): MenuRadioGroupValue | null {
  return useContext(MenuRadioGroupCtx)
}

/** Controlled / uncontrolled radio-selection state (the shared group logic). */
export function useMenuRadioGroupState(
  value: string | undefined,
  defaultValue: string | undefined,
  onValueChange?: (value: string) => void,
) {
  const [internal, setInternal] = useState<string | undefined>(value ?? defaultValue)
  const current = value ?? internal
  const onSelect: MenuRadioGroupValue['onSelect'] = (v: string) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }
  return { current, onSelect }
}

/**
 * The radio-group shell shared by the menu family: controlled / uncontrolled
 * selection state + the context provider + the column wrapper.
 */
export function MenuRadioGroupShell({
  value,
  defaultValue,
  onValueChange,
  children,
  style,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: ReactNode
  style?: Partial<StyleDesc>
}) {
  const { current, onSelect } = useMenuRadioGroupState(value, defaultValue, onValueChange)
  return (
    <MenuRadioGroupCtx.Provider value={{ value: current, onSelect }}>
      <MenuGroup style={style}>{children}</MenuGroup>
    </MenuRadioGroupCtx.Provider>
  )
}

/**
 * A radio menu row: a MenuRow with a radio MenuIndicator. The selection
 * derives from the surrounding group's state when `selected` is omitted.
 */
export function MenuRadioRow({
  label,
  value,
  selected,
  group,
  onSelect,
  onAfterSelect,
  style,
}: {
  label: string
  value?: string
  selected?: boolean
  group?: MenuRadioGroupValue | null
  onSelect?: () => void
  /** Fired after the select (e.g. the menu's close handler). */
  onAfterSelect?: () => void
  style?: Partial<StyleDesc>
}) {
  const isSelected = selected ?? (value !== undefined && group?.value === value)
  return (
    <MenuRow
      label={label}
      leading={<MenuIndicator kind="radio" active={isSelected} />}
      onClick={() => {
        if (value !== undefined && group) group.onSelect(value)
        onSelect?.()
        onAfterSelect?.()
      }}
      style={style}
    />
  )
}

export interface MenuRadioItemProps {
  label: string
  value?: string
  selected?: boolean
  onSelect?: () => void
  style?: Partial<StyleDesc>
}

/**
 * Builds a menu family's radio-item component: a MenuRadioRow wired to the
 * surrounding menu context's close-on-select behaviour. The family hook
 * (e.g. useContextMenu / useDropdownMenu) supplies `onOpenChange`.
 */
export function makeMenuRadioItem(useFamily: () => { onOpenChange?: (open: boolean) => void }) {
  return function MenuRadioItem({ label, value, selected, onSelect, style }: MenuRadioItemProps) {
    const { onOpenChange } = useFamily()
    const group = useMenuRadioGroup()
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
    )
  }
}

/**
 * A nested sub-menu shared by the menu family: a positioned column wrapper
 * that owns the open/close state of its trigger + content (GPUix has no DOM
 * sub-menu portal; the anchored panel is the idiom).
 */
export interface MenuSubValue {
  open: boolean
  setOpen: (open: boolean) => void
}

export const MenuSubCtx = createContext<MenuSubValue | null>(null)

export function useMenuSub(): MenuSubValue {
  const ctx = useContext(MenuSubCtx)
  if (!ctx) throw new Error('MenuSub components must be used within <MenuSub>')
  return ctx
}

export function MenuSub({ children, style }: { children?: ReactNode; style?: Partial<StyleDesc> }) {
  const [open, setOpen] = useState(false)
  return (
    <MenuSubCtx.Provider value={{ open, setOpen }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', ...style }}>
        {children}
      </div>
    </MenuSubCtx.Provider>
  )
}

/** The row that toggles a sub-menu open/closed, with a chevron trailing. */
export function MenuSubTrigger({
  label,
  icon,
  rowStyle,
  style,
}: {
  label: string
  icon?: IconName
  /** Extra row style layered under the caller's `style` (e.g. Menubar's tighter padding). */
  rowStyle?: Partial<StyleDesc>
  style?: Partial<StyleDesc>
}) {
  const { open, setOpen } = useMenuSub()
  const t = useAdwaita()
  const { colors } = t
  return (
    <MenuRow
      label={label}
      icon={icon}
      onClick={() => setOpen(!open)}
      trailing={<Icon name="chevronRight" size={12} color={colors.dim_fg} style={{ flexShrink: 0 }} />}
      style={{ backgroundColor: open ? colors.accentTint : 'transparent', ...rowStyle, ...style }}
    />
  )
}

/** The anchored panel of a sub-menu, shown only while the sub is open. */
export function MenuSubContent({ children, style }: { children?: ReactNode; style?: Partial<StyleDesc> }) {
  const { open } = useMenuSub()

  if (!open) return null

  return (
    <FloatingPanel side="right" sideOffset={4} minWidth={160} style={style}>
      {children}
    </FloatingPanel>
  )
}

/**
 * The top bar container shared by Menubar and NavigationMenu: a view_bg row
 * with a 1px bottom border.
 */
export function MenuBarShell({ children, style }: { children?: ReactNode; style?: Partial<StyleDesc> }) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
  )
}

/**
 * The scheme-aware scrim that sits behind an open Dialog / Drawer / Sheet:
 * a full-size overlay (fixed, or absolute when contained to a stage).
 */
export function Scrim({
  position = 'fixed',
  onDismiss,
  style,
}: {
  position?: 'absolute' | 'fixed'
  onDismiss?: () => void
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  return (
    <div
      onClick={onDismiss}
      style={{
        position,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: isDarkScheme(t.scheme) ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
        pointerEvents: 'auto',
        ...style,
      }}
    />
  )
}

/**
 * A full-size positioned wrapper (fixed, or absolute when contained) that
 * holds a scrim plus an open overlay panel. Shared by Drawer and Sheet.
 */
export function OverlayShell({
  position = 'fixed',
  onDismiss,
  children,
  style,
}: {
  position?: 'absolute' | 'fixed'
  onDismiss?: () => void
  children?: ReactNode
  style?: Partial<StyleDesc>
}) {
  return (
    <div
      style={{
        position,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        ...style,
      }}
    >
      <Scrim position={position} onDismiss={onDismiss} />
      {children}
    </div>
  )
}

/**
 * The body of an open overlay panel: a full-size positioned view_bg flex
 * column. Shared by Drawer and Sheet (the scrim + wrapper live in
 * OverlayShell).
 */
export function OverlayPanel({
  position = 'fixed',
  panelStyle,
  children,
}: {
  position?: 'absolute' | 'fixed'
  panelStyle?: Partial<StyleDesc>
  children?: ReactNode
}) {
  const t = useAdwaita()
  return (
    <div
      style={{
        position,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: t.colors.view_bg,
        ...panelStyle,
      }}
    >
      {children}
    </div>
  )
}

/**
 * A bottom-anchored footer shared by Drawer / Sheet: a flexGrow:1 spacer
 * pushes the column of actions (gap 8, padding 16) to the panel's bottom
 * edge.
 */
export function OverlayFooter({ children, style }: { children?: ReactNode; style?: Partial<StyleDesc> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ flexGrow: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>{children}</div>
    </div>
  )
}

/**
 * A 24×24 hoverable close button (dim close icon by default). Shared by
 * DialogClose / DrawerClose / SheetClose.
 */
export function CloseButton({
  children,
  onClick,
  style,
}: {
  children?: ReactNode
  onClick?: () => void
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: 6,
        cursor: 'pointer',
        hover: { backgroundColor: colors.button_hover },
        ...style,
      }}
    >
      {children ?? <Icon name="close" size={14} color={colors.dim_fg} />}
    </div>
  )
}

/**
 * A chevroned disclosure row (accordion / collapsible trigger): a labelled
 * row with a rotating chevron at the start or end that toggles on click or
 * Enter/Space.
 */
export function DisclosureTrigger({
  children,
  onToggle,
  iconSize = 14,
  iconPosition = 'end',
  style,
}: {
  children: ReactNode
  onToggle?: () => void
  iconSize?: number
  iconPosition?: 'start' | 'end'
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={onToggle}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onToggle?.()
      }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minHeight: 36,
        borderRadius: 6,
        cursor: 'pointer',
        hover: { backgroundColor: hexToRgba(colors.fg, 0.04) },
        ...style,
      }}
    >
      {iconPosition === 'start' ? <Icon name="chevronDown" size={iconSize} color={colors.dim_fg} style={{ flexShrink: 0 }} /> : null}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>{children}</div>
      {iconPosition === 'end' ? <Icon name="chevronDown" size={iconSize} color={colors.dim_fg} style={{ flexShrink: 0 }} /> : null}
    </div>
  )
}

/**
 * A bordered monospace code chip (kbd key cap / inline code): button_bg
 * background, 1px border, radius 4, caption-mono text.
 */
export function CodeChip({
  children,
  padding = 4,
  centered = false,
  style,
}: {
  children: ReactNode
  padding?: number
  centered?: boolean
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  const { colors, typography } = t
  return (
    <div
      style={{
        display: 'flex',
        ...(centered ? { alignItems: 'center', justifyContent: 'center' } : {}),
        padding,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.button_bg,
        ...style,
      }}
    >
      <T size="caption" color={colors.fg} style={{ fontFamily: typography.fontFamilyMono }}>
        {children}
      </T>
    </div>
  )
}

/* ── Shared style factories ────────────────────────────────────────────── */

/**
 * The dialog card panel style shared by Dialog / AlertDialog: a view_bg
 * column with card radius, 1px border, 480 max width, and the elevated
 * card shadow.
 */
export function dialogCardStyle(
  t: AdwaitaTheme,
  opts: { gap?: number; minWidth?: number } = {},
): Partial<StyleDesc> {
  const { colors, radii } = t
  const { gap = 12, minWidth = 320 } = opts
  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap,
    padding: 20,
    minWidth,
    maxWidth: 480,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.view_bg,
    boxShadow: { offsetX: 0, offsetY: 8, blurRadius: 24, spreadRadius: 0, color: 'rgba(0,0,0,0.18)' },
  }
}

/**
 * Base style for a bordered text field (Input / Textarea / ComboboxInput):
 * 1px border, view_bg, theme font. Callers add padding, radius, opacity.
 */
export function textFieldStyle(t: AdwaitaTheme, style?: Partial<StyleDesc>): Partial<StyleDesc> {
  const { colors, typography } = t
  return {
    display: 'flex',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.view_bg,
    fontSize: typography.body,
    fontFamily: typography.fontFamily,
    color: colors.fg,
    ...style,
  }
}

/**
 * Bordered card panel style for dropdown lists (Select / Combobox /
 * NativeSelect content): card radius, 1px border, view_bg, card shadow,
 * 200px max height.
 */
export function listPanelStyle(t: AdwaitaTheme, style?: Partial<StyleDesc>): Partial<StyleDesc> {
  const { colors, radii } = t
  return {
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.view_bg,
    boxShadow: cardShadow,
    maxHeight: 200,
    ...style,
  }
}

/** Pill-shaped select trigger style (SelectTrigger / NativeSelect). */
export function selectTriggerStyle(t: AdwaitaTheme, style?: Partial<StyleDesc>): Partial<StyleDesc> {
  const { colors, radii } = t
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 34,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.view_bg,
    cursor: 'pointer',
    hover: { backgroundColor: colors.button_bg },
    ...style,
  }
}

/**
 * Pill input shell style (CommandInput, DatePicker trigger): 1px border,
 * button_bg, 8px padding with 12px left inset. Callers add cursor/hover.
 */
export function inputShellStyle(t: AdwaitaTheme, style?: Partial<StyleDesc>): Partial<StyleDesc> {
  const { colors, radii } = t
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    paddingLeft: 12,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.button_bg,
    ...style,
  }
}

/**
 * The destructive-variant colour overrides for a menu row (label / icon /
 * hover wash). Shared by DropdownMenuItem / MenubarItem.
 */
export function destructiveRowProps(t: AdwaitaTheme) {
  const { colors } = t
  return {
    labelColor: colors.destructive,
    iconColor: colors.destructive,
    hoverBackgroundColor: colors.destructiveTint,
  }
}

/* ── Shared input field ────────────────────────────────────────────────── */

export interface AdwaitaInputBaseProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  autoFocus?: boolean
  onSubmit?: () => void
  style?: Partial<StyleDesc>
}

/**
 * The GPUix text-field base shared by the Input / Entry pair: rounded
 * border, view_bg, theme font, accent caret. `disabled` dims the field
 * (opacity 0.5) and makes it read-only; `invalid` switches the border to
 * destructive. Callers layer padding / radius via `style`.
 */
export function AdwaitaInputBase({ value, onChange, placeholder, disabled, invalid, autoFocus, onSubmit, style }: AdwaitaInputBaseProps) {
  const t = useAdwaita()
  const { colors, typography, radii } = t
  return (
    <input
      value={value}
      placeholder={placeholder}
      autoFocus={autoFocus && !disabled ? true : undefined}
      readOnly={disabled}
      onChange={disabled ? undefined : (event) => onChange?.(event.value ?? '')}
      onSubmit={disabled ? undefined : onSubmit}
      theme={{ caret: colors.accent }}
      style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: 34,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: invalid ? colors.destructive : colors.border,
        backgroundColor: colors.view_bg,
        fontSize: typography.body,
        fontFamily: typography.fontFamily,
        color: colors.fg,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'text',
        ...style,
      }}
    />
  )
}
