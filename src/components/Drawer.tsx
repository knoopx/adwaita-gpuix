import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T, Row, FloatingStage, OverlayShell, OverlayPanel, CloseButton, OverlayFooter } from './common'
import { Button } from './Button'

export type DrawerSide = 'bottom' | 'left' | 'right' | 'top'

export interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: DrawerSide
  /**
   * Contain the open panel (and scrim) to a positioned ancestor instead of
   * the viewport: switches `position: fixed` to `position: absolute`. Used by
   * static renders (takumi PNGs) that place the drawer inside a bounded
   * `position: relative` stage. Default false keeps real GPUix viewport
   * behaviour.
   */
  contained?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DrawerContentProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DrawerHeaderProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DrawerTitleProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DrawerCloseProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DrawerTriggerProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface DrawerDescriptionProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DrawerFooterProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

const noop = () => {}

/* ── Context ─────────────────────────────────────────────────────────── */

interface DrawerContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  contained: boolean
  side: DrawerSide
}

const DrawerCtx = createContext<DrawerContextValue | null>(null)

function useDrawer(): DrawerContextValue {
  const ctx = useContext(DrawerCtx)
  if (!ctx) throw new Error('Drawer sub-components must be used within <Drawer>')
  return ctx
}

/* ── Drawer: edge-attached panel over a scrim ─────────────────────────── */

export function Drawer({ open, onOpenChange, side = 'right', contained = false, children, style }: DrawerProps) {
  const t = useAdwaita()
  const ctxValue: DrawerContextValue = { open, onOpenChange, contained, side }

  return (
    <DrawerCtx.Provider value={ctxValue}>
      {open ? renderDrawerShell(open, onOpenChange, contained, side, children, style, t.colors) : null}
    </DrawerCtx.Provider>
  )
}

/**
 * The drawer shell (scrim + edge-attached panel), extracted from the root so
 * the context provider stays mounted while the drawer is closed.
 */
function renderDrawerShell(
  _open: boolean,
  onOpenChange: (open: boolean) => void,
  contained: boolean,
  side: DrawerSide,
  children: ReactNode,
  style: Partial<StyleDesc> | undefined,
  colors: { border: string },
): ReactNode {
  // contained → the panel is anchored to a positioned ancestor (static renders);
  // otherwise it floats over the whole viewport (real GPUix).
  const pos = contained ? 'absolute' : 'fixed'

  let panelStyle: Partial<StyleDesc>
  if (side === 'bottom') {
    panelStyle = { bottom: 0, left: 0, width: '100%' }
  } else if (side === 'top') {
    panelStyle = { top: 0, left: 0, width: '100%' }
  } else if (side === 'left') {
    panelStyle = { top: 0, left: 0, height: '100%', width: 320, borderLeftWidth: 1, borderColor: colors.border }
  } else {
    panelStyle = { top: 0, right: 0, height: '100%', width: 320, borderLeftWidth: 1, borderColor: colors.border }
  }

  return (
    <OverlayShell position={pos} onDismiss={() => onOpenChange(false)} style={style}>
      {/* Panel */}
      <OverlayPanel
        position={pos}
        panelStyle={{
          boxShadow: { offsetX: 0, offsetY: 0, blurRadius: 24, spreadRadius: 0, color: 'rgba(0,0,0,0.18)' },
          ...panelStyle,
        }}
      >
        {/* Drag handle for bottom sheet */}
        {side === 'bottom' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.border,
              }}
            />
          </div>
        ) : null}
        {children}
      </OverlayPanel>
    </OverlayShell>
  )
}

/* ── Sub-components ───────────────────────────────────────────────────── */

/**
 * Opens the drawer on click (div onClick -> onOpenChange(true)), the same
 * idiom as DialogTrigger. Requires the drawer root context, so it must sit
 * inside <Drawer>.
 */
export function DrawerTrigger({ children, style }: DrawerTriggerProps) {
  const { onOpenChange } = useDrawer()
  return (
    <div onClick={() => onOpenChange(true)} style={{ cursor: 'pointer', ...style }}>
      {children}
    </div>
  )
}

export function DrawerContent({ children, style }: DrawerContentProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 8, padding: 16, ...style }}>
      {children}
    </div>
  )
}

export function DrawerHeader({ children, style }: DrawerHeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 16, paddingBottom: 0, ...style }}>
      {children}
    </div>
  )
}

export function DrawerTitle({ children, style }: DrawerTitleProps) {
  const t = useAdwaita()
  return (
    <T size="title2" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

/** A dim body-text description under the drawer title. */
export function DrawerDescription({ children, style }: DrawerDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

/**
 * A bottom-anchored footer: a flexGrow:1 spacer pushes the column of
 * actions (gap 8, padding 16) to the panel's bottom edge.
 */
export function DrawerFooter({ children, style }: DrawerFooterProps) {
  return <OverlayFooter children={children} style={style} />
}

export function DrawerClose({ children, style }: DrawerCloseProps) {
  const { onOpenChange } = useDrawer()
  return (
    <CloseButton onClick={() => onOpenChange(false)} style={style}>
      {children}
    </CloseButton>
  )
}

/* ── Showcase ─────────────────────────────────────────────────────────── */

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

/** The shared open-drawer body: header (title + close), content, footer. */
function DrawerBody({ title }: { title: string }) {
  return (
    <>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        <T>Drawer content goes here.</T>
        <DrawerFooter>
          <Button label="Close" onClick={noop} />
        </DrawerFooter>
      </DrawerContent>
    </>
  )
}

/** Full Drawer shot for static renders / playground: closed (renders
 *  nothing) + all four `side` variants contained in bounded stages. */
export function DrawerShowcase(): ReactNode {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Closed (open=false renders nothing)">
        <Drawer open={false} onOpenChange={noop} side="right">
          <DrawerTrigger>
            <Button label="Open drawer" onClick={noop} />
          </DrawerTrigger>
        </Drawer>
      </Row>
      <Row label="Open · sides (side prop, contained in a stage)" col>
        <ShotItem label="side=left">
          <FloatingStage width={360} height={150}>
            <Drawer open={true} onOpenChange={noop} side="left" contained>
              <DrawerBody title="Left drawer" />
            </Drawer>
          </FloatingStage>
        </ShotItem>
        <ShotItem label="side=right">
          <FloatingStage width={360} height={150}>
            <Drawer open={true} onOpenChange={noop} side="right" contained>
              <DrawerBody title="Right drawer" />
            </Drawer>
          </FloatingStage>
        </ShotItem>
        <ShotItem label="side=top">
          <FloatingStage width={360} height={150}>
            <Drawer open={true} onOpenChange={noop} side="top" contained>
              <DrawerBody title="Top drawer" />
            </Drawer>
          </FloatingStage>
        </ShotItem>
        <ShotItem label="side=bottom (drag handle)">
          <FloatingStage width={360} height={150}>
            <Drawer open={true} onOpenChange={noop} side="bottom" contained>
              <DrawerBody title="Bottom drawer" />
            </Drawer>
          </FloatingStage>
        </ShotItem>
      </Row>
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'

export const DrawerShot: ComponentShot = {
  name: 'Drawer',
  el: <DrawerShowcase />,
}
