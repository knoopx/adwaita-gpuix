import { useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { inputShellStyle } from "./input-base";
import { listPanelStyle } from "./FloatingPanel";
import { Icon } from "./icons";

export type CalendarMode = "single" | "multiple" | "range";

export interface CalendarProps {
  mode?: CalendarMode;

  value?: Date | Date[];

  selected?: Date | [Date, Date];

  onSelect?: (date: Date) => void;

  onValueChange?: (dates: Date[]) => void;
  month?: Date;
  disabledDates?: Date[];
  style?: Partial<StyleDesc>;
}

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: Partial<StyleDesc>;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface GridCell {
  date: Date;
  inMonth: boolean;
}

function getMonthGrid(year: number, month: number): GridCell[] {
  const first = new Date(year, month, 1);

  let startDay = first.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const start = new Date(year, month, 1 - startDay);
  const cells: GridCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i,
    );
    cells.push({ date: d, inMonth: d.getMonth() === month });
  }
  return cells;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayKey(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function nextMultipleSelection(
  value: Date | Date[] | undefined,
  date: Date,
): Date[] {
  const arr = Array.isArray(value) ? value : [];
  return arr.some((d) => sameDate(d, date))
    ? arr.filter((d) => !sameDate(d, date))
    : [...arr, date];
}

function resolveRangeEnd(start: Date, end: Date): [Date, Date] {
  return dayKey(end) < dayKey(start) ? [end, start] : [start, end];
}

function computeDayCellFlags(
  key: number,
  mode: CalendarMode,
  singleSelected: Date | undefined,
  multipleSet: Date[],
  activeRange: [Date, Date] | null,
  date: Date,
): {
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  inRange: boolean;
} {
  const flags = {
    isSelected: false,
    isRangeStart: false,
    isRangeEnd: false,
    inRange: false,
  };
  if (activeRange) {
    flags.isRangeStart = dayKey(activeRange[0]) === key;
    if (activeRange[1]) {
      flags.isRangeEnd = dayKey(activeRange[1]) === key;
      flags.inRange =
        key > dayKey(activeRange[0]) && key < dayKey(activeRange[1]);
    }
  }
  if (mode === "single" && singleSelected)
    flags.isSelected = sameDate(singleSelected, date);
  else if (mode === "multiple")
    flags.isSelected = multipleSet.some((d) => sameDate(d, date));
  return flags;
}

function isDatePair(x: unknown): x is [Date, Date] {
  return (
    Array.isArray(x) &&
    x.length === 2 &&
    x[0] instanceof Date &&
    x[1] instanceof Date
  );
}

function isSingleDate(x: unknown): x is Date {
  return x instanceof Date;
}

function initialMonth(value?: Date | Date[]): Date | undefined {
  if (isSingleDate(value)) return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return undefined;
}

function MonthNavButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={onClick}
      style={{
        width: 24,
        height: 24,
        borderRadius: t.radius.sm,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        hover: { backgroundColor: t.color.surface.buttonHover },
        active: { backgroundColor: t.color.surface.buttonActive },
      }}
    >
      <Icon
        name={direction === "left" ? "arrowLeft" : "arrowRight"}
        size={14}
        color={t.color.text.dim}
      />
    </div>
  );
}

function dayCellTextColor(
  filled: boolean,
  disabled: boolean,
  inMonth: boolean,
  isToday: boolean,
  t: AdwaitaTheme,
): string {
  if (filled) return t.color.text.onAccent;
  if (disabled) return t.color.text.dim;
  if (!inMonth) return t.color.text.dim;
  if (isToday) return t.color.accent.base;
  return t.color.text.primary;
}

function dayCellBackground(
  filled: boolean,
  inRange: boolean,
  t: AdwaitaTheme,
): string {
  if (filled) return t.color.accent.base;
  if (inRange) return t.color.accent.tint;
  return "transparent";
}

function dayCellHoverStyle(
  filled: boolean,
  t: AdwaitaTheme,
): Partial<StyleDesc> {
  const bg = filled ? t.color.accent.base : t.color.accent.tint;
  return {
    hover: { backgroundColor: bg },
    active: { backgroundColor: bg },
  };
}

function dayCellOpacity(disabled: boolean, inMonth: boolean): number {
  if (disabled) return 0.3;
  if (inMonth) return 1;
  return 0.5;
}

function DayCell({
  date,
  inMonth,
  isSelected,
  isRangeStart,
  isRangeEnd,
  inRange,
  isToday,
  disabled,
  onPick,
}: {
  date: Date;
  inMonth: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  inRange: boolean;
  isToday: boolean;
  disabled: boolean;
  onPick: () => void;
}) {
  const t = useAdwaita();
  const isEndpoint = isRangeStart || isRangeEnd;
  const filled = isSelected || isEndpoint;

  return (
    <div
      onClick={disabled ? undefined : onPick}
      style={{
        flexGrow: 1,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: t.radius.sm,
        cursor: disabled ? "default" : "pointer",
        opacity: dayCellOpacity(disabled, inMonth),
        backgroundColor: dayCellBackground(filled, inRange, t),
        ...(disabled ? {} : dayCellHoverStyle(filled, t)),
      }}
    >
      <T
        size="body"
        color={dayCellTextColor(filled, disabled, inMonth, isToday, t)}
        align="center"
      >
        {String(date.getDate())}
      </T>
    </div>
  );
}

interface PickerItem {
  key: string | number;
  label: string | number;
  active: boolean;
  onClick: () => void;
}

function PickerCell({
  label,
  active,
  onClick,
}: {
  label: string | number;
  active: boolean;
  onClick: () => void;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={onClick}
      style={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        padding: 6,
        borderRadius: t.radius.sm,
        cursor: "pointer",
        backgroundColor: active ? t.color.accent.tint : "transparent",
        hover: { backgroundColor: t.color.accent.tint },
      }}
    >
      <T
        size="body"
        color={active ? t.color.accent.base : t.color.text.dim}
        align="center"
      >
        {label}
      </T>
    </div>
  );
}

function PickerPanel({
  t,
  width,
  items,
}: {
  t: AdwaitaTheme;
  width: number;
  items: PickerItem[];
}) {
  const rows: PickerItem[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return (
    <anchored side="top" offset={{ x: 0, y: -4 }}>
      <div
        style={listPanelStyle(t, {
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 4,
          width,
        })}
      >
        {rows.map((row, r) => (
          <div
            key={r}
            style={{ display: "flex", flexDirection: "row", gap: 2 }}
          >
            {row.map((item) => (
              <PickerCell
                key={item.key}
                label={item.label}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </div>
        ))}
      </div>
    </anchored>
  );
}

function resolveMultipleSet(
  mode: CalendarMode,
  value: Date | Date[] | undefined,
): Date[] {
  return mode === "multiple" ? (Array.isArray(value) ? value : []) : [];
}

function resolveSingleSelected(
  mode: CalendarMode,
  selected: Date | [Date, Date] | undefined,
): Date | undefined {
  return mode === "single" && isSingleDate(selected) ? selected : undefined;
}

function resolveActiveRange(
  mode: CalendarMode,
  selected: Date | [Date, Date] | undefined,
  rangeDraft: { start: Date; end?: Date } | null,
): [Date, Date] | null {
  if (mode !== "range") return null;
  if (isDatePair(selected)) return selected;
  if (!rangeDraft) return null;
  return [rangeDraft.start, rangeDraft.end ?? rangeDraft.start];
}

function MonthPickerPanel({
  t,
  currentMonth,
  onPickMonth,
}: {
  t: AdwaitaTheme;
  currentMonth: Date;
  onPickMonth: (i: number) => void;
}) {
  return (
    <PickerPanel
      t={t}
      width={176}
      items={MONTH_NAMES.map((name, i) => ({
        key: name,
        label: name,
        active: currentMonth.getMonth() === i,
        onClick: () => onPickMonth(i),
      }))}
    />
  );
}

function YearPickerPanel({
  t,
  currentMonth,
  years,
  onPickYear,
}: {
  t: AdwaitaTheme;
  currentMonth: Date;
  years: number[];
  onPickYear: (y: number) => void;
}) {
  return (
    <PickerPanel
      t={t}
      width={104}
      items={years.map((y) => ({
        key: y,
        label: y,
        active: currentMonth.getFullYear() === y,
        onClick: () => onPickYear(y),
      }))}
    />
  );
}

export function Calendar({
  mode = "single",
  value,
  selected,
  onSelect,
  onValueChange,
  month: monthProp,
  disabledDates,
  style,
}: CalendarProps) {
  const t = useAdwaita();
  const disabledKeys = new Set((disabledDates ?? []).map((d) => dayKey(d)));
  const [viewMonth, setViewMonth] = useState(
    () => monthProp ?? initialMonth(value) ?? new Date(),
  );
  const currentMonth = monthProp ?? viewMonth;
  const today = new Date();

  const [picker, setPicker] = useState<"month" | "year" | null>(null);
  const baseYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => baseYear - 5 + i);

  const [rangeDraft, setRangeDraft] = useState<{
    start: Date;
    end?: Date;
  } | null>(null);

  const multipleSet = resolveMultipleSet(mode, value);
  const singleSelected = resolveSingleSelected(mode, selected);
  const activeRange = resolveActiveRange(mode, selected, rangeDraft);

  const pickRange = (date: Date) => {
    const inProgress = !isDatePair(selected) && rangeDraft !== null;
    if (!inProgress) {
      setRangeDraft({ start: date });
      onValueChange?.([date]);
      return;
    }
    const draft = rangeDraft;
    const [start, end] = resolveRangeEnd(draft.start, date);
    setRangeDraft({ start, end });
    onValueChange?.([start, end]);
  };

  const pick = (date: Date) => {
    if (disabledKeys.has(dayKey(date))) return;
    if (mode === "multiple") {
      onValueChange?.(nextMultipleSelection(value, date));
      return;
    }
    if (mode === "range") {
      pickRange(date);
      return;
    }
    onSelect?.(date);
  };

  const cells = getMonthGrid(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );
  const monthName = currentMonth.toLocaleString("en", { month: "long" });
  const year = currentMonth.getFullYear();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.sm,
        padding: t.space.md,
        minWidth: 240,
        borderRadius: t.radius.sm,
        borderWidth: 0,
        backgroundColor: t.color.surface.card,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MonthNavButton
          direction="left"
          onClick={() =>
            setViewMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1,
              ),
            )
          }
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            onClick={() => setPicker(picker === "month" ? null : "month")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <T
              size="title2"
              weight={600}
              color={t.color.text.primary}
              align="center"
            >
              {monthName}
            </T>
          </div>
          <div
            onClick={() => setPicker(picker === "year" ? null : "year")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <T
              size="title2"
              weight={600}
              color={t.color.text.primary}
              align="center"
            >
              {year}
            </T>
          </div>
        </div>
        <MonthNavButton
          direction="right"
          onClick={() =>
            setViewMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1,
              ),
            )
          }
        />
      </div>

      {picker === "month" ? (
        <MonthPickerPanel
          t={t}
          currentMonth={currentMonth}
          onPickMonth={(i) => {
            setViewMonth(new Date(currentMonth.getFullYear(), i, 1));
            setPicker(null);
          }}
        />
      ) : null}

      {picker === "year" ? (
        <YearPickerPanel
          t={t}
          currentMonth={currentMonth}
          years={years}
          onPickYear={(y) => {
            setViewMonth(new Date(y, currentMonth.getMonth(), 1));
            setPicker(null);
          }}
        />
      ) : null}

      <div style={{ display: "flex", flexDirection: "row" }}>
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              padding: 4,
            }}
          >
            <T size="caption" color={t.color.text.dim} align="center">
              {day}
            </T>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.from({ length: 6 }, (_, w) => (
          <div key={w} style={{ display: "flex", flexDirection: "row" }}>
            {cells.slice(w * 7, w * 7 + 7).map((cell, j) => {
              const key = dayKey(cell.date);
              const flags = computeDayCellFlags(
                key,
                mode,
                singleSelected,
                multipleSet,
                activeRange,
                cell.date,
              );
              return (
                <DayCell
                  key={j}
                  date={cell.date}
                  inMonth={cell.inMonth}
                  isSelected={flags.isSelected}
                  isRangeStart={flags.isRangeStart}
                  isRangeEnd={flags.isRangeEnd}
                  inRange={flags.inRange}
                  isToday={sameDate(cell.date, today)}
                  disabled={disabledKeys.has(key)}
                  onPick={() => pick(cell.date)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DatePicker({
  value,
  onChange,
  open,
  onOpenChange,
  style,
}: DatePickerProps) {
  const t = useAdwaita();
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = open ?? localOpen;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <div
        onClick={() => {
          setLocalOpen(!isOpen);
          onOpenChange?.(!isOpen);
        }}
        style={inputShellStyle(t, {
          cursor: "pointer",
          hover: { backgroundColor: t.color.surface.buttonHover },
        })}
      >
        <Icon name="schedule" size={14} color={t.color.text.dim} />
        <T size="body" color={value ? t.color.text.primary : t.color.text.dim}>
          {value ? formatDate(value) : "Select a date…"}
        </T>
      </div>

      {isOpen ? (
        <anchored side="bottom" offset={{ x: 0, y: 4 }}>
          <Calendar
            value={value}
            selected={value}
            onSelect={(d) => {
              onChange?.(d);
              setLocalOpen(false);
              onOpenChange?.(false);
            }}
          />
        </anchored>
      ) : null}
    </div>
  );
}
