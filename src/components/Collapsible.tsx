import { createContext, useContext, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { AnimatePresence, motion } from '@gpuix/react'
import { DisclosureTrigger } from './common'

export interface CollapsibleProps {
  /** Controlled open state. When `undefined`, the component is uncontrolled (see `defaultOpen`). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Uncontrolled starting state (used when `open` is `undefined`). */
  defaultOpen?: boolean
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A simple collapsible container. The trigger toggles visibility of the content.
 *
 * Supports both controlled (`open` + `onOpenChange`) and uncontrolled
 * (`defaultOpen`) modes: when `open` is `undefined`, an internal state is
 * kept (starting from `defaultOpen ?? false`).
 */
interface CollapsibleContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleCtx = createContext<CollapsibleContextValue | null>(null)

/**
 * Reads the enclosing <Collapsible> open state. Returns a safe default
 * (open, no-op) when used outside a provider so standalone renders keep
 * working.
 */
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

/** The trigger button for a Collapsible (row with chevron). */
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

/**
 * The collapsible body. Hidden when closed (reads the parent open state).
 * The body fades in/out via a `motion.div` opacity transition (GPUix motion
 * fixed property set — no DOM height keyframes).
 */
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
