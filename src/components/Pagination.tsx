import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface PaginationProps {
  page: number
  pages: number
  onPageChange: (page: number) => void
  style?: Partial<StyleDesc>
}

/**
 * Build the visible page sequence for the data-driven `Pagination`: a window
 * of three around the current page with the first/last always visible and an
 * ellipsis where the gap to the window is > 1. When `pages <= 5` every page
 * is shown (no ellipsis needed).
 */
export function pageSequence(page: number, pages: number): (number | 'ellipsis')[] {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1)
  const seq: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pages - 1, page + 1)
  if (start > 2) seq.push('ellipsis')
  for (let i = start; i <= end; i++) seq.push(i)
  if (end < pages - 1) seq.push('ellipsis')
  seq.push(pages)
  return seq
}

/**
 * A row of pagination buttons: prev, numbered pages (with ellipsis for
 * truncated ranges), next. Current page = accent bg.
 */
export function Pagination({ page, pages, onPageChange, style }: PaginationProps) {
  const t = useAdwaita()
  const { colors, radii } = t

  const sequence = pageSequence(page, pages)

  const pageBtnStyle = (active: boolean): Partial<StyleDesc> => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: active ? 'transparent' : colors.border,
    backgroundColor: active ? colors.accent : 'transparent',
    cursor: 'pointer',
    hover: active ? { backgroundColor: colors.accent } : { backgroundColor: colors.button_bg },
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        ...style,
      }}
    >
      {/* Previous */}
      <div
        onClick={() => onPageChange(Math.max(1, page - 1))}
        style={{
          ...pageBtnStyle(false),
          cursor: page <= 1 ? 'default' : 'pointer',
          opacity: page <= 1 ? 0.4 : 1,
        }}
      >
        <T size="body" color={colors.dim_fg}>
          ‹
        </T>
      </div>

      {/* Page numbers + ellipses */}
      {sequence.map((n, i) =>
        n === 'ellipsis' ? (
          <PaginationEllipsis key={`e-${i}`} />
        ) : (
          <div key={n} onClick={() => onPageChange(n)} style={pageBtnStyle(n === page)}>
            <T size="body" color={n === page ? colors.accent_fg : colors.fg}>
              {String(n)}
            </T>
          </div>
        ),
      )}

      {/* Next */}
      <div
        onClick={() => onPageChange(Math.min(pages, page + 1))}
        style={{
          ...pageBtnStyle(false),
          cursor: page >= pages ? 'default' : 'pointer',
          opacity: page >= pages ? 0.4 : 1,
        }}
      >
        <T size="body" color={colors.dim_fg}>
          ›
        </T>
      </div>
    </div>
  )
}

export interface PaginationContentProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** Wrapper for pagination content. */
export function PaginationContent({ children, style }: PaginationContentProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, ...style }}>
      {children}
    </div>
  )
}

export interface PaginationItemProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A single pagination item wrapper. */
export function PaginationItem({ children, style }: PaginationItemProps) {
  return <div style={style}>{children}</div>
}

export interface PaginationLinkProps {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  style?: Partial<StyleDesc>
}

/** A pagination page link (button). */
export function PaginationLink({ children, active, onClick, style }: PaginationLinkProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32,
        height: 32,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: active ? 'transparent' : colors.border,
        backgroundColor: active ? colors.accent : 'transparent',
        cursor: 'pointer',
        hover: { backgroundColor: active ? colors.accent : colors.button_bg },
        ...style,
      }}
    >
      <T size="body" color={active ? colors.accent_fg : colors.fg}>
        {children}
      </T>
    </div>
  )
}

export interface PaginationPreviousProps {
  onClick?: () => void
  disabled?: boolean
  style?: Partial<StyleDesc>
}

/** 32×32 previous/next nav button: cursor/opacity by disabled, hover when enabled. */
function PageNavButton({
  children,
  disabled,
  onClick,
  style,
}: {
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 8,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        hover: disabled ? undefined : { backgroundColor: colors.button_bg },
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Previous page button. */
export function PaginationPrevious({ onClick, disabled, style }: PaginationPreviousProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <PageNavButton disabled={disabled} onClick={onClick} style={style}>
      <T size="body" color={colors.dim_fg}>
        ‹
      </T>
    </PageNavButton>
  )
}

export interface PaginationNextProps {
  onClick?: () => void
  disabled?: boolean
  style?: Partial<StyleDesc>
}

/** Next page button. */
export function PaginationNext({ onClick, disabled, style }: PaginationNextProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <PageNavButton disabled={disabled} onClick={onClick} style={style}>
      <T size="body" color={colors.dim_fg}>
        ›
      </T>
    </PageNavButton>
  )
}

export interface PaginationEllipsisProps {
  style?: Partial<StyleDesc>
}

/** A 36×36 centred “…” slot marking a truncated page range. */
export function PaginationEllipsis({ style }: PaginationEllipsisProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        ...style,
      }}
    >
      <T size="body" color={t.colors.dim_fg}>
        …
      </T>
    </div>
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

export const PaginationShot: ComponentShot = {
  name: 'Pagination',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Data-driven (page, pages)" col>
        <ShotItem label="first page — prev disabled">
          <Pagination page={1} pages={8} onPageChange={() => {}} />
        </ShotItem>
        <ShotItem label="middle — ellipsis both sides">
          <Pagination page={4} pages={8} onPageChange={() => {}} />
        </ShotItem>
        <ShotItem label="last page — next disabled">
          <Pagination page={8} pages={8} onPageChange={() => {}} />
        </ShotItem>
        <ShotItem label="≤5 pages — no ellipsis">
          <Pagination page={2} pages={4} onPageChange={() => {}} />
        </ShotItem>
      </Row>
      <Row label="Compound (content / item / link / nav / ellipsis)" col>
        <ShotItem label="active link + disabled prev">
          <PaginationContent>
            <PaginationPrevious disabled />
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink active>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>5</PaginationLink>
            </PaginationItem>
            <PaginationNext />
          </PaginationContent>
        </ShotItem>
      </Row>
    </div>
  ),
}
