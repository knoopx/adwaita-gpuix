import { createContext, useContext, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba, isDarkScheme } from '../theme/adwaita'
import { T } from './common'
import { Icon, type IconName } from './icons'

export interface TabItem {
  id: string
  label: string
  icon?: IconName
  closable?: boolean
}

export interface TabsProps {

  items?: TabItem[]

  value?: string

  defaultValue?: string

  onSelect?: (id: string) => void

  onClose?: (id: string) => void

  orientation?: 'horizontal' | 'vertical'

  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface TabsCtxValue {

  value: string

  setValue: (value: string) => void
  orientation: 'horizontal' | 'vertical'
  onClose?: (id: string) => void
}

export const TabsCtx = createContext<TabsCtxValue | null>(null)

export function useTabs(): TabsCtxValue | null {
  return useContext(TabsCtx)
}

function Tab({
  item,
  selected,
  onSelect,
  onClose,
}: {
  item: TabItem
  selected: boolean
  onSelect: (id: string) => void
  onClose?: (id: string) => void
}) {
  const t = useAdwaita()
  const { colors } = t
  const isVertical = useTabs()?.orientation === 'vertical'
  const closable = item.closable && onClose

  return (
    <TabShell vertical={isVertical} selected={selected} onClick={() => onSelect(item.id)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          minHeight: 38,
          paddingLeft: 12,
          paddingRight: closable ? 6 : 12,
        }}
      >
        {item.icon ? <Icon name={item.icon} size={16} color={selected ? colors.accent : colors.dim_fg} /> : null}
        <T size="body" weight={selected ? 600 : 400} color={selected ? colors.fg : colors.dim_fg}>
          {item.label}
        </T>
        {closable ? (
          <div
            onClick={() => onClose?.(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              borderRadius: 9,
              marginLeft: 2,
              cursor: 'pointer',
              hover: { backgroundColor: hexToRgba(colors.fg, 0.12) },
            }}
          >
            <Icon name="close" size={12} color={colors.dim_fg} />
          </div>
        ) : null}
      </div>
    </TabShell>
  )
}

function TabIndicator({ selected }: { selected: boolean }) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        height: 3,
        borderRadius: 2,
        backgroundColor: selected ? colors.accent : 'transparent',
      }}
    />
  )
}

function TabShell({
  vertical,
  selected,
  grow = false,
  onClick,
  style,
  children,
}: {
  vertical: boolean
  selected: boolean
  grow?: boolean
  onClick?: () => void
  style?: Partial<StyleDesc>
  children: ReactNode
}) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: vertical ? 'row' : 'column',
        ...(grow ? { flexGrow: 1 } : {}),
        cursor: 'pointer',
        ...(vertical
          ? { borderRightWidth: selected ? 3 : 0, borderColor: colors.accent }
          : {}),
        hover: { backgroundColor: hexToRgba(colors.fg, isDarkScheme(t.scheme) ? 0.06 : 0.04) },
        ...style,
      }}
    >
      {children}
      {!vertical ? <TabIndicator selected={selected} /> : null}
    </div>
  )
}

export interface TabsListProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export function TabsList({ children, style }: TabsListProps) {
  const t = useAdwaita()
  const { colors } = t
  const isVertical = useTabs()?.orientation === 'vertical'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        gap: 4,
        ...(isVertical
          ? { borderRightWidth: 1, borderColor: colors.border }
          : { borderBottomWidth: 1, borderColor: colors.border }),
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps {

  value: string
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export function TabsTrigger({ value, children, style }: TabsTriggerProps) {
  const t = useAdwaita()
  const { colors } = t
  const ctx = useTabs()
  const isVertical = ctx?.orientation === 'vertical'
  const selected = ctx?.value === value

  return (
    <TabShell vertical={isVertical} selected={selected} grow onClick={() => ctx?.setValue(value)} style={style}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          minHeight: 38,
          padding: 12,
        }}
      >
        <T size="body" weight={selected ? 600 : 400} color={selected ? colors.fg : colors.dim_fg}>
          {children}
        </T>
      </div>
    </TabShell>
  )
}

export interface TabsContentProps {

  value: string
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export function TabsContent({ value, children, style }: TabsContentProps) {
  const ctx = useTabs()
  const active = ctx?.value === value
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        ...style,
      }}
    >
      {active ? children : null}
    </div>
  )
}

export function Tabs({
  items,
  value,
  defaultValue,
  onSelect,
  onClose,
  orientation = 'horizontal',
  children,
  style,
}: TabsProps) {

  const [internal, setInternal] = useState<string>(defaultValue ?? value ?? '')
  const current = value ?? internal
  const setValue = (v: string) => {
    if (value === undefined) setInternal(v)
    onSelect?.(v)
  }

  const ctxValue: TabsCtxValue = { value: current, setValue, orientation, onClose }

  return (
    <TabsCtx.Provider value={ctxValue}>
      <div
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'row' : 'column',
          gap: 4,
          ...style,
        }}
      >
        {items ? (
          <TabsList>
            {items.map((item) => (
              <Tab
                key={item.id}
                item={item}
                selected={item.id === current}
                onSelect={setValue}
                onClose={onClose}
              />
            ))}
          </TabsList>
        ) : null}
        {children}
      </div>
    </TabsCtx.Provider>
  )
}

export const TabBar = Tabs

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const TabsShot: ComponentShot = {
  name: 'Tabs',
  el: (
    <Shot>
      <Row label="Data-driven (horizontal)" col>
        <ShotItem label="selected + closable + icon">
          <Tabs
            items={[
              { id: 'a', label: 'General', icon: 'settings' },
              { id: 'b', label: 'Files', icon: 'list', closable: true },
              { id: 'c', label: 'Advanced', icon: 'grid' },
            ]}
            value="a"
            onSelect={() => {}}
            onClose={() => {}}
          />
        </ShotItem>
        <ShotItem label="uncontrolled (defaultValue)">
          <Tabs
            items={[{ id: 'x', label: 'One' }, { id: 'y', label: 'Two' }]}
            defaultValue="y"
            onSelect={() => {}}
          />
        </ShotItem>
      </Row>
      <Row label="Orientation: vertical" col>
        <ShotItem label="right-edge indicator">
          <Tabs
            orientation="vertical"
            items={[
              { id: 'a', label: 'General' },
              { id: 'b', label: 'Files' },
              { id: 'c', label: 'Advanced' },
            ]}
            value="b"
            onSelect={() => {}}
          />
        </ShotItem>
      </Row>
      <Row label="Compound (TabsList / TabsTrigger / TabsContent)" col>
        <ShotItem label="controlled value">
          <Tabs value="a" onSelect={() => {}}>
            <TabsList>
              <TabsTrigger value="a">Account</TabsTrigger>
              <TabsTrigger value="b">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="a">
              <T>Account panel content.</T>
            </TabsContent>
            <TabsContent value="b">
              <T>Password panel content.</T>
            </TabsContent>
          </Tabs>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
