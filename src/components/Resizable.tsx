import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { StyleDesc, EventPayload } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'

const DEFAULT_SIZE = 300

const DEFAULT_MIN = 100
const DEFAULT_MAX = 600

const HANDLE = 6

interface PanelConfig {
  min?: number
  max?: number
  defaultSize?: number
}

interface ResizableGroupContextValue {
  orientation: 'horizontal' | 'vertical'

  sizes: number[]

  panelCount: number
  registerPanel: (cfg: PanelConfig) => number
  unregisterPanel: (index: number) => void
  setPanelSize: (index: number, size: number) => void
  startDrag: (index: number, event: EventPayload) => void
  endDrag: () => void
}

const ResizableGroupCtx = createContext<ResizableGroupContextValue | null>(null)

function useResizableGroup(): ResizableGroupContextValue {
  const ctx = useContext(ResizableGroupCtx)
  if (!ctx) throw new Error('ResizablePanel / ResizableHandle must be used within <ResizablePanelGroup>')
  return ctx
}

interface DragState {
  index: number
  startCoord: number
  startSize: number
  min: number
  max: number
}

export interface ResizablePanelGroupProps {
  orientation?: 'horizontal' | 'vertical'
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export function ResizablePanelGroup({ orientation = 'horizontal', children, style }: ResizablePanelGroupProps) {
  const vertical = orientation === 'vertical'
  const [sizes, setSizes] = useState<number[]>([])
  const [panelCount, setPanelCount] = useState(0)
  const [drag, setDrag] = useState<DragState | null>(null)
  const panelOrderRef = useRef<PanelConfig[]>([])

  const registerPanel = (cfg: PanelConfig): number => {
    panelOrderRef.current.push(cfg)
    setPanelCount(panelOrderRef.current.length)
    return panelOrderRef.current.length - 1
  }

  const unregisterPanel = (index: number) => {
    panelOrderRef.current = panelOrderRef.current.filter((_, i) => i !== index)
    setPanelCount(panelOrderRef.current.length)
  }

  const setPanelSize = (index: number, size: number) => {
    setSizes((prev) => {
      const next = [...prev]
      while (next.length <= index) next.push(0)
      next[index] = size
      return next
    })
  }

  const startDrag = (index: number, event: EventPayload) => {
    const cfg = panelOrderRef.current[index]
    const coord = vertical ? (event.y ?? 0) : (event.x ?? 0)
    setDrag({
      index,
      startCoord: coord,
      startSize: sizes[index] || cfg?.defaultSize || DEFAULT_SIZE,
      min: cfg?.min ?? DEFAULT_MIN,
      max: cfg?.max ?? DEFAULT_MAX,
    })
  }

  const endDrag = () => setDrag(null)

  const handleMouseMove = (event: EventPayload) => {
    if (!drag) return

    const coord = vertical ? (event.y ?? drag.startCoord) : (event.x ?? drag.startCoord)
    const next = Math.max(drag.min, Math.min(drag.max, drag.startSize + (coord - drag.startCoord)))
    setPanelSize(drag.index, next)
  }

  const ctxValue: ResizableGroupContextValue = {
    orientation,
    sizes,
    panelCount,
    registerPanel,
    unregisterPanel,
    setPanelSize,
    startDrag,
    endDrag,
  }

  return (
    <ResizableGroupCtx.Provider value={ctxValue}>
      <div
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        style={{
          display: 'flex',
          flexDirection: vertical ? 'column' : 'row',
          ...style,
        }}
      >
        {children}
      </div>
    </ResizableGroupCtx.Provider>
  )
}

export interface ResizablePanelProps {
  children?: ReactNode

  min?: number

  max?: number

  defaultSize?: number

  side?: 'left' | 'right'
  style?: Partial<StyleDesc>
}

export function ResizablePanel({ children, min, max, defaultSize, side, style }: ResizablePanelProps) {
  void side
  const ctx = useResizableGroup()
  const vertical = ctx.orientation === 'vertical'
  const indexRef = useRef(-1)
  const cfgRef = useRef<PanelConfig>({})
  cfgRef.current = { min, max, defaultSize }

  useEffect(() => {
    const index = ctx.registerPanel(cfgRef.current)
    indexRef.current = index
    return () => ctx.unregisterPanel(index)

  }, [])

  const index = indexRef.current
  const isLast = index === ctx.panelCount - 1
  const size = ctx.sizes[index] || defaultSize || DEFAULT_SIZE

  const panelStyle: Partial<StyleDesc> = isLast
    ? { display: 'flex', flexGrow: 1, ...(vertical ? { minHeight: 0 } : { minWidth: 0 }), ...style }
    : vertical
      ? { display: 'flex', height: size, ...style }
      : { display: 'flex', width: size, ...style }

  return <div style={panelStyle}>{children}</div>
}

export interface ResizableHandleProps {

  panel?: number
  style?: Partial<StyleDesc>
}

export function ResizableHandle({ panel = 0, style }: ResizableHandleProps) {
  const t = useAdwaita()
  const { colors } = t
  const ctx = useResizableGroup()
  const vertical = ctx.orientation === 'vertical'

  return (
    <div
      onMouseDown={(event: EventPayload) => ctx.startDrag(panel, event)}
      style={{
        display: 'flex',
        flexShrink: 0,
        borderRadius: 3,
        backgroundColor: colors.border,
        cursor: vertical ? 'row-resize' : 'col-resize',
        ...(vertical ? { height: HANDLE, width: '100%' } : { width: HANDLE, height: '100%' }),
        hover: { backgroundColor: colors.accent },
        active: { backgroundColor: colors.accent },
        ...style,
      }}
    />
  )
}

export interface ResizableProps {
  children: ReactNode
  style?: Partial<StyleDesc>

  initialLeftWidth?: number
}

export function Resizable({ children, style, initialLeftWidth = 300 }: ResizableProps) {
  return (
    <ResizablePanelGroup style={style}>
      <ResizablePanel defaultSize={initialLeftWidth}>{children}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel />
    </ResizablePanelGroup>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, T, Shot, ShotItem } from './common'

function Pane({ label, height = 64 }: { label: string; height?: number }) {
  const t = useAdwaita()
  return (
    <div
      style={{
        width: '100%',
        height,
        backgroundColor: t.colors.accentTint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <T>{label}</T>
    </div>
  )
}

export const ResizableShot: ComponentShot = {
  name: 'Resizable',
  el: (
    <Shot>
      <Row label="Horizontal group (3 panels + 2 handles)" col>
        <ShotItem label="drag the handles">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={180} min={80} max={300}>
              <Pane label="Left" />
            </ResizablePanel>
            <ResizableHandle panel={0} />
            <ResizablePanel defaultSize={140} min={60} max={240}>
              <Pane label="Middle" />
            </ResizablePanel>
            <ResizableHandle panel={1} />
            <ResizablePanel>
              <Pane label="Right (flexible)" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ShotItem>
      </Row>
      <Row label="Vertical group (2 panels + 1 handle)" col>
        <ShotItem label="row-resize handles">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={56} min={32} max={120}>
              <Pane label="Top" height={48} />
            </ResizablePanel>
            <ResizableHandle panel={0} />
            <ResizablePanel defaultSize={56} min={32} max={120}>
              <Pane label="Bottom" height={48} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ShotItem>
      </Row>
      <Row label="Legacy Resizable (initialLeftWidth=200)" col>
        <ShotItem label="left pane + flexible right pane">
          <Resizable initialLeftWidth={200}>
            <Pane label="Left pane" height={96} />
          </Resizable>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
