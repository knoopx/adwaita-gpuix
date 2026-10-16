import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface ChartDataPoint {
  label: string
  value: number
}

export interface ChartSeriesValue {
  name: string
  value: number
}

export interface ChartSeriesPoint {
  label: string
  values: ChartSeriesValue[]
}

export type ChartData = ChartDataPoint[] | ChartSeriesPoint[]

export interface ChartProps {
  data: ChartData
  type?: 'bar' | 'line'

  color?: string

  colors?: string[]
  height?: number
  style?: Partial<StyleDesc>
}

function isMultiSeriesData(data: ChartData): data is ChartSeriesPoint[] {
  return data.length > 0 && Array.isArray((data[0] as ChartSeriesPoint).values)
}

function seriesColor(palette: string[], index: number): string {
  return palette[index % palette.length]
}

export function Chart({ data, type = 'bar', color, colors, height = 120, style }: ChartProps) {
  const t = useAdwaita()
  const { colors: themeColors } = t
  const palette =
    colors ?? [
      themeColors.accent,
      themeColors.success,
      themeColors.warning,
      themeColors.destructive,
    ]

  if (isMultiSeriesData(data)) {
    if (type === 'line') {
      return <MultiLineChart data={data} palette={palette} height={height} style={style} />
    }
    return <MultiBarChart data={data} palette={palette} height={height} style={style} />
  }

  const chartColor = color ?? themeColors.accent
  if (type === 'line') {
    return <LineChart data={data} color={chartColor} height={height} style={style} />
  }
  return <BarChart data={data} color={chartColor} height={height} style={style} />
}

export interface ChartLegendItem {
  name: string
  color: string
}

export interface ChartLegendProps {
  items: ChartLegendItem[]
  style?: Partial<StyleDesc>
}

export function ChartLegend({ items, style }: ChartLegendProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 12, ...style }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color }} />
          <T size="caption" color={colors.dim_fg}>
            {item.name}
          </T>
        </div>
      ))}
    </div>
  )
}

interface ChartRendererProps {
  data: ChartDataPoint[]
  color: string
  height: number
  style?: Partial<StyleDesc>
}

function ChartLabels({ labels }: { labels: ChartData }) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
      {labels.map((d, i) => (
        <div key={i} style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <T size="caption" color={colors.dim_fg} align="center">
            {d.label}
          </T>
        </div>
      ))}
    </div>
  )
}

function ChartFrame({ children, labels, style }: { children: ReactNode; labels?: ChartData; style?: Partial<StyleDesc> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {children}
      {labels ? <ChartLabels labels={labels} /> : null}
    </div>
  )
}

function BarRow({ height, gap, children }: { height: number; gap: number; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap, height }}>
      {children}
    </div>
  )
}

function makeLinePointAt(count: number, maxValue: number, width: number, height: number, padding: number) {
  return (index: number, value: number) => {
    const x = padding + (index / Math.max(count - 1, 1)) * (width - padding * 2)
    const y = height - padding - (value / maxValue) * (height - padding * 2)
    return { x, y }
  }
}

function buildLineSvgSeries(params: {
  width: number
  height: number
  padding: number
  color: string
  points: string
  dots: string

  axisColor?: string
}): string {
  const { width, height, padding, color, points, dots, axisColor } = params
  const svgSource = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${axisColor !== undefined ? `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="${axisColor}" stroke-width="1"/>` : ''}
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
    ${dots}
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgSource)}`
}

function BarChart({ data, color, height, style }: ChartRendererProps) {
  const t = useAdwaita()
  const { colors } = t

  const plotHeight = Math.max(height - 16, 8)
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <ChartFrame labels={data} style={style}>
      <BarRow height={height} gap={4}>
        {data.map((d, i) => {
          const barHeight = d.value === 0 ? 0 : Math.max(4, Math.round((d.value / maxValue) * plotHeight))
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexGrow: 1,
                gap: 4,
              }}
            >
              <T size="caption" color={colors.dim_fg}>
                {d.value}
              </T>
              <div
                style={{
                  width: '100%',
                  minHeight: d.value === 0 ? 0 : 4,
                  height: barHeight,
                  borderRadius: 4,
                  backgroundColor: color,
                }}
              />
            </div>
          )
        })}
      </BarRow>
    </ChartFrame>
  )
}

function MultiBarChart({
  data,
  palette,
  height,
  style,
}: {
  data: ChartSeriesPoint[]
  palette: string[]
  height: number
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  const { colors } = t
  const plotHeight = Math.max(height - 16, 8)
  const maxValue = Math.max(...data.flatMap((d) => d.values.map((v) => v.value)), 1)

  return (
    <ChartFrame style={style}>
      <BarRow height={height} gap={8}>
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexGrow: 1,
              gap: 4,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: 2,
                height: plotHeight,
              }}
            >
              {d.values.map((v, j) => {
                const barHeight = v.value === 0 ? 0 : Math.max(4, Math.round((v.value / maxValue) * plotHeight))
                return (
                  <div
                    key={j}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <T size="caption" color={colors.dim_fg}>
                      {v.value}
                    </T>
                    <div
                      style={{
                        width: 8,
                        minHeight: v.value === 0 ? 0 : 4,
                        height: barHeight,
                        borderRadius: 2,
                        backgroundColor: seriesColor(palette, j),
                      }}
                    />
                  </div>
                )
              })}
            </div>
            <T size="caption" color={colors.dim_fg} align="center">
              {d.label}
            </T>
          </div>
        ))}
      </BarRow>
    </ChartFrame>
  )
}

function LineChart({ data, color, height, style }: ChartRendererProps) {
  const t = useAdwaita()
  const { colors } = t
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  const width = 300
  const padding = 10

  const pointAt = makeLinePointAt(data.length, maxValue, width, height, padding)

  const points = data
    .map((d, i) => {
      const p = pointAt(i, d.value)
      return `${p.x},${p.y}`
    })
    .join(' ')

  const dots = data
    .map((d, i) => {
      const p = pointAt(i, d.value)
      return `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${color}"/>`
    })
    .join('')




  const imgSrc = buildLineSvgSeries({ width, height, padding, color, points, dots, axisColor: colors.border })

  return (
    <ChartFrame labels={data} style={style}>
      <img src={imgSrc} style={{ width: '100%', height, flexShrink: 0 }} />
    </ChartFrame>
  )
}

function MultiLineChart({
  data,
  palette,
  height,
  style,
}: {
  data: ChartSeriesPoint[]
  palette: string[]
  height: number
  style?: Partial<StyleDesc>
}) {
  const t = useAdwaita()
  const { colors } = t
  const seriesCount = Math.max(...data.map((d) => d.values.length), 1)
  const maxValue = Math.max(...data.flatMap((d) => d.values.map((v) => v.value)), 1)
  const width = 300
  const padding = 10

  const pointAt = makeLinePointAt(data.length, maxValue, width, height, padding)

  return (
    <ChartFrame labels={data} style={style}>
      <div style={{ position: 'relative', height }}>
        {Array.from({ length: seriesCount }, (_, s) => {
          const points: string[] = []
          const dots: string[] = []
          data.forEach((d, i) => {
            const v = d.values[s]
            if (v === undefined) return
            const p = pointAt(i, v.value)
            points.push(`${p.x},${p.y}`)
            dots.push(`<circle cx="${p.x}" cy="${p.y}" r="3" fill="${seriesColor(palette, s)}"/>`)
          })
          const imgSrc = buildLineSvgSeries({
            width,
            height,
            padding,
            color: seriesColor(palette, s),
            points: points.join(' '),
            dots: dots.join(''),
            axisColor: s === 0 ? colors.border : undefined,
          })
          return (
            <img
              key={s}
              src={imgSrc}
              style={{ position: 'absolute', left: 0, top: 0, width: '100%', height, flexShrink: 0 }}
            />
          )
        })}
      </div>
    </ChartFrame>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

const SINGLE_DATA: ChartDataPoint[] = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 28 },
  { label: 'Wed', value: 18 },
  { label: 'Thu', value: 35 },
  { label: 'Fri', value: 22 },
]

const MULTI_DATA: ChartSeriesPoint[] = [
  { label: 'Mon', values: [{ name: 'A', value: 12 }, { name: 'B', value: 22 }, { name: 'C', value: 8 }] },
  { label: 'Tue', values: [{ name: 'A', value: 28 }, { name: 'B', value: 18 }, { name: 'C', value: 30 }] },
  { label: 'Wed', values: [{ name: 'A', value: 18 }, { name: 'B', value: 32 }, { name: 'C', value: 14 }] },
  { label: 'Thu', values: [{ name: 'A', value: 35 }, { name: 'B', value: 12 }, { name: 'C', value: 26 }] },
  { label: 'Fri', values: [{ name: 'A', value: 22 }, { name: 'B', value: 26 }, { name: 'C', value: 18 }] },
]

const PALETTE_LEGEND = [
  { name: 'A', color: '#3584e4' },
  { name: 'B', color: '#2ec275' },
  { name: 'C', color: '#e5a50a' },
]

function ChartTypeRow({ type }: { type: 'bar' | 'line' }) {
  return (
    <Row label={type === 'bar' ? 'Bar' : 'Line'} col>
      <ShotItem label="single series (default accent colour)">
        <Chart data={SINGLE_DATA} type={type} height={110} />
      </ShotItem>
      <ShotItem label="single series · custom color">
        <Chart data={SINGLE_DATA} type={type} height={110} color="#e5a50a" />
      </ShotItem>
      <ShotItem label="multi-series (default palette) + legend">
        <Chart data={MULTI_DATA} type={type} height={110} />
        <ChartLegend items={PALETTE_LEGEND} />
      </ShotItem>
    </Row>
  )
}

export const ChartShot: ComponentShot = {
  name: 'Chart',
  el: (
    <Shot>
      <ChartTypeRow type="bar" />
      <ChartTypeRow type="line" />
    </Shot>
  ),
}
