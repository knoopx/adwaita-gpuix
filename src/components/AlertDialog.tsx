import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc, EventPayload } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T, OverlayShell, dialogCardStyle } from './common'
import { Button, type ButtonVariant } from './Button'

export interface AlertDialogAction {
  label: string
  variant?: 'default' | 'suggested' | 'destructive'
  onClick?: () => void
}

export interface AlertDialogProps {

  heading?: string

  body?: string

  actions?: AlertDialogAction[]

  media?: ReactNode

  size?: 'default' | 'sm'

  open?: boolean
  onOpenChange?: (open: boolean) => void

  contained?: boolean

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

interface AlertDialogContextValue {
  onOpenChange?: (open: boolean) => void
}

const AlertDialogCtx = createContext<AlertDialogContextValue | null>(null)

function useAlertDialog(): AlertDialogContextValue {
  return useContext(AlertDialogCtx) ?? {}
}

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

export function AlertDialog({
  open,
  onOpenChange,
  contained = false,
  ...card
}: AlertDialogProps) {
  const ctxValue: AlertDialogContextValue = { onOpenChange }


  if (open === undefined) {
    return (
      <AlertDialogCtx.Provider value={ctxValue}>
        <AlertDialogCardBody {...card} />
      </AlertDialogCtx.Provider>
    )
  }

  if (!open) return null



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

            if (e.key === 'Escape') onOpenChange?.(false)
          }}
        >
          <AlertDialogCardBody {...card} />
        </div>
      </OverlayShell>
    </AlertDialogCtx.Provider>
  )
}

export function AlertDialogHeader({ children, style }: AlertDialogHeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {children}
    </div>
  )
}

export function AlertDialogFooter({ children, style }: AlertDialogFooterProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {children}
    </div>
  )
}

export function AlertDialogTitle({ children, style }: AlertDialogTitleProps) {
  const t = useAdwaita()
  return (
    <T size="title2" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export function AlertDialogDescription({ children, style }: AlertDialogDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

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

export const MessageDialog = AlertDialog

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'
import { Icon } from './icons'

export const AlertDialogShot: ComponentShot = {
  name: 'AlertDialog',
  el: (
    <Shot>
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
    </Shot>
  ),
}
