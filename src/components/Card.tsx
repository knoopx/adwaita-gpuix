import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface FrameProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** A rounded surface with a 1px border (Adwaita `frame`). */
export function Frame({ children, style }: FrameProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  return (
    <div
      style={{
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface CardProps {
  title?: string
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** Adwaita `card`: a bordered, rounded surface with an optional title. */
export function Card({ title, children, style }: CardProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <Frame
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        gap: 8,
        ...style,
      }}
    >
      {title ? (
        <T size="title4" weight={700} color={colors.fg}>
          {title}
        </T>
      ) : null}
      {children}
    </Frame>
  )
}

// ── shadcn Card sub-parts (thin wrappers over Card/Frame) ──────────────

export interface CardHeaderProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** Card header area: padding = spacing.paddingTight. */
export function CardHeader({ children, style }: CardHeaderProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: t.spacing.paddingTight,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface CardTitleProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Card title: title4 bold. */
export function CardTitle({ children, style }: CardTitleProps) {
  const t = useAdwaita()
  return (
    <T size="title4" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export interface CardDescriptionProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Card description: dim body text. */
export function CardDescription({ children, style }: CardDescriptionProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

export interface CardContentProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** Card content area: padding = spacing.paddingTight. */
export function CardContent({ children, style }: CardContentProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: t.spacing.paddingTight,
        flexGrow: 1,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface CardFooterProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** Card footer area: padding = spacing.paddingTight. */
export function CardFooter({ children, style }: CardFooterProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: t.spacing.paddingTight,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface CardActionProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * The top-right action slot of a card (shadcn `CardAction`). Place it as the
 * last child of a `CardHeader` (a column): `alignSelf: 'flex-end'` pins it to
 * the top-right corner. For a title + action on one line, wrap both in a
 * `display: 'flex', flexDirection: 'row', justifyContent: 'space-between'`
 * row inside the header.
 */
export function CardAction({ children, style }: CardActionProps) {
  return (
    <div
      style={{
        alignSelf: 'flex-end',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'
import { Button } from './Button'
import { Badge } from './Badge'

export const CardShot: ComponentShot = {
  name: 'Card',
  el: (
    <Shot>
      <Row label="Variants" col>
        <ShotItem label="Card (title prop)">
          <Card title="Simple card">
            <T>Card body content.</T>
          </Card>
        </ShotItem>
        <ShotItem label="Card (compound sub-parts + action)">
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <CardTitle>Card title</CardTitle>
                  <CardDescription>A short description of the card.</CardDescription>
                </div>
                <CardAction><Badge>New</Badge></CardAction>
              </div>
            </CardHeader>
            <CardContent>
              <T>Card body content goes here.</T>
            </CardContent>
            <CardFooter>
              <Button label="Action" onClick={() => {}} />
              <Button variant="secondary" label="Details" onClick={() => {}} />
            </CardFooter>
          </Card>
        </ShotItem>
        <ShotItem label="Frame (plain surface)">
          <Frame>
            <div style={{ padding: 16 }}>
              <T>Frame content.</T>
            </div>
          </Frame>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
