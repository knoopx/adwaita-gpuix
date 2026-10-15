import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { FloatingPanel, T } from './common'

/* ── Types ────────────────────────────────────────────────────────────── */

export interface PopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
}

export interface PopoverTriggerProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface PopoverContentProps {
  children?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  style?: Partial<StyleDesc>
}

export interface PopoverAnchorProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface PopoverHeaderProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface PopoverTitleProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface PopoverDescriptionProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/* ── Context ──────────────────────────────────────────────────────────── */

interface PopoverContext {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PopoverCtx = createContext<PopoverContext | null>(null)

function usePopover(): PopoverContext {
  const ctx = useContext(PopoverCtx)
  if (!ctx) throw new Error('Popover components must be used within <Popover>')
  return ctx
}

/* ── Components ───────────────────────────────────────────────────────── */

export function Popover({ open, onOpenChange, children }: PopoverProps) {
  return <PopoverCtx.Provider value={{ open, onOpenChange }}>{children}</PopoverCtx.Provider>
}

export function PopoverTrigger({ children, style }: PopoverTriggerProps) {
  const { onOpenChange } = usePopover()
  return (
    <div onClick={() => onOpenChange(true)} style={{ cursor: 'pointer', ...style }}>
      {children}
    </div>
  )
}

export function PopoverContent({ children, side = 'bottom', sideOffset = 8, style }: PopoverContentProps) {
  const { open } = usePopover()

  if (!open) return null

  return (
    <FloatingPanel side={side} sideOffset={sideOffset} padding={8} gap={8} style={style}>
      {children}
    </FloatingPanel>
  )
}

/**
 * GPUix anchored panels resolve against the nearest positioned ancestor;
 * this wrapper is the positioning context for an anchored PopoverContent —
 * place the trigger (and content) inside it.
 */
export function PopoverAnchor({ children, style }: PopoverAnchorProps) {
  return (
    <div style={{ position: 'relative', display: 'flex', ...style }}>{children}</div>
  )
}

export function PopoverHeader({ children, style }: PopoverHeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>{children}</div>
  )
}

export function PopoverTitle({ children, style }: PopoverTitleProps) {
  const t = useAdwaita()
  return (
    <T size="body" weight={600} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export function PopoverDescription({ children, style }: PopoverDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}
