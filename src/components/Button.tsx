import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba, shade, type AdwaitaTheme } from '../theme/adwaita'
import { T } from './common'
import { Icon, type IconName } from './icons'

export type ButtonVariant = 'default' | 'suggested' | 'destructive' | 'pill' | 'text' | 'icon' | 'secondary'

/** Button size: a height axis plus a square `icon` form. */
export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'

/** Minimum height (px) for each button size. */
const BUTTON_SIZE_HEIGHT: Record<ButtonSize, number> = {
  sm: 28,
  default: 34,
  lg: 40,
  icon: 34,
}

export interface ButtonProps {
  variant?: ButtonVariant
  /** Height axis (`sm` 28 / `default` 34 / `lg` 40); `icon` = square (width = height, no padding). */
  size?: ButtonSize
  label?: string
  icon?: IconName
  onClick?: () => void
  disabled?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** Colour theme for a button variant (bg/fg plus hover & pressed states). */
interface ButtonVariantTheme {
  bg: string
  fg: string
  hoverBg: string
  activeBg: string
  border: string
}

/** Resolve the colour theme for a variant (`default` and `pill` share the base). */
function resolveVariantTheme(variant: ButtonVariant, t: AdwaitaTheme): ButtonVariantTheme {
  const { colors, scheme } = t
  switch (variant) {
    case 'suggested':
      return {
        bg: colors.accent,
        fg: colors.accent_fg,
        hoverBg: shade(colors.accent, -0.08),
        activeBg: shade(colors.accent, -0.18),
        border: colors.border,
      }
    case 'destructive':
      return {
        bg: colors.destructive,
        fg: colors.destructive_fg,
        hoverBg: shade(colors.destructive, -0.08),
        activeBg: shade(colors.destructive, -0.18),
        border: colors.border,
      }
    case 'text':
      return {
        bg: 'transparent',
        fg: colors.accent,
        hoverBg: colors.accentTint,
        activeBg: hexToRgba(colors.accent, scheme === 'dark' ? 0.3 : 0.2),
        border: 'transparent',
      }
    case 'icon':
      return {
        bg: 'transparent',
        fg: colors.fg,
        hoverBg: hexToRgba(colors.fg, 0.08),
        activeBg: hexToRgba(colors.fg, 0.16),
        border: 'transparent',
      }
    case 'secondary':
      return {
        bg: colors.button_bg,
        fg: colors.fg,
        hoverBg: colors.button_hover,
        activeBg: colors.button_active,
        border: colors.border,
      }
    default:
      return {
        bg: colors.button_bg,
        fg: colors.fg,
        hoverBg: colors.button_hover,
        activeBg: colors.button_active,
        border: colors.border,
      }
  }
}

/** Full style for an Adwaita button: variant colours, size, pill/flat shape, disabled state. */
function buttonStyle(
  t: AdwaitaTheme,
  variant: ButtonVariant,
  size: ButtonSize,
  disabled?: boolean,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  const { radii } = t
  const theme = resolveVariantTheme(variant, t)
  const pill = variant === 'pill'
  const flat = variant === 'text' || variant === 'icon'
  const minHeight = BUTTON_SIZE_HEIGHT[size]
  const isIcon = size === 'icon'
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight,
    ...(isIcon ? { width: minHeight, padding: 0 } : {}),
    paddingLeft: isIcon ? 0 : pill ? 16 : 14,
    paddingRight: isIcon ? 0 : pill ? 16 : 14,
    borderRadius: isIcon ? radii.button : pill ? radii.pill : radii.button,
    borderWidth: flat ? 0 : 1,
    borderColor: theme.border,
    backgroundColor: theme.bg,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'default' : 'pointer',
    hover: disabled ? undefined : { backgroundColor: theme.hoverBg },
    active: disabled ? undefined : { backgroundColor: theme.activeBg },
    ...style,
  }
}

/**
 * Adwaita button. There is no `<button>` element in GPUix — interaction is a
 * `<div onClick>` with a pointer cursor.
 *
 * **Variants:** `suggested` = accent (primary), `destructive` = red,
 * `default`/`secondary` = bordered neutral (`button_bg`), `pill` = full
 * radius shape, `text` = flat accent label, `icon` = symbolic flat.
 *
 * **Size axis** (`size`): `sm` (28) / `default` (34) / `lg` (40); `icon` is a
 * square form (width = height, no padding). Note the API-shape mismatch with
 * shadcn: here `icon` is a **size**, not a variant — a square icon button is
 * `size="icon"` (optionally with `variant="text"`/`variant="icon"` for a
 * flat look), NOT `variant="icon"`.
 */
export function Button({
  variant = 'default',
  size = 'default',
  label,
  icon,
  onClick,
  disabled,
  children,
  style,
}: ButtonProps) {
  const t = useAdwaita()
  const fg = resolveVariantTheme(variant, t).fg

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={buttonStyle(t, variant, size, disabled, style)}
    >
      {icon ? <Icon name={icon} size={size === 'lg' ? 18 : 16} color={fg} /> : null}
      {label ? (
        <T size="body" weight={600} color={fg}>
          {label}
        </T>
      ) : null}
      {children}
    </div>
  )
}
