import { useState } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T, inputShellStyle, listPanelStyle } from './common'
import { Icon } from './icons'

export type CalendarMode = 'single' | 'multiple' | 'range'

export interface CalendarProps {

  mode?: CalendarMode

  value?: Date | Date[]

  selected?: Date | [Date, Date]

  onSelect?: (date: Date) => void

  onValueChange?: (dates: Date[]) => void
  month?: Date
  style?: Partial<StyleDesc>
}

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  style?: Partial<StyleDesc>
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

interface GridCell {
  date: Date
  inMonth: boolean
}

function getMonthGrid(year: number, month: number): GridCell[] {
  const first = new Date(year, month, 1)

  let startDay = first.getDay() - 1
  if (startDay < 0) startDay = 6


  const start = new Date(year, month, 1 - startDay)
  const cells: GridCell[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    cells.push({ date: d, inMonth: d.getMonth() === month })
  }
  return cells
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function sameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function dayKey(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

function isDatePair(x: unknown): x is [Date, Date] {
  return Array.isArray(x) && x.length === 2 && x[0] instanceof Date && x[1] instanceof Date
}

function isSingleDate(x: unknown): x is Date {
  return x instanceof Date
}

function initialMonth(value?: Date | Date[]): Date | undefined {
  if (isSingleDate(value)) return value
  if (Array.isArray(value) && value.length > 0) return value[0]
  return undefined
}

function MonthNavButton({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={onClick}
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        hover: { backgroundColor: colors.button_hover },
      }}
    >
      <Icon name={direction === 'left' ? 'arrowLeft' : 'arrowRight'} size={14} color={colors.dim_fg} />
    </div>
  )
}

function DayCell({
  date,
  inMonth,
  isSelected,
  isRangeStart,
  isRangeEnd,
  inRange,
  isToday,
  onPick,
}: {
  date: Date
  inMonth: boolean
  isSelected: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  inRange: boolean
  isToday: boolean
  onPick: () => void
}) {
  const t = useAdwaita()
  const { colors } = t
  const isEndpoint = isRangeStart || isRangeEnd
  const filled = isSelected || isEndpoint

  return (
    <div
      onClick={onPick}
      style={{
        flexGrow: 1,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        cursor: 'pointer',
        opacity: inMonth ? 1 : 0.5,
        backgroundColor: filled ? colors.accent : inRange ? colors.accentTint : 'transparent',
        hover: { backgroundColor: filled ? colors.accent : colors.accentTint },
      }}
    >
      <T
        size="body"
        color={filled ? colors.accent_fg : inMonth ? (isToday ? colors.accent : colors.fg) : colors.dim_fg}
        align="center"
      >
        {String(date.getDate())}
      </T>
    </div>
  )
}

function PickerCell({
  label,
  active,
  onClick,
}: {
  label: string | number
  active: boolean
  onClick: () => void
}) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: 6,
        borderRadius: 6,
        cursor: 'pointer',
        backgroundColor: active ? colors.accentTint : 'transparent',
        hover: { backgroundColor: colors.accentTint },
      }}
    >
      <T size="body" color={active ? colors.fg : colors.dim_fg} align="center">
        {label}
      </T>
    </div>
  )
}

export function Calendar({
  mode = 'single',
  value,
  selected,
  onSelect,
  onValueChange,
  month: monthProp,
  style,
}: CalendarProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  const [viewMonth, setViewMonth] = useState(() => monthProp ?? initialMonth(value) ?? new Date())
  const currentMonth = monthProp ?? viewMonth
  const today = new Date()


  const [picker, setPicker] = useState<'month' | 'year' | null>(null)
  const baseYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => baseYear - 5 + i)


  const [rangeDraft, setRangeDraft] = useState<{ start: Date; end?: Date } | null>(null)


  const multipleSet: Date[] = mode === 'multiple' ? (Array.isArray(value) ? value : []) : []
  const singleSelected = mode === 'single' && isSingleDate(selected) ? selected : undefined
  const activeRange: [Date, Date] | null =
    mode === 'range'
      ? isDatePair(selected)
        ? selected
        : rangeDraft
          ? [rangeDraft.start, rangeDraft.end ?? rangeDraft.start]
          : null
      : null

  const pick = (date: Date) => {
    if (mode === 'multiple') {
      const arr = Array.isArray(value) ? value : []
      const next = arr.some((d) => sameDate(d, date)) ? arr.filter((d) => !sameDate(d, date)) : [...arr, date]
      onValueChange?.(next)
      return
    }
    if (mode === 'range') {

      const inProgress = !isDatePair(selected) && rangeDraft
      if (!inProgress) {

        setRangeDraft({ start: date })
        onValueChange?.([date])
        return
      }
      let start = rangeDraft.start
      let end = date
      if (dayKey(end) < dayKey(start)) {
        start = date
        end = rangeDraft.start
      }
      setRangeDraft({ start, end })
      onValueChange?.([start, end])
      return
    }

    onSelect?.(date)
  }

  const cells = getMonthGrid(currentMonth.getFullYear(), currentMonth.getMonth())
  const monthName = currentMonth.toLocaleString('en', { month: 'long' })
  const year = currentMonth.getFullYear()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        minWidth: 240,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <MonthNavButton
          direction="left"
          onClick={() => setViewMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
        />
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <div
            onClick={() => setPicker(picker === 'month' ? null : 'month')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <T size="title4" weight={600} color={colors.fg} align="center">
              {monthName}
            </T>
          </div>
          <div
            onClick={() => setPicker(picker === 'year' ? null : 'year')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <T size="title4" weight={600} color={colors.fg} align="center">
              {year}
            </T>
          </div>
        </div>
        <MonthNavButton
          direction="right"
          onClick={() => setViewMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
        />
      </div>

      {picker === 'month' ? (
        <anchored side="top" offset={{ x: 0, y: -4 }}>
          <div style={listPanelStyle(t, { display: 'flex', flexDirection: 'column', gap: 2, padding: 4, width: 120 })}>
            {MONTH_NAMES.map((name, i) => (
              <PickerCell
                key={name}
                label={name}
                active={currentMonth.getMonth() === i}
                onClick={() => {
                  setViewMonth(new Date(currentMonth.getFullYear(), i, 1))
                  setPicker(null)
                }}
              />
            ))}
          </div>
        </anchored>
      ) : null}

      {picker === 'year' ? (
        <anchored side="top" offset={{ x: 0, y: -4 }}>
          <div style={listPanelStyle(t, { display: 'flex', flexDirection: 'column', gap: 2, padding: 4, width: 80 })}>
            {years.map((y) => (
              <PickerCell
                key={y}
                label={y}
                active={currentMonth.getFullYear() === y}
                onClick={() => {
                  setViewMonth(new Date(y, currentMonth.getMonth(), 1))
                  setPicker(null)
                }}
              />
            ))}
          </div>
        </anchored>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {WEEKDAYS.map((day) => (
          <div key={day} style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', padding: 4 }}>
            <T size="caption" color={colors.dim_fg} align="center">
              {day}
            </T>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: 6 }, (_, w) => (
          <div key={w} style={{ display: 'flex', flexDirection: 'row' }}>
            {cells.slice(w * 7, w * 7 + 7).map((cell, j) => {
              const key = dayKey(cell.date)
              const isStart = activeRange ? dayKey(activeRange[0]) === key : false
              const isEnd = activeRange && activeRange[1] ? dayKey(activeRange[1]) === key : false
              const inRange =
                activeRange && activeRange[1]
                  ? key > dayKey(activeRange[0]) && key < dayKey(activeRange[1])
                  : false
              const isSelected =
                mode === 'single'
                  ? singleSelected
                    ? sameDate(singleSelected, cell.date)
                    : false
                  : mode === 'multiple'
                    ? multipleSet.some((d) => sameDate(d, cell.date))
                    : false
              return (
                <DayCell
                  key={j}
                  date={cell.date}
                  inMonth={cell.inMonth}
                  isSelected={isSelected}
                  isRangeStart={isStart}
                  isRangeEnd={isEnd}
                  inRange={inRange}
                  isToday={sameDate(cell.date, today)}
                  onPick={() => pick(cell.date)}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export function DatePicker({ value, onChange, open, onOpenChange, style }: DatePickerProps) {
  const t = useAdwaita()
  const { colors } = t
  const [localOpen, setLocalOpen] = useState(false)
  const isOpen = open ?? localOpen

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      <div
        onClick={() => {
          setLocalOpen(!isOpen)
          onOpenChange?.(!isOpen)
        }}
        style={inputShellStyle(t, { cursor: 'pointer', hover: { backgroundColor: colors.button_hover } })}
      >
        <Icon name="clock" size={14} color={colors.dim_fg} />
        <T size="body" color={value ? colors.fg : colors.dim_fg}>
          {value ? formatDate(value) : 'Select a date…'}
        </T>
      </div>

      {isOpen ? (
        <anchored side="bottom" offset={{ x: 0, y: 4 }}>
          <Calendar
            value={value}
            selected={value}
            onSelect={(d) => {
              onChange?.(d)
              setLocalOpen(false)
              onOpenChange?.(false)
            }}
          />
        </anchored>
      ) : null}
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const CalendarShot: ComponentShot = {
  name: 'Calendar',
  el: (
    <Shot>
      <Row label="Selection modes (mode prop)" col>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
          <ShotItem label="mode=single (selected date)">
            <Calendar month={new Date(2025, 5, 1)} selected={new Date(2025, 5, 15)} onSelect={() => {}} />
          </ShotItem>
          <ShotItem label="mode=multiple (value: Date[])">
            <Calendar
              mode="multiple"
              month={new Date(2025, 5, 1)}
              value={[new Date(2025, 5, 3), new Date(2025, 5, 15), new Date(2025, 5, 27)]}
              onValueChange={() => {}}
            />
          </ShotItem>
        </div>
        <ShotItem label="mode=range (selected: [start, end])">
          <Calendar
            mode="range"
            month={new Date(2025, 5, 1)}
            selected={[new Date(2025, 5, 10), new Date(2025, 5, 20)]}
            onValueChange={() => {}}
          />
        </ShotItem>
      </Row>
    </Shot>
  ),
}

export const DatePickerShot: ComponentShot = {
  name: 'DatePicker',
  el: (
    <Shot>
      <Row label="Trigger states">
        <ShotItem label="closed · empty (no value)">
          <DatePicker open={false} onChange={() => {}} />
        </ShotItem>
        <ShotItem label="closed · with value">
          <DatePicker value={new Date(2025, 5, 15)} open={false} onChange={() => {}} />
        </ShotItem>
      </Row>
      <Row label="Open · anchored calendar" col>
        <div style={{ width: 280 }}>
          <DatePicker value={new Date(2025, 5, 15)} open={true} onChange={() => {}} />
        </div>
      </Row>
    </Shot>
  ),
}
