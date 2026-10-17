import { createContext, useContext, Children, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { AnimatePresence, motion } from '@gpuix/react'
import { useAdwaita, hexToRgba } from '../theme/adwaita'
import { Icon } from './icons'
import { T } from './common'

export interface AccordionProps {

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

  disabled?: boolean
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function AccordionItem({ value, disabled, children, style }: AccordionItemProps) {
  const acc = useAccordion()
  const isLast = useContext(ItemLastCtx)
  const t = useAdwaita()
  const multiple = acc.type === 'multiple'

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

        borderWidth: 1,
        borderColor: 'transparent',

        borderRadius: radii.row,

        paddingTop: 10,
        paddingBottom: 10,
        cursor: item.disabled ? 'default' : 'pointer',

        opacity: item.disabled ? 0.5 : 1,
        pointerEvents: item.disabled ? 'none' : 'auto',

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

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

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

        backgroundColor: t.tokens.color.surface.card,
        borderWidth: 1,

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




            padding: 4,
          }}
        >
          <ShotItemBody item={item} />
        </AccordionItem>
      ))}
    </Accordion>
  )
}
