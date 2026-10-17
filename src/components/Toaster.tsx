import { useCallback, useRef, useState } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { Toast, type ToastType } from './Toast'

export interface ToastItem {
  message: string
  id?: string
  type?: ToastType

  duration?: number
  actionLabel?: string
  onAction?: () => void
}

export interface ToastOptions {
  type?: ToastType

  duration?: number
  actionLabel?: string
  onAction?: () => void
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, opts: ToastOptions = {}) => {
      counter.current += 1
      const id = `toast-${counter.current}`
      setToasts((current) => [...current, { id, message, ...opts }])
      const duration = opts.duration ?? 5000
      if (duration > 0) setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss],
  )

  return { toasts, toast, dismiss }
}

export type ToasterPosition = 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left'

const POSITION_OFFSETS: Record<ToasterPosition, Partial<StyleDesc>> = {
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-right': { bottom: 16, right: 16 },
  'top-right': { top: 16, right: 16 },
  'top-left': { top: 16, left: 16 },
}

export interface ToasterProps {
  toasts?: ToastItem[]

  position?: ToasterPosition

  onDismiss?: (id: string) => void
  style?: Partial<StyleDesc>
}

export function Toaster({ toasts = [], position = 'bottom-left', onDismiss, style }: ToasterProps) {
  return (
    <div
      style={{
        position: 'absolute',
        ...POSITION_OFFSETS[position],
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...style,
      }}
    >
      {toasts.map((toast, i) => {
        const id = toast.id
        return (
          <Toast
            key={id ?? i}
            message={toast.message}
            type={toast.type}
            actionLabel={toast.actionLabel}
            onAction={toast.onAction}
            onDismiss={onDismiss ? () => onDismiss(id ?? '') : undefined}
          />
        )
      })}
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { useAdwaita } from '../theme/adwaita'
import { FloatingStage, T, Row, Shot, ShotItem } from './common'

function ToastStage({
  toasts,
  position = 'bottom-left',
  width = 360,
  height = 160,
  captionPos = 'top-left',
}: {
  toasts: { message: string; type?: ToastType; actionLabel?: string }[]
  position?: ToasterPosition
  width?: number
  height?: number
  captionPos?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}) {
  const t = useAdwaita()
  const { colors } = t
  const captionStyle: StyleDesc = {
    position: 'absolute',
    ...(captionPos === 'top-right'
      ? { top: 8, right: 12 }
      : captionPos === 'bottom-left'
        ? { bottom: 8, left: 12 }
        : captionPos === 'bottom-right'
          ? { bottom: 8, right: 12 }
          : { top: 8, left: 12 }),
  }
  return (
    <FloatingStage width={width} height={height}>
      <div style={captionStyle}>
        <T size="caption" color={colors.dim_fg}>App window</T>
      </div>
      <Toaster
        toasts={toasts.map((toast, i) => ({ id: `shot-${i}`, ...toast }))}
        position={position}
        onDismiss={() => {}}
      />
    </FloatingStage>
  )
}

export const ToasterShot: ComponentShot = {
  name: 'Toaster',
  el: (
    <Shot>
      <Row label="Toast types (leading icon)" col>
        <ShotItem label="default / success / warning / error / loading">
          <ToastStage
            width={420}
            height={248}
            captionPos="top-right"
            toasts={[
              { message: 'File saved' },
              { message: 'Build succeeded', type: 'success' },
              { message: 'Disk almost full', type: 'warning' },
              { message: 'Upload failed', type: 'error' },
              { message: 'Uploading…', type: 'loading' },
            ]}
          />
        </ShotItem>
      </Row>
      <Row label="Action + dismiss" col>
        <ShotItem label="action button + close icon">
          <ToastStage
            width={300}
            height={120}
            captionPos="top-right"
            toasts={[
              { message: 'File deleted', actionLabel: 'Undo' },
              { message: 'Copied to clipboard' },
            ]}
          />
        </ShotItem>
      </Row>
      <Row label="Positions (2×2 grid)" col>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
          <ShotItem label="bottom-left (default)">
            <ToastStage width={250} height={120} toasts={[{ message: 'Saved' }]} />
          </ShotItem>
          <ShotItem label="bottom-right">
            <ToastStage width={250} height={120} position="bottom-right" toasts={[{ message: 'Saved', type: 'success' }]} />
          </ShotItem>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
          <ShotItem label="top-left">
            <ToastStage width={250} height={120} position="top-left" captionPos="bottom-right" toasts={[{ message: 'Saved', type: 'info' }]} />
          </ShotItem>
          <ShotItem label="top-right">
            <ToastStage width={250} height={120} position="top-right" captionPos="bottom-left" toasts={[{ message: 'Saved', type: 'warning' }]} />
          </ShotItem>
        </div>
      </Row>
    </Shot>
  ),
}
