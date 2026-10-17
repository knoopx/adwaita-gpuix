import {
  Children,
  createContext,
  useCallback,
  useContext,
  isValidElement,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { Icon } from './icons'

interface CarouselContextValue {
  offset: number
  setOffset: (offset: number) => void
  count: number
  visible: number
  canPrev: boolean
  canNext: boolean
}

const CarouselCtx = createContext<CarouselContextValue | null>(null)

function useCarousel(): CarouselContextValue {
  const ctx = useContext(CarouselCtx)
  if (!ctx) throw new Error('useCarousel() must be used within a <Carousel />')
  return ctx
}

export interface CarouselProps {
  children: ReactNode

  visible?: number

  items?: number
  style?: Partial<StyleDesc>
}

export function Carousel({ children, visible = 3, items: _items, style }: CarouselProps) {
  void _items
  const [offset, setOffsetRaw] = useState(0)




  const all = Children.toArray(children)
  const itemChildren = all.filter((c) => isValidElement(c) && c.type === CarouselItem)
  const controlChildren = all.filter((c) => !(isValidElement(c) && c.type === CarouselItem))
  const count = itemChildren.length

  const setOffset = useCallback(
    (next: number) => {
      setOffsetRaw(Math.max(0, Math.min(next, Math.max(count - visible, 0))))
    },
    [count, visible],
  )

  const clampedOffset = Math.min(offset, Math.max(count - visible, 0))
  const canPrev = clampedOffset > 0
  const canNext = clampedOffset + visible < count

  const windowItems = itemChildren.slice(clampedOffset, clampedOffset + visible)

  const value = useMemo(
    () => ({ offset: clampedOffset, setOffset, count, visible, canPrev, canNext }),
    [clampedOffset, setOffset, count, visible, canPrev, canNext],
  )

  return (
    <CarouselCtx.Provider value={value}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          ...style,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', gap: 12, flexGrow: 1 }}>
          {windowItems}
        </div>
        {controlChildren}
      </div>
    </CarouselCtx.Provider>
  )
}

interface CarouselNavProps {
  style?: Partial<StyleDesc>
}

function CarouselNavButton({
  direction,
  style,
}: CarouselNavProps & { direction: 'prev' | 'next' }) {
  const t = useAdwaita()
  const { colors } = t
  const { offset, setOffset, visible, canPrev, canNext } = useCarousel()
  const enabled = direction === 'prev' ? canPrev : canNext
  return (
    <div
      onClick={
        enabled
          ? () => setOffset(direction === 'prev' ? offset - visible : offset + visible)
          : undefined
      }
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        cursor: enabled ? 'pointer' : 'default',
        opacity: enabled ? 1 : 0.4,
        ...(enabled ? { hover: { backgroundColor: colors.button_hover } } : {}),
        ...style,
      }}
    >
      <Icon name={direction === 'prev' ? 'arrowLeft' : 'arrowRight'} size={14} color={colors.fg} />
    </div>
  )
}

export function CarouselPrevious({ style }: CarouselNavProps) {
  return <CarouselNavButton direction="prev" style={style} />
}

export function CarouselNext({ style }: CarouselNavProps) {
  return <CarouselNavButton direction="next" style={style} />
}

export interface CarouselItemProps {
  children: ReactNode
  width?: number
  style?: Partial<StyleDesc>
}

export function CarouselItem({ children, width = 200, style }: CarouselItemProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width,
        flexShrink: 0,
        padding: 12,
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

import type { ComponentShot } from '../../scripts/shot'
import { Row, T, Shot, ShotItem } from './common'

export const CarouselShot: ComponentShot = {
  name: 'Carousel',
  el: (
    <Shot>
      <Row label="Default window (visible=3, 5 items)" col>
        <ShotItem label="start — prev disabled, next enabled">
          <Carousel visible={3}>
            <CarouselItem><T>Card 1</T></CarouselItem>
            <CarouselItem><T>Card 2</T></CarouselItem>
            <CarouselItem><T>Card 3</T></CarouselItem>
            <CarouselItem><T>Card 4</T></CarouselItem>
            <CarouselItem><T>Card 5</T></CarouselItem>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </ShotItem>
      </Row>
      <Row label="Custom window (visible=2, item width 160)" col>
        <ShotItem label="narrower window">
          <Carousel visible={2}>
            <CarouselItem width={160}><T>Card 1</T></CarouselItem>
            <CarouselItem width={160}><T>Card 2</T></CarouselItem>
            <CarouselItem width={160}><T>Card 3</T></CarouselItem>
            <CarouselItem width={160}><T>Card 4</T></CarouselItem>
            <CarouselItem width={160}><T>Card 5</T></CarouselItem>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
