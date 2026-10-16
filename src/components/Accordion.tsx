import { createContext, useContext, Children, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { AnimatePresence, motion } from '@gpuix/react'
import { useAdwaita, hexToRgba } from '../theme/adwaita'
import { Icon } from './icons'
import { T } from './common'

/**
 * Nova-style accordion (matched 1:1 to the shadcdn-ui reference:
 * `apps/v4/registry/bases/radix/ui/accordion.tsx` + `style-nova.css` +
 * `accordion-example.tsx`, `styleName="radix-nova"`).
 *
 * Reference rules applied here (nova style):
 * - root: `flex w-full flex-col`
 * - item: `not-last:border-b` (1px bottom border on every item except the last)
 * - trigger: `flex flex-1 items-start justify-between border border-transparent`
 *   + `rounded-lg py-2.5 text-left text-sm font-medium`
 *   + icon `text-muted-foreground size-4 ml-auto`
 *   + `hover:underline`, `disabled:pointer-events-none disabled:opacity-50`
 *   + ChevronDown icon when closed, ChevronUp when open (icon swap, no rotation)
 * - content: `overflow-hidden text-sm`, inner `pt-0 pb-2.5`
 *
 * Token mapping (shadcdn dark theme → adwaita-gpuix theme):
 * - `--foreground` → `colors.fg`, `--muted-foreground` → `colors.dim_fg`,
 *   `--border` → `colors.border`, `--card` → `tokens.color.surface.card`,
 *   `--muted` → `colors.view_bg` (closest elevated surface — approximated).
 *
 * Not expressible in GPUix `StyleDesc` (reported, not silently substituted):
 * - `focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring`
 *   (no focus-visible state in StyleDesc) — not-supported
 * - `transition-all` on the trigger (no CSS transition system) — not-supported
 * - `animate-accordion-down/up` height animation via `--radix-accordion-content-height`
 *   (GPUix motion is a fixed property set; content height is unknown a priori) —
 *   approximated with the repo's established 0.15s opacity fade (as in Collapsible)
 */

export interface AccordionProps {
  /**
   * Selection mode. **Authoritative**: drives both the toggle behaviour and
   * the expected `value` shape. `'single'` → `value` is a string (the open
   * item id, or `''` when none); `'multiple'` → `value` is a string array.
   * Single mode is collapsible by default (clicking an open item closes it),
   * matching the reference `collapsible` prop used in its examples.
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

/** True when the item is the last child of its <Accordion> (no bottom border). */
const ItemLastCtx = createContext(false)

interface AccordionItemContextValue {
  itemValue: string
  isOpen: boolean
  disabled: boolean
  onToggle: () => void
}

const AccordionItemCtx = createContext<AccordionItemContextValue | null>(null)

function useAccordionItem(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemCtx)
  return ctx ?? { itemValue: '', isOpen: false, disabled: false, onToggle: () => {} }
}

/**
 * A column of accordion items (reference root: `flex w-full flex-col`).
 * Every item except the last carries a 1px bottom border
 * (reference nova item: `not-last:border-b`).
 */
export function Accordion({ type = 'single', value, onValueChange, children, style }: AccordionProps) {
  const items = Children.toArray(children)
  return (
    <AccordionCtx.Provider value={{ type, value, onValueChange }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          ...style,
        }}
      >
        {items.map((child, i) => (
          <ItemLastCtx.Provider key={`accordion-item-${i}`} value={i === items.length - 1}>
            {child}
          </ItemLastCtx.Provider>
        ))}
      </div>
    </AccordionCtx.Provider>
  )
}

export interface AccordionItemProps {
  value: string
  /** A disabled item cannot be opened (opacity 0.5, pointer-events none, default cursor). */
  disabled?: boolean
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A single accordion item (trigger + collapsible content). Carries the
 * `not-last:border-b` separator (1px, theme border colour) unless it is the
 * last child of the accordion.
 */
export function AccordionItem({ value, disabled, children, style }: AccordionItemProps) {
  const acc = useAccordion()
  const isLast = useContext(ItemLastCtx)
  const t = useAdwaita()
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
          ...(isLast
            ? {}
            : {
                borderBottomWidth: 1,
                borderColor: t.colors.border,
              }),
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
 * The clickable row of an accordion item: title (left) + chevron (right).
 * The chevron **swaps** — `chevronDown` when closed, `chevronUp` when open
 * (reference: two icon slots toggled by `group-aria-expanded`, no rotation).
 * A disabled item skips the toggle and renders dimmed (opacity 0.5) with
 * pointer-events disabled and a default cursor.
 */
export function AccordionTrigger({ children, open, onToggle, style }: AccordionTriggerProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  const item = useAccordionItem()
  const isOpen = open ?? item.isOpen
  const handleToggle = item.disabled ? undefined : onToggle ?? item.onToggle
  return (
    <div
      onClick={handleToggle}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleToggle?.()
      }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexGrow: 1,
        // reference base trigger: `border border-transparent`
        borderWidth: 1,
        borderColor: 'transparent',
        // nova: `rounded-lg` (= --radius 0.625rem = 10px = radii.row)
        borderRadius: radii.row,
        // nova: `py-2.5` (0.625rem = 10px)
        paddingTop: 10,
        paddingBottom: 10,
        cursor: item.disabled ? 'default' : 'pointer',
        // reference: `disabled:pointer-events-none disabled:opacity-50`
        opacity: item.disabled ? 0.5 : 1,
        pointerEvents: item.disabled ? 'none' : 'auto',
        // nova: `hover:underline`
        hover: { textDecoration: 'underline' },
        ...style,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>{children}</div>
      <Icon
        name={isOpen ? 'chevronUp' : 'chevronDown'}
        size={16}
        color={colors.dim_fg}
        style={{ flexShrink: 0 }}
      />
    </div>
  )
}

export interface AccordionContentProps {
  children: ReactNode
  open?: boolean
  style?: Partial<StyleDesc>
}

/**
 * The collapsible body of an accordion item (reference nova:
 * `overflow-hidden text-sm`, inner `pt-0 pb-2.5`). Fades in/out via a
 * `motion.div` opacity transition (GPUix motion fixed property set) and
 * unmounts when closed — the expressible approximation of the reference's
 * `animate-accordion-down/up` height animation.
 */
export function AccordionContent({ children, open, style }: AccordionContentProps) {
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
            overflow: 'hidden',
            // nova content-inner: `pt-0 pb-2.5` (0.625rem = 10px)
            paddingTop: 0,
            paddingBottom: 10,
            ...style,
          }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
