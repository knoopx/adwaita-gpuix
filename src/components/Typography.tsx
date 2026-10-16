import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { CodeChip, T } from './common'

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A heading that maps heading levels to Adwaita type scale:
 * 1→title1, 2→title2, 3→title3, 4→title4, 5→body, 6→body.
 */
export function Heading({ level = 2, children, style }: HeadingProps) {
  const t = useAdwaita()
  const { colors, typography } = t

  const sizes: Record<number, number> = {
    1: typography.title1,
    2: typography.title2,
    3: typography.title3,
    4: typography.title4,
    5: typography.body,
    6: typography.body,
  }

  return (
    <T size="title2" color={colors.fg} weight={700} style={{ fontSize: sizes[level], ...style }}>
      {children}
    </T>
  )
}

export interface ParagraphProps {
  children: ReactNode
  dim?: boolean
  style?: Partial<StyleDesc>
}

/** A body-size paragraph. `dim` uses the secondary foreground colour. */
export function Paragraph({ children, dim, style }: ParagraphProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={dim ? t.colors.dim_fg : t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export interface SmallProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Caption-size dim text. */
export function Small({ children, style }: SmallProps) {
  const t = useAdwaita()
  return (
    <T size="caption" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  )
}

export interface BlockquoteProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A dimmed quote block with a 3px left accent border. */
export function Blockquote({ children, style }: BlockquoteProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: 12,
        borderLeftWidth: 3,
        borderColor: colors.accent,
        backgroundColor: colors.button_bg,
        borderRadius: 4,
        ...style,
      }}
    >
      <T size="body" color={colors.dim_fg} style={{ whiteSpace: 'normal' }}>
        {children}
      </T>
    </div>
  )
}

export interface InlineCodeProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Inline monospace code: button_bg background, 1px border, radius 4, padding 2. */
export function InlineCode({ children, style }: InlineCodeProps) {
  return (
    <CodeChip padding={2} style={style}>
      {children}
    </CodeChip>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row } from './common'

/** A captioned shot item: a small dim caption above the item. */
function ShotItem({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>{label}</T>
      {children}
    </div>
  )
}

export const TypographyShot: ComponentShot = {
  name: 'Typography',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Headings (levels 1–6)" col>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Heading level={1}>Heading 1</Heading>
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Heading level={4}>Heading 4</Heading>
          <Heading level={5}>Heading 5</Heading>
          <Heading level={6}>Heading 6</Heading>
        </div>
      </Row>
      <Row label="Body" col>
        <ShotItem label="paragraph">
          <Paragraph>A paragraph of body text.</Paragraph>
        </ShotItem>
        <ShotItem label="paragraph (dim)">
          <Paragraph dim>A dim paragraph of body text.</Paragraph>
        </ShotItem>
        <ShotItem label="small">
          <Small>A small caption-sized line of text.</Small>
        </ShotItem>
      </Row>
      <Row label="Quote & inline code" col>
        <ShotItem label="blockquote">
          <Blockquote>A blockquote of wise words, quoted from the source.</Blockquote>
        </ShotItem>
        <ShotItem label="inline code">
          <Paragraph>
            A paragraph with <InlineCode>inline code</InlineCode> in the middle.
          </Paragraph>
        </ShotItem>
      </Row>
    </div>
  ),
}
