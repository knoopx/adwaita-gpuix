import { createContext, useContext, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { AnimatePresence, motion } from '@gpuix/react'
import { DisclosureTrigger } from './common'

export interface CollapsibleProps {

  open?: boolean
  onOpenChange?: (open: boolean) => void

  defaultOpen?: boolean
  children: ReactNode
  style?: Partial<StyleDesc>
}

interface CollapsibleContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleCtx = createContext<CollapsibleContextValue | null>(null)

function useCollapsible(): CollapsibleContextValue {
  const ctx = useContext(CollapsibleCtx)
  return ctx ?? { open: true, onOpenChange: () => {} }
}

export function Collapsible({ open, onOpenChange, defaultOpen, children, style }: CollapsibleProps) {
  const [internal, setInternal] = useState(defaultOpen ?? false)
  const isOpen = open ?? internal
  const handleOpenChange = (next: boolean) => {
    if (open === undefined) setInternal(next)
    onOpenChange?.(next)
  }
  return (
    <CollapsibleCtx.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
        {children}
      </div>
    </CollapsibleCtx.Provider>
  )
}

export interface CollapsibleTriggerProps {
  children: ReactNode
  open?: boolean
  onToggle?: () => void
  style?: Partial<StyleDesc>
}

export function CollapsibleTrigger({ children, open, onToggle, style }: CollapsibleTriggerProps) {
  const ctx = useCollapsible()
  const isOpen = open ?? ctx.open
  return (
    <DisclosureTrigger
      onToggle={onToggle ?? (() => ctx.onOpenChange(!isOpen))}
      iconSize={14}
      iconPosition="start"
      style={{ paddingLeft: 8, paddingRight: 8, ...style }}
    >
      {children}
    </DisclosureTrigger>
  )
}

export interface CollapsibleContentProps {
  children: ReactNode
  open?: boolean
  style?: Partial<StyleDesc>
}

export function CollapsibleContent({ children, open, style }: CollapsibleContentProps) {
  const ctx = useCollapsible()
  const isOpen = open ?? ctx.open
  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          key="collapsible-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', paddingLeft: 8, ...style }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { useAdwaita } from '../theme/adwaita'
import { Row, T, Shot, ShotItem } from './common'

function CollapsibleFrame({ children }: { children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderWidth: 1, borderColor: t.colors.border, borderRadius: 8, padding: 8 }}>
      {children}
    </div>
  )
}

export const CollapsibleShot: ComponentShot = {
  name: 'Collapsible',
  el: (
    <Shot>
      <Row label="States">
        <ShotItem label="open (content visible)">
          <CollapsibleFrame>
            <Collapsible open onOpenChange={() => {}}>
              <CollapsibleTrigger open>
                <T>Open section</T>
              </CollapsibleTrigger>
              <CollapsibleContent open>
                <T>Content is visible (chevron rotated).</T>
              </CollapsibleContent>
            </Collapsible>
          </CollapsibleFrame>
        </ShotItem>
        <ShotItem label="closed (content hidden)">
          <CollapsibleFrame>
            <Collapsible open={false} onOpenChange={() => {}}>
              <CollapsibleTrigger>
                <T>Closed section</T>
              </CollapsibleTrigger>
              <CollapsibleContent open={false}>
                <T>Hidden content — not rendered.</T>
              </CollapsibleContent>
            </Collapsible>
          </CollapsibleFrame>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
