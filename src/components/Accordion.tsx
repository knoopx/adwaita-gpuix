import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { AnimatePresence, motion } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { DisclosureTrigger } from './common'

export interface AccordionProps {
  /**
   * Selection mode. **Authoritative**: drives both the toggle behaviour and
   * the expected `value` shape. `'single'` → `value` is a string (the open
   * item id, or `''` when none); `'multiple'` → `value` is a string array.
   */
  type?: 'single' | 'multiple'
  value: string | string[]
  onValueChange: (value: string | string[]) => void
  children: ReactNode
  style?: Partial<StyleDesc>
}

interface AccordionContextValue {
  type: 'single' | 'multiple'
  value: string | string[]
  onValueChange: (value: string | string[]) => void
}

const AccordionCtx = createContext<AccordionContextValue | null>(null)

function useAccordion(): AccordionContextValue {
  const ctx = useContext(AccordionCtx)
  return ctx ?? { type: 'single', value: '', onValueChange: () => {} }
}

interface AccordionItemContextValue {
  itemValue: string
  isOpen: boolean
  disabled: boolean
  onToggle: () => void
}

const AccordionItemCtx = createContext<AccordionItemContextValue | null>(null)

function useAccordionItem(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemCtx)
  return ctx ?? { itemValue: '', isOpen: true, disabled: false, onToggle: () => {} }
}

/**
 * Adwaita expander-style accordion. Items have view_bg background,
 * row radius, and a 1px border between items.
 *
 * `type` is authoritative: it decides the toggle semantics and the shape of
 * `value` (string for `single`, string[] for `multiple`).
 */
export function Accordion({ type = 'single', value, onValueChange, children, style }: AccordionProps) {
  return (
    <AccordionCtx.Provider value={{ type, value, onValueChange }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...style,
        }}
      >
        {children}
      </div>
    </AccordionCtx.Provider>
  )
}

export interface AccordionItemProps {
  value: string
  /** A disabled item cannot be opened (opacity 0.5, default cursor). */
  disabled?: boolean
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A single accordion item (trigger + collapsible content). */
export function AccordionItem({ value, disabled, children, style }: AccordionItemProps) {
  const acc = useAccordion()
  const multiple = acc.type === 'multiple'
  // Coerce the value shape to the mode: array for multiple, string for single.
  const openList = multiple ? (Array.isArray(acc.value) ? acc.value : acc.value ? [acc.value] : []) : []
  const isOpen = multiple ? openList.includes(value) : acc.value === value
  const onToggle = () => {
    if (disabled) return
    if (multiple) {
      const next = isOpen ? openList.filter((v) => v !== value) : [...openList, value]
      acc.onValueChange(next)
    } else {
      acc.onValueChange(isOpen ? '' : value)
    }
  }
  return (
    <AccordionItemCtx.Provider value={{ itemValue: value, isOpen, disabled: disabled ?? false, onToggle }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...style,
        }}
      >
        {children}
      </div>
    </AccordionItemCtx.Provider>
  )
}

export interface AccordionTriggerProps {
  children: ReactNode
  open?: boolean
  onToggle?: () => void
  style?: Partial<StyleDesc>
}

/**
 * The clickable row of an accordion item: title + rotating chevron. A
 * disabled item skips the toggle and renders dimmed with a default cursor.
 */
export function AccordionTrigger({ children, open, onToggle, style }: AccordionTriggerProps) {
  void open
  const item = useAccordionItem()
  const t = useAdwaita()
  const { colors, radii } = t
  return (
    <DisclosureTrigger
      onToggle={item.disabled ? undefined : onToggle ?? item.onToggle}
      iconSize={16}
      iconPosition="end"
      style={{
        minHeight: 40,
        padding: 12,
        borderRadius: radii.row,
        backgroundColor: colors.view_bg,
        opacity: item.disabled ? 0.5 : 1,
        cursor: item.disabled ? 'default' : 'pointer',
        ...style,
      }}
    >
      {children}
    </DisclosureTrigger>
  )
}

export interface AccordionContentProps {
  children: ReactNode
  open?: boolean
  style?: Partial<StyleDesc>
}

/**
 * The collapsible body of an accordion item. Fades in/out via a `motion.div`
 * opacity transition (GPUix motion fixed property set) and unmounts when
 * closed.
 */
export function AccordionContent({ children, open, style }: AccordionContentProps) {
  const t = useAdwaita()
  const { colors } = t
  const item = useAccordionItem()
  const isOpen = open ?? item.isOpen
  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          key="accordion-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 12,
            borderTopWidth: 1,
            borderColor: colors.border,
            ...style,
          }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
