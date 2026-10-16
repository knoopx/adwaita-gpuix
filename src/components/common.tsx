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

export interface TextPartProps {
  size?: TextSize
  weight?: string | number

  dim?: boolean
  style?: Partial<StyleDesc>
  children: ReactNode
}

export function TextPart({ size = 'body', weight, dim, style, children }: TextPartProps) {
  const t = useAdwaita()
  return (
    <T size={size} weight={weight} color={dim ? t.colors.dim_fg : t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export function LabeledControl({
  control,
  label,
  disabled,
  style,
}: {
  control: ReactNode
  label: string
  disabled?: boolean
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {control}
      <T size="body" color={t.colors.fg}>{label}</T>
    </div>
  )
}

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

export function Shot({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>{children}</div>
}

export function ShotItem({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>{label}</T>
      {children}
    </div>
  )
}

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
          ...style,
        }}
      >
        {children}
      </div>
    </anchored>
  )
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

export function MenuShortcut({ children, style }: { children: ReactNode; style?: Partial<StyleDesc> }) {
  const t = useAdwaita()
  return (
    <T size="caption" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

export function MenuLabel({ children, style }: { children: ReactNode; style?: Partial<StyleDesc> }) {
  const t = useAdwaita()
  return (
    <div style={{ padding: 8, paddingBottom: 4, ...style }}>
      <T size="caption" color={t.colors.dim_fg}>{children}</T>
    </div>
  )
}

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

export const MenuRadioGroupCtx = createContext<MenuRadioGroupValue | null>(null)

export function useMenuRadioGroup(): MenuRadioGroupValue | null {
  return useContext(MenuRadioGroupCtx)
}

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

export function MenuSubTrigger({
  label,
  icon,
  rowStyle,
  style,
}: {
  label: string
  icon?: IconName

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

export function MenuSubContent({ children, style }: { children?: ReactNode; style?: Partial<StyleDesc> }) {
  const { open } = useMenuSub()

  if (!open) return null

  return (
    <FloatingPanel side="right" sideOffset={4} minWidth={160} style={style}>
      {children}
    </FloatingPanel>
  )
}

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

export function OverlayFooter({ children, style }: { children?: ReactNode; style?: Partial<StyleDesc> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ flexGrow: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>{children}</div>
    </div>
  )
}

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
  }
}

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

export function listPanelStyle(t: AdwaitaTheme, style?: Partial<StyleDesc>): Partial<StyleDesc> {
  const { colors, radii } = t
  return {
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.view_bg,
    maxHeight: 200,
    ...style,
  }
}

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

export function destructiveRowProps(t: AdwaitaTheme) {
  const { colors } = t
  return {
    labelColor: colors.destructive,
    iconColor: colors.destructive,
    hoverBackgroundColor: colors.destructiveTint,
  }
}

export interface AdwaitaInputBaseProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  autoFocus?: boolean
  onSubmit?: () => void
  /** Mask the displayed value with bullet characters (password entries). */
  mask?: boolean
  style?: Partial<StyleDesc>
  testId?: string
}

export function AdwaitaInputBase({ value, onChange, placeholder, disabled, invalid, autoFocus, onSubmit, mask, style, testId }: AdwaitaInputBaseProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  const [internal, setInternal] = useState<string>(value ?? '')
  const [focused, setFocused] = useState(false)
  const current = value ?? internal

  const displayed = mask ? '•'.repeat(current.length) : current
  const showPlaceholder = current.length === 0 && placeholder !== undefined
  const borderColor = disabled ? colors.border : focused ? colors.accent : invalid ? colors.destructive : colors.border

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        minHeight: 34,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor,
        backgroundColor: colors.view_bg,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
        ...style,
      }}
    >
      {/* Native editor: invisible but hit-testable, covers the whole shell. */}
      <input
        {...(testId ? { testId } : {})}
        value={current}
        placeholder={placeholder}
        autoFocus={autoFocus && !disabled ? true : undefined}
        readOnly={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={disabled ? undefined : (event) => {
          const next = event.value ?? ''
          if (value === undefined) setInternal(next)
          onChange?.(next)
        }}
        onSubmit={disabled ? undefined : onSubmit}
        theme={{ caret: colors.accent }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          borderWidth: 0,
          backgroundColor: 'transparent',
        }}
      />
      {/* Visual layer: the value (masked) or the dim placeholder. */}
      {displayed.length > 0 || showPlaceholder ? (
        <T
          size="body"
          color={showPlaceholder ? colors.dim_fg : colors.fg}
          style={{
            flexShrink: 1,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {displayed || placeholder}
        </T>
      ) : null}
    </div>
  )
}
