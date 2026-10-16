import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T, Row, FloatingStage, OverlayShell, OverlayPanel, CloseButton, OverlayFooter } from './common'
import { Button } from './Button'

export type SheetSide = 'bottom' | 'left' | 'right' | 'top'

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: SheetSide

  contained?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface SheetContentProps {
  children?: ReactNode

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

export function Sheet({ open, onOpenChange, side = 'right', contained = false, children, style }: SheetProps) {
  const t = useAdwaita()
  const ctxValue: SheetContextValue = { open, onOpenChange, contained, side }

  return (
    <SheetCtx.Provider value={ctxValue}>
      {open ? renderSheetShell(onOpenChange, contained, side, children, style, t.colors) : null}
    </SheetCtx.Provider>
  )
}

function renderSheetShell(
  onOpenChange: (open: boolean) => void,
  contained: boolean,
  side: SheetSide,
  children: ReactNode,
  style: Partial<StyleDesc> | undefined,
  colors: { border: string },
): ReactNode {


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
    }
  } else if (side === 'right') {
    panelStyle = {
      top: 0,
      right: 0,
      height: '100%',
      width: 320,
      borderLeftWidth: 1,
      borderColor: colors.border,
    }
  } else if (side === 'bottom') {
    panelStyle = {
      bottom: 0,
      left: 0,
      width: '100%',
      borderTopWidth: 1,
      borderColor: colors.border,
    }
  } else {
    panelStyle = {
      top: 0,
      left: 0,
      width: '100%',
      borderBottomWidth: 1,
      borderColor: colors.border,
    }
  }

  return (
    <OverlayShell position={pos} onDismiss={() => onOpenChange(false)} style={style}>
      <OverlayPanel position={pos} panelStyle={panelStyle}>
        {children}
      </OverlayPanel>
    </OverlayShell>
  )
}

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

export function SheetDescription({ children, style }: SheetDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

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

const noop = () => {}

function SheetBody({ title }: { title: string }) {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        <SheetClose />
      </SheetHeader>
      <T>Sheet content goes here.</T>
      <SheetFooter>
        <Button label="Close" onClick={noop} />
      </SheetFooter>
    </SheetContent>
  )
}

export function SheetShowcase(): ReactNode {
  return (
    <Shot>
      <Row label="Closed (open=false renders nothing)">
        <Sheet open={false} onOpenChange={noop} side="left">
          <SheetTrigger>
            <Button label="Open sheet" onClick={noop} />
          </SheetTrigger>
        </Sheet>
      </Row>
      <Row label="Open · sides (side prop, contained in a stage)" col>
        <ShotItem label="side=left">
          <FloatingStage width={360} height={150}>
            <Sheet open={true} onOpenChange={noop} side="left" contained>
              <SheetBody title="Left sheet" />
            </Sheet>
          </FloatingStage>
        </ShotItem>
        <ShotItem label="side=right">
          <FloatingStage width={360} height={150}>
            <Sheet open={true} onOpenChange={noop} side="right" contained>
              <SheetBody title="Right sheet" />
            </Sheet>
          </FloatingStage>
        </ShotItem>
        <ShotItem label="side=top">
          <FloatingStage width={360} height={150}>
            <Sheet open={true} onOpenChange={noop} side="top" contained>
              <SheetBody title="Top sheet" />
            </Sheet>
          </FloatingStage>
        </ShotItem>
        <ShotItem label="side=bottom">
          <FloatingStage width={360} height={150}>
            <Sheet open={true} onOpenChange={noop} side="bottom" contained>
              <SheetBody title="Bottom sheet" />
            </Sheet>
          </FloatingStage>
        </ShotItem>
      </Row>
      <Row label="Content variants" col>
        <ShotItem label="showCloseButton=false + custom SheetClose in the header">
          <FloatingStage width={360} height={150}>
            <Sheet open={true} onOpenChange={noop} side="right" contained>
              <SheetContent showCloseButton={false}>
                <SheetHeader>
                  <SheetTitle>No auto close</SheetTitle>
                  <SheetClose />
                </SheetHeader>
                <T>The auto close button is disabled; the header carries a SheetClose.</T>
              </SheetContent>
            </Sheet>
          </FloatingStage>
        </ShotItem>
      </Row>
    </Shot>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Shot, ShotItem } from './common'

export const SheetShot: ComponentShot = {
  name: 'Sheet',
  el: <SheetShowcase />,
}
