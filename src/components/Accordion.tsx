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

// ── Showcase shot ─────────────────────────────────────────────────────────
//
// The five variants of the reference `accordion-example.tsx` (nova style):
// Basic (single, collapsible), Multiple, With Borders, In Card, With
// Disabled — using the example's item content (the screenshot set).

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

/** Reference example width: `max-w-lg` (32rem = 512px). */
const LAYOUT: Partial<StyleDesc> = { maxWidth: 512 }

export const AccordionShot: ComponentShot = {
  name: 'Accordion',
  el: (
    <Shot>
      <Row label="Single (one open item, collapsible)" col>
        <ShotItem label="shipping open, return policy + support closed">
          <Accordion type="single" value="shipping" onValueChange={() => {}} style={LAYOUT}>
            <AccordionItem value="shipping">
              <AccordionTrigger>
                <T size="body" weight={500}>What are your shipping options?</T>
              </AccordionTrigger>
              <AccordionContent>
                <T size="body">
                  We offer standard (5–7 days), express (2–3 days), and overnight shipping. Free shipping on international orders.
                </T>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>
                <T size="body" weight={500}>What is your return policy?</T>
              </AccordionTrigger>
              <AccordionContent>
                <T size="body">You can return any item within 30 days of purchase for a full refund.</T>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="support">
              <AccordionTrigger>
                <T size="body" weight={500}>How can I contact customer support?</T>
              </AccordionTrigger>
              <AccordionContent>
                <T size="body">Reach us by email, live chat, or phone — we respond within 24 hours.</T>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ShotItem>
      </Row>
      <Row label="Multiple (several open items)" col>
        <ShotItem label="notification settings open">
          <Accordion type="multiple" value={['notifications']} onValueChange={() => {}} style={LAYOUT}>
            <AccordionItem value="notifications">
              <AccordionTrigger>
                <T size="body" weight={500}>Notification Settings</T>
              </AccordionTrigger>
              <AccordionContent>
                <T size="body">
                  Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.
                </T>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="privacy">
              <AccordionTrigger>
                <T size="body" weight={500}>Privacy &amp; Security</T>
              </AccordionTrigger>
              <AccordionContent>
                <T size="body">Control your data, sessions, and two-factor authentication.</T>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="billing">
              <AccordionTrigger>
                <T size="body" weight={500}>Billing &amp; Subscription</T>
              </AccordionTrigger>
              <AccordionContent>
                <T size="body">Manage your payment method and download invoices.</T>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ShotItem>
      </Row>
      <Row label="With borders (gap-2, bordered rounded items)" col>
        <ShotItem label="billing open, security + integrations closed">
          <BorderShot />
        </ShotItem>
      </Row>
      <Row label="In card" col>
        <ShotItem label="plans open, billing + cancel closed">
          <CardShot />
        </ShotItem>
      </Row>
      <Row label="With disabled (bordered frame, p-1 items)" col>
        <ShotItem label="all closed, premium item disabled">
          <DisabledShot />
        </ShotItem>
      </Row>
    </Shot>
  ),
}

/**
 * The shared trigger + content pair of the bordered sub-shots: a padded
 * trigger (body, weight 500) and a padded content (body; dim foreground
 * when `dimContent`). Extracted so BorderShot / DisabledShot share one
 * markup; each caller keeps its own item data and item-level props.
 */
function ShotItemBody({ item, dimContent }: { item: { trigger: string; content: string }; dimContent?: boolean }) {
  const t = useAdwaita()
  return (
    <>
      <AccordionTrigger style={{ paddingLeft: 10, paddingRight: 10 }}>
        <T size="body" weight={500}>
          {item.trigger}
        </T>
      </AccordionTrigger>
      <AccordionContent style={{ paddingLeft: 10, paddingRight: 10 }}>
        <T size="body" color={dimContent ? t.colors.dim_fg : undefined}>
          {item.content}
        </T>
      </AccordionContent>
    </>
  )
}

/**
 * Reference `AccordionWithBorders` (nova): root `gap-2` (8px); items
 * `rounded-lg border`; trigger `px-2.5 text-sm`; content `px-2.5 text-sm`
 * in muted-foreground.
 */
function BorderShot() {
  const t = useAdwaita()
  const items = [
    {
      value: 'billing',
      trigger: 'How does billing work?',
      content:
        'We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you can cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members.',
    },
    {
      value: 'security',
      trigger: 'Is my data secure?',
      content:
        'Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits.',
    },
    {
      value: 'integration',
      trigger: 'What integrations do you support?',
      content: 'We integrate with 500+ popular tools including Slack, Zapier, Salesforce, HubSpot, and more.',
    },
  ]
  return (
    <Accordion type="single" value="billing" onValueChange={() => {}} style={{ ...LAYOUT, gap: 8 }}>
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          style={{
            // nova `style-nova:rounded-lg style-nova:border`
            borderWidth: 1,
            borderColor: t.colors.border,
            borderRadius: t.radii.row,
          }}
        >
          <ShotItemBody item={item} dimContent />
        </AccordionItem>
      ))}
    </Accordion>
  )
}

/**
 * Reference `AccordionInCard` (nova card): `bg-card ring-1 ring-foreground/10`
 * `rounded-xl py-(--card-spacing) gap-(--card-spacing) overflow-hidden`
 * (`--card-spacing` = spacing(4) = 16px); header `gap-1 px-(--card-spacing)`;
 * title `text-base leading-snug font-medium`; description
 * `text-muted-foreground text-sm`; content `px-(--card-spacing)`.
 */
function CardShot() {
  const t = useAdwaita()
  const { colors } = t
  const items = [
    {
      value: 'plans',
      trigger: 'What subscription plans do you offer?',
      content:
        'We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month). Each plan includes increasing storage limits, API access, priority support, and team collaboration features.',
    },
    {
      value: 'billing',
      trigger: 'How does billing work?',
      content:
        'Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal, and ACH transfers.',
    },
    {
      value: 'cancel',
      trigger: 'How do I cancel my subscription?',
      content:
        'You can cancel your subscription anytime from your account settings. There are no cancellation fees or penalties.',
    },
  ]
  return (
    <div
      style={{
        maxWidth: 512,
        // nova card: `bg-card ... rounded-xl` (rounded-xl = --radius*1.4 = 14px)
        backgroundColor: t.tokens.color.surface.card,
        borderWidth: 1,
        // nova card: `ring-1 ring-foreground/10`
        borderColor: hexToRgba(colors.fg, 0.1),
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 16, paddingRight: 16 }}>
        <T size="title2" weight={500} style={{ lineHeight: 1.375 }}>
          Subscription &amp; Billing
        </T>
        <T size="body" color={colors.dim_fg}>
          Common questions about your account, plans, payments and cancellations.
        </T>
      </div>
      <div style={{ paddingLeft: 16, paddingRight: 16, display: 'flex', flexDirection: 'column' }}>
        <Accordion type="single" value="plans" onValueChange={() => {}}>
          {items.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>
                <T size="body" weight={500}>
                  {item.trigger}
                </T>
              </AccordionTrigger>
              <AccordionContent>
                <T size="body">{item.content}</T>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

/**
 * Reference `AccordionWithDisabled` (nova): root `max-w-lg overflow-hidden
 * border`; items `p-1 data-open:bg-muted/50`; trigger + content `px-2.5`.
 * `--muted` is mapped to `view_bg` (approximated); the 50% alpha is exact.
 */
function DisabledShot() {
  const t = useAdwaita()
  const { colors } = t
  const items = [
    {
      value: 'history',
      trigger: 'Can I access my account history?',
      content:
        'Yes, you can view your complete account history including all transactions, plan changes, and support tickets in the Account History section of your dashboard.',
      disabled: false,
    },
    {
      value: 'premium',
      trigger: 'Premium feature information',
      content: 'This section contains information about premium features. Upgrade your plan to access this content.',
      disabled: true,
    },
    {
      value: 'email',
      trigger: 'How do I update my email address?',
      content:
        "You can update your email address in your account settings. You'll receive a verification email at your new address to confirm the change.",
      disabled: false,
    },
  ]
  return (
    <Accordion
      type="single"
      value=""
      onValueChange={() => {}}
      style={{ ...LAYOUT, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          style={{
            // nova item: `p-1` (0.25rem = 4px). Open-state background
            // `data-open:bg-muted/50` is expressible via the item `style`
            // prop (e.g. `background: hexToRgba(colors.view_bg, 0.5)`);
            // omitted here — the shot renders all items closed.
            padding: 4,
          }}
        >
          <ShotItemBody item={item} />
        </AccordionItem>
      ))}
    </Accordion>
  )
}
