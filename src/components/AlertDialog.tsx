import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc, EventPayload } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T, OverlayShell, dialogCardStyle } from './common'
import { Button, type ButtonVariant } from './Button'

/* ── Types ────────────────────────────────────────────────────────────── */

export interface AlertDialogAction {
  label: string
  variant?: 'default' | 'suggested' | 'destructive'
  onClick?: () => void
}

export interface AlertDialogProps {
  /** Heading text (flat `actions[]` mode). */
  heading?: string
  /** Body text (flat `actions[]` mode). */
  body?: string
  /** Flat data-driven action buttons (convenience API, kept alongside the compound form). */
  actions?: AlertDialogAction[]
  /** A 64×64 icon/media block rendered above the heading (button_bg disc). */
  media?: ReactNode
  /** Panel size: `'default'` (minWidth 320) or `'sm'` (minWidth 288). */
  size?: 'default' | 'sm'
  /**
   * Overlay mode. When `open` is provided the dialog renders as an overlay —
   * scrim + centered panel with click-outside dismiss (via `OverlayShell`)
   * and Escape-only keyboard dismissal. When omitted the dialog renders as
   * an inline card (the legacy flat rendering, kept for static renders).
   */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Contain the open panel (and scrim) to a positioned ancestor instead of
   * the viewport (static renders). Default false.
   */
  contained?: boolean
  /** Compound content (Header/Title/Description/Footer/Action/Cancel). */
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface AlertDialogHeaderProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface AlertDialogFooterProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface AlertDialogTitleProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface AlertDialogDescriptionProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface AlertDialogActionProps {
  label?: string
  /** Button variant — `suggested` by default (the reference AlertDialogAction). */
  variant?: ButtonVariant
  onClick?: () => void
  disabled?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface AlertDialogCancelProps {
  label?: string
  onClick?: () => void
  disabled?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/* ── Context ──────────────────────────────────────────────────────────── */

interface AlertDialogContextValue {
  onOpenChange?: (open: boolean) => void
}

const AlertDialogCtx = createContext<AlertDialogContextValue | null>(null)

function useAlertDialog(): AlertDialogContextValue {
  return useContext(AlertDialogCtx) ?? {}
}

/* ── Card body (shared by inline + overlay modes) ────────────────────── */

const variantMap: Record<NonNullable<AlertDialogAction['variant']>, ButtonVariant> = {
  suggested: 'suggested',
  destructive: 'destructive',
  default: 'default',
}

function AlertDialogCardBody({
  heading,
  body,
  actions,
  media,
  size = 'default',
  children,
  style,
}: Omit<AlertDialogProps, 'open' | 'onOpenChange' | 'contained'>) {
  const t = useAdwaita()
  const { colors } = t
  const minWidth = size === 'sm' ? 288 : 320

  return (
    <div
      style={{ ...dialogCardStyle(t, { gap: 16, minWidth }), ...style }}
    >
      {media ? (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            backgroundColor: colors.button_bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          {media}
        </div>
      ) : null}
      {heading ? (
        <T size="title2" weight={700} color={colors.fg} align="center">
          {heading}
        </T>
      ) : null}
      {body ? (
        <T size="body" color={colors.dim_fg} align="center">
          {body}
        </T>
      ) : null}
      {actions && actions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {actions.map((a, i) => (
            <Button
              key={i}
              variant={a.variant ? variantMap[a.variant] : 'default'}
              label={a.label}
              onClick={a.onClick}
              style={{ width: '100%' }}
            />
          ))}
        </div>
      ) : null}
      {children}
    </div>
  )
}

/* ── Components ───────────────────────────────────────────────────────── */

/**
 * Adwaita alert dialog. Flat data API (`heading` / `body` / `actions[]`) kept
 * alongside the compound sub-exports; `open` switches the rendering from an
 * inline card (legacy) to a scrimmed, centered overlay with click-outside and
 * Escape dismissal.
 */
export function AlertDialog({
  open,
  onOpenChange,
  contained = false,
  ...card
}: AlertDialogProps) {
  const ctxValue: AlertDialogContextValue = { onOpenChange }

  // Legacy inline mode: no `open` provided → render the card in flow.
  if (open === undefined) {
    return (
      <AlertDialogCtx.Provider value={ctxValue}>
        <AlertDialogCardBody {...card} />
      </AlertDialogCtx.Provider>
    )
  }

  if (!open) return null

  // contained → the panel + scrim are anchored to a positioned ancestor
  // (static renders); otherwise they float over the whole viewport.
  const pos = contained ? 'absolute' : 'fixed'

  return (
    <AlertDialogCtx.Provider value={ctxValue}>
      <OverlayShell position={pos} onDismiss={() => onOpenChange?.(false)}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
          }}
          onKeyDown={(e: EventPayload) => {
            // Escape-only dismissal (any-keydown closing is the anti-pattern).
            if (e.key === 'Escape') onOpenChange?.(false)
          }}
        >
          <AlertDialogCardBody {...card} />
        </div>
      </OverlayShell>
    </AlertDialogCtx.Provider>
  )
}

/** A header block: column of title + description (gap 4). */
export function AlertDialogHeader({ children, style }: AlertDialogHeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {children}
    </div>
  )
}

/** A footer block: column of full-width action buttons (gap 8, adwaita idiom). */
export function AlertDialogFooter({ children, style }: AlertDialogFooterProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {children}
    </div>
  )
}

/** The dialog heading (title2, bold). */
export function AlertDialogTitle({ children, style }: AlertDialogTitleProps) {
  const t = useAdwaita()
  return (
    <T size="title2" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

/** The dialog description (body, dim). */
export function AlertDialogDescription({ children, style }: AlertDialogDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

/**
 * A thin wrapper over `Button` (variant `suggested` by default) that closes
 * the alert dialog after firing `onClick`.
 */
export function AlertDialogAction({ label, variant = 'suggested', onClick, disabled, children, style }: AlertDialogActionProps) {
  const { onOpenChange } = useAlertDialog()
  return (
    <Button
      variant={variant}
      label={label}
      disabled={disabled}
      onClick={() => {
        onClick?.()
        onOpenChange?.(false)
      }}
      style={style}
    >
      {children}
    </Button>
  )
}

/**
 * A thin wrapper over `Button` (variant `default`) that closes the alert
 * dialog after firing `onClick`.
 */
export function AlertDialogCancel({ label, onClick, disabled, children, style }: AlertDialogCancelProps) {
  const { onOpenChange } = useAlertDialog()
  return (
    <Button
      variant="default"
      label={label}
      disabled={disabled}
      onClick={() => {
        onClick?.()
        onOpenChange?.(false)
      }}
      style={style}
    >
      {children}
    </Button>
  )
}

/** Alias of AlertDialog (libadwaita names both dialog flavours similarly). */
export const MessageDialog = AlertDialog

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row } from './common'
import { Icon } from './icons'

/** A captioned shot item: a small dim caption above the item. */
function ShotItem({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>{label}</T>
      {children}
    </div>
  )
}

export const AlertDialogShot: ComponentShot = {
  name: 'AlertDialog',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Flat (actions[])" col>
        <ShotItem label="destructive + default actions">
          <AlertDialog
            heading="Delete item?"
            body="This action cannot be undone."
            actions={[
              { label: 'Delete', variant: 'destructive', onClick: () => {} },
              { label: 'Cancel', variant: 'default', onClick: () => {} },
            ]}
          />
        </ShotItem>
        <ShotItem label="suggested action, size sm">
          <AlertDialog
            size="sm"
            heading="Heads up"
            body="A plain message dialog."
            actions={[{ label: 'OK', variant: 'suggested', onClick: () => {} }]}
          />
        </ShotItem>
      </Row>
      <Row label="Media" col>
        <ShotItem label="with media (size default)">
          <AlertDialog
            media={<Icon name="warning" size={32} color="#e5a50a" />}
            heading="Storage full"
            body="Free up space to continue syncing."
            actions={[{ label: 'Open settings', variant: 'suggested', onClick: () => {} }]}
          />
        </ShotItem>
      </Row>
      <Row label="Compound" col>
        <ShotItem label="Header / Footer / Action / Cancel">
          <AlertDialog>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete item?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction label="Delete" variant="destructive" />
              <AlertDialogCancel label="Cancel" />
            </AlertDialogFooter>
          </AlertDialog>
        </ShotItem>
        <ShotItem label="disabled actions">
          <AlertDialog heading="Confirm" body="Both actions are disabled.">
            <AlertDialogFooter>
              <AlertDialogAction label="Confirm" disabled />
              <AlertDialogCancel label="Cancel" disabled />
            </AlertDialogFooter>
          </AlertDialog>
        </ShotItem>
      </Row>
      <Row label="MessageDialog (alias)" col>
        <ShotItem label="alias of AlertDialog">
          <MessageDialog
            heading="Heads up"
            body="A plain message dialog."
            actions={[{ label: 'OK', variant: 'suggested', onClick: () => {} }]}
          />
        </ShotItem>
      </Row>
    </div>
  ),
}
