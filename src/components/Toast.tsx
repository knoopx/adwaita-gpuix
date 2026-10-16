import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, isDarkScheme } from '../theme/adwaita'
import { T } from './common'
import { Button } from './Button'
import { Icon, type IconName } from './icons'

export type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading'

/** Leading icon per toast `type` (`default` renders no icon). */
const TOAST_TYPE_ICONS: Record<Exclude<ToastType, 'default'>, IconName> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'close',
  loading: 'refresh',
}

export interface ToastProps {
  message: string
  actionLabel?: string
  onAction?: () => void
  /** Toast kind: leading 14px icon (`success`/`info`/`warning`/`error`/`loading`). */
  type?: ToastType
  /** Per-toast close: shows a 16×16 `close` icon button at the pill end. */
  onDismiss?: () => void
  style?: Partial<StyleDesc>
}

/**
 * Adwaita toast: a dark pill that floats at the bottom of the window.
 *
 * `type` adds a leading 14px icon (success/info/warning/error/loading);
 * `onDismiss` adds a 16×16 close icon at the pill end (the Toaster wires it
 * to `dismiss(id)`); `message` / `actionLabel` / `onAction` are unchanged.
 */
export function Toast({ message, actionLabel, onAction, type = 'default', onDismiss, style }: ToastProps) {
  const t = useAdwaita()
  const typeIcon = type === 'default' ? null : TOAST_TYPE_ICONS[type]
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 8,
        paddingLeft: 14,
        paddingRight: 14,
        borderRadius: 999,
        backgroundColor: isDarkScheme(t.scheme) ? '#565656' : '#333333',
        ...style,
      }}
    >
      {typeIcon ? <Icon name={typeIcon} size={14} color="#ffffff" /> : null}
      <T size="body" color="#ffffff">
        {message}
      </T>
      {actionLabel ? (
        <Button variant="text" label={actionLabel} onClick={onAction} style={{ minHeight: 28, paddingRight: 4 }} />
      ) : null}
      {onDismiss ? (
        <div
          onClick={onDismiss}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 16,
            height: 16,
            cursor: 'pointer',
          }}
        >
          <Icon name="close" size={14} color="#ffffff" />
        </div>
      ) : null}
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const ToastShot: ComponentShot = {
  name: 'Toast',
  el: (
    <Shot>
      <Row label="Types" col>
        <ShotItem label="default (no icon)"><Toast message="File saved" /></ShotItem>
        <ShotItem label="success"><Toast message="File saved" type="success" /></ShotItem>
        <ShotItem label="info"><Toast message="New message from Ada" type="info" /></ShotItem>
        <ShotItem label="warning"><Toast message="Disk almost full" type="warning" /></ShotItem>
        <ShotItem label="error"><Toast message="Upload failed" type="error" /></ShotItem>
        <ShotItem label="loading"><Toast message="Uploading…" type="loading" /></ShotItem>
      </Row>
      <Row label="Action + dismiss" col>
        <ShotItem label="with action"><Toast message="File deleted" actionLabel="Undo" onAction={() => {}} /></ShotItem>
        <ShotItem label="with dismiss"><Toast message="Copied to clipboard" onDismiss={() => {}} /></ShotItem>
        <ShotItem label="full (type + action + dismiss)">
          <Toast message="File saved" type="success" actionLabel="Undo" onAction={() => {}} onDismiss={() => {}} />
        </ShotItem>
      </Row>
    </Shot>
  ),
}
