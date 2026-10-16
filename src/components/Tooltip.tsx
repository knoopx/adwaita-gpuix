import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, isDarkScheme } from '../theme/adwaita'
import { T } from './common'

/* ── Types ────────────────────────────────────────────────────────────── */

export interface TooltipProviderProps {
  children: ReactNode
  delayDuration?: number
}

export interface TooltipProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  delayDuration?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  style?: Partial<StyleDesc>
}

export interface TooltipTriggerProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface TooltipContentProps {
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  style?: Partial<StyleDesc>
}

/* ── Context ──────────────────────────────────────────────────────────── */

const TooltipProviderCtx = createContext<number>(0)

interface TooltipContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  delayDuration: number
  side: 'top' | 'right' | 'bottom' | 'left'
}

const TooltipCtx = createContext<TooltipContextValue | null>(null)

function useTooltip(): TooltipContextValue {
  const ctx = useContext(TooltipCtx)
  if (!ctx) throw new Error('Tooltip components must be used within <Tooltip>')
  return ctx
}

/* ── Components ───────────────────────────────────────────────────────── */

/** A delay context: the default show delay (ms) for tooltips in its subtree. */
export function TooltipProvider({ children, delayDuration = 0 }: TooltipProviderProps) {
  return (
    <TooltipProviderCtx.Provider value={delayDuration}>
      <div style={{ display: 'flex' }}>{children}</div>
    </TooltipProviderCtx.Provider>
  )
}

/**
 * A tooltip: controlled (open/onOpenChange) or uncontrolled (defaultOpen)
 * duality. The open state, show delay, and side live in the context; the
 * Trigger toggles and the Content gates on open.
 */
export function Tooltip({ children, open, onOpenChange, defaultOpen, delayDuration, side, style }: TooltipProps) {
  const providerDelay = useContext(TooltipProviderCtx)
  const [internal, setInternal] = useState(defaultOpen ?? false)
  const isOpen = open ?? internal
  const setOpen = (v: boolean) => {
    if (open === undefined) setInternal(v)
    onOpenChange?.(v)
  }
  const delay = delayDuration ?? providerDelay
  return (
    <TooltipCtx.Provider value={{ open: isOpen, setOpen, delayDuration: delay, side: side ?? 'top' }}>
      <div style={{ display: 'flex', position: 'relative', ...style }}>{children}</div>
    </TooltipCtx.Provider>
  )
}

/**
 * The tooltip's anchor: mouse enter/leave + focus/blur toggling. The
 * delayDuration is honoured via a useRef timer (GPUix-idiomatic — no CSS
 * delays on host elements).
 */
export function TooltipTrigger({ children, style }: TooltipTriggerProps) {
  const { open, setOpen, delayDuration } = useTooltip()
  void open
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const openTooltip = () => {
    if (delayDuration > 0) {
      timer.current = setTimeout(() => setOpen(true), delayDuration)
    } else {
      setOpen(true)
    }
  }
  const closeTooltip = () => {
    if (timer.current !== undefined) {
      clearTimeout(timer.current)
      timer.current = undefined
    }
    setOpen(false)
  }
  return (
    <div
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      tabIndex={0}
      onFocus={openTooltip}
      onBlur={closeTooltip}
      style={{ cursor: 'pointer', ...style }}
    >
      {children}
    </div>
  )
}

/**
 * The tooltip bubble: a scheme-aware pill with a 12px diamond arrow for the
 * top/bottom sides (the arrow is an svg data-URI img — GPUix transform is
 * unsupported on host elements, so the rotation happens inside the
 * rasterized SVG). Gated on the context's open state.
 */
export function TooltipContent({ children, side, sideOffset = 4, style }: TooltipContentProps) {
  const ctx = useTooltip()
  const t = useAdwaita()
  const effectiveSide = side ?? ctx.side
  if (!ctx.open) return null
  const pillBg = isDarkScheme(t.scheme) ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.7)'
  const arrowSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><rect x="3" y="3" width="6" height="6" rx="1" transform="rotate(45 6 6)" fill="' +
    pillBg +
    '"/></svg>'
  const arrowImg = (
    <img src={'data:image/svg+xml,' + encodeURIComponent(arrowSvg)} style={{ width: 12, height: 12 }} />
  )
  return (
    <anchored side={effectiveSide} offset={{ x: 0, y: sideOffset }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {effectiveSide === 'bottom' ? arrowImg : null}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 4,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: t.radii.pill,
            backgroundColor: pillBg,
            ...style,
          }}
        >
          <T size="caption" color="#ffffff">
            {children}
          </T>
        </div>
        {effectiveSide === 'top' ? arrowImg : null}
      </div>
    </anchored>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row } from './common'
import { Button } from './Button'

/** A captioned shot item: a small dim caption above the item. */
function TooltipShotItem({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>{label}</T>
      {children}
    </div>
  )
}

/** An open tooltip on a given side (the `side` prop on the root). */
function SideTooltip({ side, text }: { side: 'top' | 'right' | 'bottom' | 'left'; text: string }) {
  return (
    <TooltipProvider>
      <Tooltip open side={side}>
        <TooltipTrigger>
          <Button label={side} onClick={() => {}} />
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const TooltipShot: ComponentShot = {
  name: 'Tooltip',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Closed (open=false)">
        <TooltipProvider delayDuration={300}>
          <Tooltip open={false}>
            <TooltipTrigger>
              <Button label="No tooltip" onClick={() => {}} />
            </TooltipTrigger>
            <TooltipContent>Hidden</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Row>
      <Row label="Open · sides (side prop)" col>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center' }}>
          <TooltipShotItem label="side=top">
            <SideTooltip side="top" text="Tooltip above" />
          </TooltipShotItem>
          <TooltipShotItem label="side=right">
            <SideTooltip side="right" text="Tooltip right" />
          </TooltipShotItem>
          <TooltipShotItem label="side=bottom">
            <SideTooltip side="bottom" text="Tooltip below" />
          </TooltipShotItem>
          <TooltipShotItem label="side=left">
            <SideTooltip side="left" text="Tooltip left" />
          </TooltipShotItem>
        </div>
      </Row>
      <Row label="Content-side override (TooltipContent side)" col>
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>
              <Button label="Content side" onClick={() => {}} />
            </TooltipTrigger>
            <TooltipContent side="bottom">Content-side override</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Row>
      <Row label="Uncontrolled (defaultOpen)" col>
        <Tooltip defaultOpen>
          <TooltipTrigger>
            <Button label="Default open" onClick={() => {}} />
          </TooltipTrigger>
          <TooltipContent>Uncontrolled open state</TooltipContent>
        </Tooltip>
      </Row>
    </div>
  ),
}
