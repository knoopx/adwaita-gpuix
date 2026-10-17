import type { ReactNode } from 'react'
import type { StyleDesc, EventPayload } from '@gpuix/react'
import { motion } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T, Row, FloatingStage, Scrim, CloseButton, dialogCardStyle } from './common'
import { Button } from './Button'

export interface DialogRootProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  contained?: boolean
  children?: ReactNode
}

export interface DialogTriggerProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface DialogContentProps {
  children?: ReactNode

  showCloseButton?: boolean
  style?: Partial<StyleDesc>
}

export interface DialogHeaderProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DialogTitleProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DialogDescriptionProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DialogFooterProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DialogCloseProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

interface DialogContext {
  open: boolean
  onOpenChange: (open: boolean) => void
  contained: boolean
}

import { createContext, useContext } from 'react'
const DialogCtx = createContext<DialogContext | null>(null)

function useDialog(): DialogContext {
  const ctx = useContext(DialogCtx)
  if (!ctx) throw new Error('Dialog components must be used within <Dialog>')
  return ctx
}

const noop = () => {}

export function Dialog({ open, onOpenChange, contained = false, children }: DialogRootProps) {
  return <DialogCtx.Provider value={{ open, onOpenChange, contained }}>{children}</DialogCtx.Provider>
}

export function DialogTrigger({ children, style }: DialogTriggerProps) {
  const { onOpenChange } = useDialog()
  return (
    <div
      onClick={() => onOpenChange(true)}
      style={{ cursor: 'pointer', ...style }}
    >
      {children}
    </div>
  )
}

export function DialogContent({ children, showCloseButton = true, style }: DialogContentProps) {
  const { open, onOpenChange, contained } = useDialog()
  const t = useAdwaita()

  if (!open) return null



  const pos = contained ? 'absolute' : 'fixed'

  return (
    <div
      style={{
        position: pos,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        ...style,
      }}
      onKeyDown={(e: EventPayload) => {


        if (e.key === 'Escape') onOpenChange(false)
      }}
    >
      <Scrim position={pos} onDismiss={() => onOpenChange(false)} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{ position: 'relative' }}
      >
        <div style={dialogCardStyle(t)}>

          {children}
          {showCloseButton ? (
            <CloseButton
              onClick={() => onOpenChange(false)}
              style={{ position: 'absolute', top: 8, right: 8 }}
            />
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}

export function DialogHeader({ children, style }: DialogHeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, style }: DialogTitleProps) {
  const t = useAdwaita()
  return (
    <T size="title2" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export function DialogDescription({ children, style }: DialogDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

export function DialogFooter({ children, style }: DialogFooterProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function DialogClose({ children, style }: DialogCloseProps) {
  const { onOpenChange } = useDialog()
  return (
    <CloseButton onClick={() => onOpenChange(false)} style={style}>
      {children}
    </CloseButton>
  )
}

export function DialogShowcase(): ReactNode {
  const t = useAdwaita()
  return (
    <Shot>
      <Row label="Closed trigger">
        <Dialog open={false} onOpenChange={noop}>
          <DialogTrigger>
            <Button label="Open dialog" onClick={noop} />
          </DialogTrigger>
        </Dialog>
      </Row>
      <Row label="Open content" col>
        <ShotItem label="header + title + description + footer (auto close button)">
          <FloatingStage width={480} height={190}>
            <Dialog open={true} onOpenChange={noop} contained>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog title</DialogTitle>
                  <DialogDescription>A description of what this dialog is about.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button label="Cancel" onClick={noop} />
                  <Button variant="destructive" label="Delete" onClick={noop} />
                  <Button variant="suggested" label="Save" onClick={noop} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FloatingStage>
        </ShotItem>
        <ShotItem label="showCloseButton=false + custom DialogClose in the footer">
          <FloatingStage width={480} height={190}>
            <Dialog open={true} onOpenChange={noop} contained>
              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>Custom close</DialogTitle>
                  <DialogDescription>The auto close button is disabled; the footer carries a DialogClose.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>
                    <T size="caption" color={t.colors.dim_fg}>Close</T>
                  </DialogClose>
                  <Button label="Cancel" onClick={noop} />
                  <Button variant="suggested" label="Save" onClick={noop} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FloatingStage>
        </ShotItem>
      </Row>
    </Shot>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Shot, ShotItem } from './common'

export const DialogShot: ComponentShot = {
  name: 'Dialog',
  el: <DialogShowcase />,
}
