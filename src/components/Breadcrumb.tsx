import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface BreadcrumbProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function Breadcrumb({ children, style }: BreadcrumbProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface BreadcrumbListProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function BreadcrumbList({ children, style }: BreadcrumbListProps) {
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
      {children}
    </div>
  )
}

export interface BreadcrumbItemProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function BreadcrumbItem({ children, style }: BreadcrumbItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface BreadcrumbLinkProps {
  children: ReactNode
  onClick?: () => void
  style?: Partial<StyleDesc>
}

export function BreadcrumbLink({ children, onClick, style }: BreadcrumbLinkProps) {
  const t = useAdwaita()
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        hover: { textDecoration: 'underline' },
        ...style,
      }}
    >
      <T size="body" color={t.colors.accent}>
        {children}
      </T>
    </div>
  )
}

export interface BreadcrumbPageProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function BreadcrumbPage({ children, style }: BreadcrumbPageProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.fg} style={style}>
      {children}
    </T>
  )
}

export interface BreadcrumbSeparatorProps {
  style?: Partial<StyleDesc>
}

export function BreadcrumbSeparator({ style }: BreadcrumbSeparatorProps) {
  const t = useAdwaita()
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      /
    </T>
  )
}

export interface BreadcrumbEllipsisProps {
  style?: Partial<StyleDesc>
}

export function BreadcrumbEllipsis({ style }: BreadcrumbEllipsisProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <T size="caption" color={t.colors.dim_fg}>
        …
      </T>
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row } from './common'

export const BreadcrumbShot: ComponentShot = {
  name: 'Breadcrumb',
  el: (
    <Row label="Breadcrumb">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Row>
  ),
}
