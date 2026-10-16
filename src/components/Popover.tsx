import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { FloatingPanel, T, TextPart } from './common'

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
  return (
    <TextPart weight={600} style={style}>
      {children}
    </TextPart>
  )
}

export function PopoverDescription({ children, style }: PopoverDescriptionProps) {
  return (
    <TextPart dim style={style}>
      {children}
    </TextPart>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, FloatingStage, Shot, ShotItem } from './common'
import { Button } from './Button'

/** A compact open-popover anchor: trigger button + anchored content on a side. */
function SidePopover({ side, text }: { side: 'top' | 'right' | 'bottom' | 'left'; text: string }) {
  return (
    <Popover open={true} onOpenChange={() => {}}>
      <PopoverAnchor>
        <PopoverTrigger>
          <Button label={side} onClick={() => {}} />
        </PopoverTrigger>
        <PopoverContent side={side}>
          <T size="caption">{text}</T>
        </PopoverContent>
      </PopoverAnchor>
    </Popover>
  )
}

export const PopoverShot: ComponentShot = {
  name: 'Popover',
  el: (
    <Shot>
      <Row label="Closed trigger">
        <Popover open={false} onOpenChange={() => {}}>
          <PopoverTrigger>
            <Button label="Open popover" onClick={() => {}} />
          </PopoverTrigger>
        </Popover>
      </Row>
      <Row label="Open · sides (side prop, anchored in a stage)" col>
        <FloatingStage width={480} height={120}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <ShotItem label="side=top">
              <SidePopover side="top" text="Above the trigger" />
            </ShotItem>
            <ShotItem label="side=right">
              <SidePopover side="right" text="Right of the trigger" />
            </ShotItem>
            <ShotItem label="side=bottom">
              <SidePopover side="bottom" text="Below the trigger" />
            </ShotItem>
            <ShotItem label="side=left">
              <SidePopover side="left" text="Left of the trigger" />
            </ShotItem>
          </div>
        </FloatingStage>
      </Row>
      <Row label="Open · rich content (header + title + description)" col>
        <FloatingStage width={480} height={170}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Popover open={true} onOpenChange={() => {}}>
              <PopoverAnchor>
                <PopoverTrigger>
                  <Button label="Open popover" onClick={() => {}} />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle>Popover title</PopoverTitle>
                    <PopoverDescription>A dim description line under the title.</PopoverDescription>
                  </PopoverHeader>
                  <Button label="Confirm" onClick={() => {}} />
                </PopoverContent>
              </PopoverAnchor>
            </Popover>
          </div>
        </FloatingStage>
      </Row>
    </Shot>
  ),
}
