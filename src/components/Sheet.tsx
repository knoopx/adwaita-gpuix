import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T, Row, FloatingStage, OverlayShell, OverlayPanel, CloseButton, OverlayFooter } from './common'

export type SheetSide = 'bottom' | 'left' | 'right' | 'top'

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: SheetSide
  /**
   * Contain the open panel (and scrim) to a positioned ancestor instead of
   * the viewport: switches `position: fixed` to `position: absolute`. Used by
   * static renders (takumi PNGs) that place the sheet inside a bounded
   * `position: relative` stage. Default false keeps real GPUix viewport
   * behaviour.
   */
  contained?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface SheetContentProps {
  children?: ReactNode
  /** Render the auto close button in the top-right corner (default true). */
  showCloseButton?: boolean
  style?: Partial<StyleDesc>
}

export interface SheetTriggerProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface SheetDescriptionProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface SheetFooterProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface SheetHeaderProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface SheetTitleProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface SheetCloseProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/* ── Context ─────────────────────────────────────────────────────────── */

interface SheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  contained: boolean
  side: SheetSide
}

const SheetCtx = createContext<SheetContextValue | null>(null)

function useSheet(): SheetContextValue {
  const ctx = useContext(SheetCtx)
  if (!ctx) throw new Error('Sheet sub-components must be used within <Sheet>')
  return ctx
}

/* ── Sheet: slimmer side panel (fixed width ~320) ─────────────────────── */

export function Sheet({ open, onOpenChange, side = 'right', contained = false, children, style }: SheetProps) {
  const t = useAdwaita()
  const ctxValue: SheetContextValue = { open, onOpenChange, contained, side }

  return (
    <SheetCtx.Provider value={ctxValue}>
      {open ? renderSheetShell(onOpenChange, contained, side, children, style, t.colors) : null}
    </SheetCtx.Provider>
  )
}

/**
 * The sheet shell (scrim + edge-attached panel), extracted from the root so
 * the context provider stays mounted while the sheet is closed.
 */
function renderSheetShell(
  onOpenChange: (open: boolean) => void,
  contained: boolean,
  side: SheetSide,
  children: ReactNode,
  style: Partial<StyleDesc> | undefined,
  colors: { border: string },
): ReactNode {
  // contained → the panel is anchored to a positioned ancestor (static renders);
  // otherwise it floats over the whole viewport (real GPUix).
  const pos = contained ? 'absolute' : 'fixed'

  let panelStyle: Partial<StyleDesc>
  if (side === 'left') {
    panelStyle = {
      top: 0,
      left: 0,
      height: '100%',
      width: 320,
      borderRightWidth: 1,
      borderColor: colors.border,
      boxShadow: { offsetX: 4, offsetY: 0, blurRadius: 16, spreadRadius: 0, color: 'rgba(0,0,0,0.12)' },
    }
  } else if (side === 'right') {
    panelStyle = {
      top: 0,
      right: 0,
      height: '100%',
      width: 320,
      borderLeftWidth: 1,
      borderColor: colors.border,
      boxShadow: { offsetX: -4, offsetY: 0, blurRadius: 16, spreadRadius: 0, color: 'rgba(0,0,0,0.12)' },
    }
  } else if (side === 'bottom') {
    panelStyle = {
      bottom: 0,
      left: 0,
      width: '100%',
      borderTopWidth: 1,
      borderColor: colors.border,
      boxShadow: { offsetX: 0, offsetY: -4, blurRadius: 16, spreadRadius: 0, color: 'rgba(0,0,0,0.12)' },
    }
  } else {
    panelStyle = {
      top: 0,
      left: 0,
      width: '100%',
      borderBottomWidth: 1,
      borderColor: colors.border,
      boxShadow: { offsetX: 0, offsetY: 4, blurRadius: 16, spreadRadius: 0, color: 'rgba(0,0,0,0.12)' },
    }
  }

  return (
    <OverlayShell position={pos} onDismiss={() => onOpenChange(false)} style={style}>
      {/* Panel */}
      <OverlayPanel position={pos} panelStyle={panelStyle}>
        {children}
      </OverlayPanel>
    </OverlayShell>
  )
}

/* ── Sub-components ───────────────────────────────────────────────────── */

/**
 * Opens the sheet on click (div onClick -> onOpenChange(true)), the same
 * idiom as DialogTrigger. Requires the sheet root context, so it must sit
 * inside <Sheet>.
 */
export function SheetTrigger({ children, style }: SheetTriggerProps) {
  const { onOpenChange } = useSheet()
  return (
    <div onClick={() => onOpenChange(true)} style={{ cursor: 'pointer', ...style }}>
      {children}
    </div>
  )
}

export function SheetContent({ children, style, showCloseButton = true }: SheetContentProps) {
  const { onOpenChange } = useSheet()
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 8,
        padding: 16,
        ...style,
      }}
    >
      {children}
      {showCloseButton ? (
        <CloseButton
          onClick={() => onOpenChange(false)}
          style={{ position: 'absolute', top: 8, right: 8 }}
        />
      ) : null}
    </div>
  )
}

export function SheetHeader({ children, style }: SheetHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingBottom: 0,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function SheetTitle({ children, style }: SheetTitleProps) {
  const t = useAdwaita()
  return (
    <T size="title3" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

/** A dim body-text description under the sheet title. */
export function SheetDescription({ children, style }: SheetDescriptionProps) {
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
export function SheetFooter({ children, style }: SheetFooterProps) {
  return <OverlayFooter children={children} style={style} />
}

export function SheetClose({ children, style }: SheetCloseProps) {
  const { onOpenChange } = useSheet()
  return (
    <CloseButton onClick={() => onOpenChange(false)} style={style}>
      {children}
    </CloseButton>
  )
}

/* ── Showcase ─────────────────────────────────────────────────────────── */

const noop = () => {}

/** Full Sheet montage for static renders / playground (closed + open
 *  left-side panel contained in a bounded stage). */
export function SheetShowcase(): ReactNode {
  return (
    <Row label="Sheet" col>
      <Row label="Closed">
        <Sheet open={false} onOpenChange={noop} side="left" />
      </Row>
      <Row label="Open">
        <FloatingStage>
          <Sheet open={true} onOpenChange={noop} side="left" contained>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet title</SheetTitle>
              </SheetHeader>
              <T>Sheet content goes here.</T>
            </SheetContent>
          </Sheet>
        </FloatingStage>
      </Row>
    </Row>
  )
}
