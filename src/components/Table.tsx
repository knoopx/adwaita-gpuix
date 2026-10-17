import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba } from '../theme/adwaita'
import { T } from './common'

export interface TableProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function Table({ children, style }: TableProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface TableHeaderProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function TableHeader({ children, style }: TableHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderBottomWidth: 1,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface TableBodyProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function TableBody({ children, style }: TableBodyProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>{children}</div>
  )
}

export interface TableFooterProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function TableFooter({ children, style }: TableFooterProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderTopWidth: 1,
        borderColor: colors.border,
        backgroundColor: hexToRgba(colors.fg, 0.04),
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface TableFootCellProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function TableFootCell({ children, style }: TableFootCellProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        flexGrow: 1,
        ...style,
      }}
    >
      <T size="body" weight={500} color={t.colors.fg}>
        {children}
      </T>
    </div>
  )
}

export interface TableRowProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function TableRow({ children, style }: TableRowProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: colors.border,
        hover: { backgroundColor: colors.accentTint },
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface TableHeadProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function TableHead({ children, style }: TableHeadProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        flexGrow: 1,
        ...style,
      }}
    >
      <T size="caption" weight={700} color={t.colors.dim_fg}>
        {children}
      </T>
    </div>
  )
}

export interface TableCellProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function TableCell({ children, style }: TableCellProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        flexGrow: 1,
        ...style,
      }}
    >
      <T size="body" color={t.colors.fg}>
        {children}
      </T>
    </div>
  )
}

export interface TableCaptionProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function TableCaption({ children, style }: TableCaptionProps) {
  const t = useAdwaita()
  return (
    <div style={{ padding: 8, ...style }}>
      <T size="caption" color={t.colors.dim_fg}>
        {children}
      </T>
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const TableShot: ComponentShot = {
  name: 'Table',
  el: (
    <Shot>
      <Row label="Header + body + footer" col>
        <ShotItem label="full table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Ada</TableCell>
                <TableCell>ada@example.com</TableCell>
                <TableCell>Admin</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Grace</TableCell>
                <TableCell>grace@example.com</TableCell>
                <TableCell>Editor</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Alan</TableCell>
                <TableCell>alan@example.com</TableCell>
                <TableCell>Viewer</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableFootCell>Total</TableFootCell>
                <TableFootCell>—</TableFootCell>
                <TableFootCell>3 users</TableFootCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ShotItem>
      </Row>
      <Row label="Caption">
        <ShotItem label="caption below the table">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Theme</TableCell>
                  <TableCell>Dark</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <TableCaption>Settings summary — 1 row.</TableCaption>
          </div>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
