import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, type AdwaitaColors } from '../theme/adwaita'
import { T } from './common'
import { Button } from './Button'
import { Icon, type IconName } from './icons'

export type BannerTone = 'info' | 'warning' | 'error' | 'success'

export type BannerVariant = 'default' | 'destructive'

function variantToTone(variant: BannerVariant): BannerTone {
  return variant === 'destructive' ? 'error' : 'info'
}

export interface BannerProps {
  title: string
  body?: string
  tone?: BannerTone

  variant?: BannerVariant
  actionLabel?: string
  onAction?: () => void
  onClose?: () => void

  narrow?: boolean
  style?: Partial<StyleDesc>
}

interface BannerToneTheme {
  bg: string
  fg: string
  icon: IconName
}

function resolveToneTheme(tone: BannerTone, colors: AdwaitaColors): BannerToneTheme {
  switch (tone) {
    case 'warning':
      return { bg: colors.warningTint, fg: colors.warning, icon: 'warning' }
    case 'error':
      return { bg: colors.destructiveTint, fg: colors.destructive, icon: 'alert' }
    case 'success':
      return { bg: colors.successTint, fg: colors.success, icon: 'success' }
    default:
      return { bg: colors.accentTint, fg: colors.accent, icon: 'info' }
  }
}

function BannerBody({ title, body, tone }: { title: string; body?: string; tone: BannerToneTheme }) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name={tone.icon} size={18} color={tone.fg} />
        <T size="body" weight={700} color={colors.fg}>
          {title}
        </T>
      </div>
      {body ? (
        <T size="caption" color={colors.dim_fg}>
          {body}
        </T>
      ) : null}
    </div>
  )
}

function BannerClose({ onClick }: { onClick: () => void }) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={onClick}
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        hover: { backgroundColor: 'rgba(0,0,0,0.08)' },
      }}
    >
      <Icon name="close" size={16} color={colors.dim_fg} />
    </div>
  )
}

export interface BannerTitleProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function BannerTitle({ children, style }: BannerTitleProps) {
  const t = useAdwaita()
  return (
    <T size="body" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export interface BannerDescriptionProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function BannerDescription({ children, style }: BannerDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="caption" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

export function Banner({
  title,
  body,
  tone,
  variant,
  actionLabel,
  onAction,
  onClose,
  narrow,
  style,
}: BannerProps) {
  const t = useAdwaita()
  const resolvedTone = tone ?? (variant ? variantToTone(variant) : 'info')
  const toneTheme = resolveToneTheme(resolvedTone, t.colors)
  const close = onClose ? <BannerClose onClick={onClose} /> : null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: narrow ? 'column' : 'row',
        alignItems: narrow ? 'stretch' : 'center',
        gap: 8,
        padding: 12,
        borderRadius: 10,
        backgroundColor: toneTheme.bg,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <BannerBody title={title} body={body} tone={toneTheme} />
        {!narrow ? close : null}
      </div>
      {narrow ? close : null}
      {actionLabel ? (
        <div style={{ display: 'flex', justifyContent: narrow ? 'flex-start' : 'flex-end' }}>
          <Button variant="text" label={actionLabel} onClick={onAction} />
        </div>
      ) : null}
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const BannerShot: ComponentShot = {
  name: 'Banner',
  el: (
    <Shot>
      <Row label="Tones" col>
        <ShotItem label="info"><Banner title="New version available" body="A stable release is ready to install." tone="info" onClose={() => {}} /></ShotItem>
        <ShotItem label="warning"><Banner title="Storage almost full" body="You have used 95% of your quota." tone="warning" onClose={() => {}} /></ShotItem>
        <ShotItem label="error"><Banner title="Sync failed" body="Could not reach the server." tone="error" onClose={() => {}} /></ShotItem>
        <ShotItem label="success"><Banner title="All caught up" body="Your changes are synced." tone="success" onClose={() => {}} /></ShotItem>
      </Row>
      <Row label="Variant aliases" col>
        <ShotItem label="default → info"><Banner title="Default variant" body="The shadcn default alias." variant="default" onClose={() => {}} /></ShotItem>
        <ShotItem label="destructive → error"><Banner title="Destructive variant" body="The shadcn destructive alias." variant="destructive" onClose={() => {}} /></ShotItem>
      </Row>
      <Row label="Layouts" col>
        <ShotItem label="action + close">
          <Banner title="Update ready" body="A new version is waiting." tone="info" actionLabel="Update" onAction={() => {}} onClose={() => {}} />
        </ShotItem>
        <ShotItem label="narrow (action drops below)">
          <Banner title="Update ready" body="A new version is waiting." tone="info" actionLabel="Update" onAction={() => {}} onClose={() => {}} narrow />
        </ShotItem>
      </Row>
    </Shot>
  ),
}
