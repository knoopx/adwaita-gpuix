import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba, shade, isDarkScheme, type AdwaitaTheme } from '../theme/adwaita'
import { T } from './common'
import { Icon, type IconName } from './icons'

export type ButtonVariant = 'default' | 'suggested' | 'destructive' | 'pill' | 'text' | 'icon' | 'secondary'

export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'

const BUTTON_SIZE_HEIGHT: Record<ButtonSize, number> = {
  sm: 28,
  default: 34,
  lg: 40,
  icon: 34,
}

export interface ButtonProps {
  variant?: ButtonVariant

  size?: ButtonSize
  label?: string
  icon?: IconName
  onClick?: () => void
  disabled?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

interface ButtonVariantTheme {
  bg: string
  fg: string
  hoverBg: string
  activeBg: string
  border: string
}

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
        activeBg: hexToRgba(colors.accent, isDarkScheme(scheme) ? 0.3 : 0.2),
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

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const ButtonShot: ComponentShot = {
  name: 'Button',
  el: (
    <Shot>
      <Row label="Variants" col>
        <ShotItem label="default"><Button label="Default" onClick={() => {}} /></ShotItem>
        <ShotItem label="suggested"><Button variant="suggested" label="Suggested" onClick={() => {}} /></ShotItem>
        <ShotItem label="destructive"><Button variant="destructive" label="Destructive" onClick={() => {}} /></ShotItem>
        <ShotItem label="pill"><Button variant="pill" label="Pill" onClick={() => {}} /></ShotItem>
        <ShotItem label="text"><Button variant="text" label="Text" onClick={() => {}} /></ShotItem>
        <ShotItem label="icon"><Button variant="icon" icon="settings" onClick={() => {}} /></ShotItem>
        <ShotItem label="secondary"><Button variant="secondary" label="Secondary" onClick={() => {}} /></ShotItem>
      </Row>
      <Row label="Sizes">
        <ShotItem label="sm (28)"><Button size="sm" label="Save" onClick={() => {}} /></ShotItem>
        <ShotItem label="default (34)"><Button label="Save" onClick={() => {}} /></ShotItem>
        <ShotItem label="lg (40)"><Button size="lg" label="Save" onClick={() => {}} /></ShotItem>
        <ShotItem label="icon (square)"><Button size="icon" icon="settings" onClick={() => {}} /></ShotItem>
      </Row>
      <Row label="States">
        <ShotItem label="disabled"><Button label="Disabled" disabled onClick={() => {}} /></ShotItem>
        <ShotItem label="icon + label"><Button icon="settings" label="Save" onClick={() => {}} /></ShotItem>
        <ShotItem label="children slot">
          <Button label="Add"><T size="caption" weight={700}>+1</T></Button>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
