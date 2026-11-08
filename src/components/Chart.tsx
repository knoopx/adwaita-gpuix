import { Fragment, type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { T } from "./text";

export interface ChartDataPoint {
  label: string;
  value: number;
  ts?: number;
}

export interface ChartSeriesValue {
  name: string;
  value: number;
}

export interface ChartSeriesPoint {
  label: string;
  values: ChartSeriesValue[];
}

export type ChartData = ChartDataPoint[] | ChartSeriesPoint[];

interface ChartStyleOptions {
  height?: number;
  style?: Partial<StyleDesc>;
  hideZeroLabels?: boolean;
  labels?: boolean;
  grid?: boolean;
  markers?: boolean;
  fill?: boolean;
  gap?: number;
  width?: number;

  barWidth?: number;

  fillTop?: number;

  fillBottom?: number;

  /**
   * Break the line into dashes of this many pixels. A plotted run is a fact;
   * a dashed one is a plan, an expectation, or the part of a route still
   * between two known points — and the dash is what says so.
   */
  dash?: number;

  /**
   * Which point is the one the reader is standing at — now, the selected row,
   * the far end of a route. Its marker is drawn bigger than the rest.
   */
  emphasis?: number;
}

export interface ChartProps extends ChartStyleOptions {
  data: ChartData;
  type?: "bar" | "line";
  color?: string;
  colors?: string[];
}

function isMultiSeriesData(data: ChartData): data is ChartSeriesPoint[] {
  return data.length > 0 && Array.isArray((data[0] as ChartSeriesPoint).values);
}

export function chartPalette(t: AdwaitaTheme): string[] {
  return t.color.chart.series;
}

function seriesColor(palette: string[], index: number): string {
  return palette[index % palette.length];
}

export function Chart({
  data,
  type = "bar",
  color,
  colors,
  height = 120,
  style,
  hideZeroLabels = false,
  labels = true,
  grid = false,
  markers = true,
  fill = false,
  gap,
  width = 480,
  barWidth,
  fillTop,
  fillBottom,
  dash,
  emphasis,
}: ChartProps) {
  const t = useAdwaita();

  if (data.length === 0) {
    return <EmptyChart height={height} style={style} />;
  }

  const palette = colors ?? chartPalette(t);
  if (isMultiSeriesData(data)) {
    if (type === "line") {
      return (
        <MultiLineChart
          data={data}
          palette={palette}
          height={height}
          style={style}
          labels={labels}
          grid={grid}
          markers={markers}
          fill={fill}
          width={width}
        />
      );
    }
    return (
      <MultiBarChart
        data={data}
        palette={palette}
        height={height}
        style={style}
        hideZeroLabels={hideZeroLabels}
        labels={labels}
        grid={grid}
      />
    );
  }

  const chartColor = color ?? t.color.accent.base;
  if (type === "line") {
    return (
      <LineChart
        data={data}
        color={chartColor}
        height={height}
        style={style}
        labels={labels}
        grid={grid}
        markers={markers}
        fill={fill}
        width={width}
        fillTop={fillTop}
        fillBottom={fillBottom}
        dash={dash}
        emphasis={emphasis}
      />
    );
  }
  return (
    <BarChart
      data={data}
      color={chartColor}
      height={height}
      style={style}
      gap={gap}
      barWidth={barWidth}
      hideZeroLabels={hideZeroLabels}
      labels={labels}
      grid={grid}
    />
  );
}

export interface ChartLegendItem {
  name: string;
  color: string;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  style?: Partial<StyleDesc>;
}

export function ChartLegend({ items, style }: ChartLegendProps) {
  const t = useAdwaita();
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 12, ...style }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: item.color,
            }}
          />
          <T size="caption" color={t.color.text.dim}>
            {item.name}
          </T>
        </div>
      ))}
    </div>
  );
}

interface ChartRendererProps extends ChartStyleOptions {
  data: ChartDataPoint[];
  color: string;
  height: number;
}

function EmptyChart({
  height,
  style,
}: {
  height: number;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height,
        ...style,
      }}
    >
      <T size="caption" color={t.color.text.dim}>
        No data
      </T>
    </div>
  );
}

function ChartLabels({ labels }: { labels: ChartData }) {
  const t = useAdwaita();
  const pts = labels as ChartDataPoint[];
  const { base, gaps } = timeGapWeights(pts);
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      {pts.map((d, i) => (
        <Fragment key={i}>
          <div
            style={{
              flexGrow: base,
              flexBasis: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <T size="caption" color={t.color.text.dim} align="center">
              {d.label}
            </T>
          </div>
          {i < gaps.length && gaps[i] > 0 ? (
            <div style={{ flexGrow: gaps[i], flexBasis: 0 }} />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

function ChartFrame({
  children,
  labels,
  style,
}: {
  children: ReactNode;
  labels?: ChartData;
  style?: Partial<StyleDesc>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {children}
      {labels ? <ChartLabels labels={labels} /> : null}
    </div>
  );
}

function BarRow({
  height,
  gap,
  children,
}: {
  height: number;
  gap: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap,
        height,
      }}
    >
      {children}
    </div>
  );
}

function barPlotHeight(height: number): number {
  return Math.max(height - 16, 8);
}

function BarPlot({
  labels,
  style,
  height,
  plotHeight,
  gap,
  grid,
  children,
}: {
  labels?: ChartData;
  style?: Partial<StyleDesc>;
  height: number;
  plotHeight: number;
  gap: number;
  grid: boolean;
  children: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <ChartFrame labels={labels} style={style}>
      <div style={{ position: "relative" }}>
        {grid ? (
          <BarGrid plotHeight={plotHeight} color={t.color.border.default} />
        ) : null}
        <BarRow height={height} gap={gap}>
          {children}
        </BarRow>
      </div>
    </ChartFrame>
  );
}

function BarGrid({ plotHeight, color }: { plotHeight: number; color: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: plotHeight,
        pointerEvents: "none",
      }}
    >
      {[0.25, 0.5, 0.75].map((f) => (
        <div
          key={f}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: f * plotHeight,
            height: 1,
            backgroundColor: color,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

/** A plot's markers, and the one the reader is standing at. */
const MARKER = 3;
const MARKER_EMPHASIS = 5;

function makeLinePointAt(
  count: number,
  maxValue: number,
  width: number,
  height: number,
  padding: number,
) {
  return (index: number, value: number) => {
    const step = count > 0 ? width / count : width;
    const x = (index + 0.5) * step;
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return { x, y };
  };
}

function buildLineSvgSeries(params: {
  width: number;
  height: number;
  padding: number;
  color: string;
  points: string;
  dots: string;
  axisColor?: string;
  gridLines?: string;
  area?: { top: number; bottom: number };
  dash?: number;
}): string {
  const {
    width,
    height,
    padding,
    color,
    points,
    dots,
    axisColor,
    gridLines,
    area,
    dash,
  } = params;
  const defs =
    area !== undefined
      ? `<defs><linearGradient id="band" x1="0" y1="0" x2="0" y2="${height}" gradientUnits="userSpaceOnUse">`
      : "";
  const grad =
    area !== undefined
      ? `<stop offset="0" stop-color="${color}" stop-opacity="${area.top}"/>`
      : "";
  const gradEnd =
    area !== undefined
      ? `<stop offset="1" stop-color="${color}" stop-opacity="${area.bottom}"/></linearGradient></defs>`
      : "";
  const band =
    area !== undefined && points.length > 0
      ? `<polygon points="0,${height} ${points} ${width},${height}" fill="url(#band)"/>`
      : "";
  const dashMark =
    dash !== undefined && dash > 0
      ? ` stroke-dasharray="${dash} ${dash}" stroke-linecap="round"`
      : "";
  const svgSource = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${defs}${grad}${gradEnd}
    ${gridLines ?? ""}
    ${band}
    ${axisColor !== undefined ? `<line x1="0" y1="${height - padding}" x2="${width}" y2="${height - padding}" stroke="${axisColor}" stroke-width="1"/>` : ""}
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"${dashMark}/>
    ${dots}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgSource)}`;
}

function lineGridMarkup(
  width: number,
  height: number,
  padding: number,
  color: string,
): string {
  return [0.25, 0.5, 0.75]
    .map((f) => {
      const y = height - padding - f * (height - padding * 2);
      return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${color}" stroke-width="1"/>`;
    })
    .join("");
}

function timeGapWeights(data: ChartDataPoint[]): {
  base: number;
  gaps: number[];
} {
  const timeMode =
    data.length > 1 && data.every((d) => typeof d.ts === "number");
  if (!timeMode) {
    return { base: 1, gaps: data.slice(0, -1).map(() => 0) };
  }
  const base = 60_000;
  const maxGap = base * 4;
  const gaps: number[] = [];
  for (let i = 0; i < data.length - 1; i++) {
    const raw = (data[i + 1].ts as number) - (data[i].ts as number);
    gaps.push(Math.min(Math.max(0, raw), maxGap));
  }
  return { base, gaps };
}

function BarChart({
  data,
  color,
  height,
  style,
  hideZeroLabels = false,
  labels = true,
  grid = false,
  gap = 4,
  barWidth,
}: ChartRendererProps) {
  const t = useAdwaita();
  const plotHeight = barPlotHeight(height);
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const { base, gaps } = timeGapWeights(data);

  return (
    <BarPlot
      labels={data}
      style={style}
      height={height}
      plotHeight={plotHeight}
      gap={gap}
      grid={grid}
    >
      {data.map((d, i) => {
        const barHeight =
          d.value === 0
            ? 0
            : Math.max(4, Math.round((d.value / maxValue) * plotHeight));
        return (
          <Fragment key={i}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                flexGrow: base,
                flexBasis: 0,
                height: plotHeight,
                gap: 4,
              }}
            >
              <T size="caption" color={t.color.text.dim}>
                {labels && !(hideZeroLabels && d.value === 0) ? d.value : " "}
              </T>
              <div
                style={{
                  width: barWidth ?? "100%",
                  minHeight: d.value === 0 ? 0 : 4,
                  height: barHeight,
                  borderRadius:
                    barWidth !== undefined ? Math.min(barWidth / 2, 4) : 4,
                  backgroundColor: color,
                }}
              />
            </div>
            {i < gaps.length && gaps[i] > 0 ? (
              <div style={{ flexGrow: gaps[i], flexBasis: 0 }} />
            ) : null}
          </Fragment>
        );
      })}
    </BarPlot>
  );
}

function maxSeriesValue(data: ChartSeriesPoint[]): number {
  return Math.max(...data.flatMap((d) => d.values.map((v) => v.value)), 1);
}

function barHeightAt(
  value: number,
  maxValue: number,
  plotHeight: number,
): number {
  return value === 0
    ? 0
    : Math.max(4, Math.round((value / maxValue) * plotHeight));
}

function MultiBarChart({
  data,
  palette,
  height,
  style,
  hideZeroLabels = false,
  labels = true,
  grid = false,
}: {
  data: ChartSeriesPoint[];
  palette: string[];
  height: number;
  style?: Partial<StyleDesc>;
  hideZeroLabels?: boolean;
  labels?: boolean;
  grid?: boolean;
}) {
  const t = useAdwaita();
  const plotHeight = barPlotHeight(height);
  const maxValue = maxSeriesValue(data);

  return (
    <BarPlot
      style={style}
      height={height}
      plotHeight={plotHeight}
      gap={8}
      grid={grid}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            gap: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 2,
              height: plotHeight,
            }}
          >
            {d.values.map((v, j) => {
              const barHeight = barHeightAt(v.value, maxValue, plotHeight);
              return (
                <div
                  key={j}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {labels && !(hideZeroLabels && v.value === 0) ? (
                    <T size="caption" color={t.color.text.dim}>
                      {v.value}
                    </T>
                  ) : null}
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
              );
            })}
          </div>
          {labels ? (
            <T size="caption" color={t.color.text.dim} align="center">
              {d.label}
            </T>
          ) : null}
        </div>
      ))}
    </BarPlot>
  );
}

function LineChart({
  data,
  color,
  height,
  style,
  labels = true,
  grid = false,
  markers = true,
  fill = false,
  width = 480,
  fillTop,
  fillBottom,
  dash,
  emphasis,
}: ChartRendererProps) {
  const t = useAdwaita();
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const padding = 10;

  const pointAt = makeLinePointAt(
    data.length,
    maxValue,
    width,
    height,
    padding,
  );

  const points = data
    .map((d, i) => {
      const p = pointAt(i, d.value);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const dots = markers
    ? data
        .map((d, i) => {
          const p = pointAt(i, d.value);
          const here = i === emphasis;
          const r = here ? MARKER_EMPHASIS : MARKER;
          const ring = here
            ? `<circle cx="${p.x}" cy="${p.y}" r="${r + 3}" fill="${color}" fill-opacity="0.25"/>`
            : "";
          return `${ring}<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${color}"/>`;
        })
        .join("")
    : "";

  const imgSrc = buildLineSvgSeries({
    width,
    height,
    padding,
    color,
    points,
    dots,
    axisColor: t.color.border.default,
    gridLines: grid
      ? lineGridMarkup(width, height, padding, t.color.border.default)
      : undefined,
    area: fill
      ? {
          top: fillTop ?? t.color.chart.fillTop,
          bottom: fillBottom ?? t.color.chart.fillBottom,
        }
      : undefined,
    dash,
  });

  return (
    <ChartFrame labels={labels ? data : undefined} style={style}>
      <img
        src={imgSrc}
        objectFit="fill"
        style={{ width: "100%", height, flexShrink: 0 }}
      />
    </ChartFrame>
  );
}

function MultiLineChart({
  data,
  palette,
  height,
  style,
  labels = true,
  grid = false,
  markers = true,
  fill = false,
  width = 480,
}: {
  data: ChartSeriesPoint[];
  palette: string[];
  height: number;
  style?: Partial<StyleDesc>;
  labels?: boolean;
  grid?: boolean;
  markers?: boolean;
  fill?: boolean;
  width?: number;
}) {
  const t = useAdwaita();
  const seriesCount = Math.max(...data.map((d) => d.values.length), 1);
  const maxValue = maxSeriesValue(data);
  const padding = 10;

  const pointAt = makeLinePointAt(
    data.length,
    maxValue,
    width,
    height,
    padding,
  );

  return (
    <ChartFrame labels={labels ? data : undefined} style={style}>
      <div style={{ position: "relative", height }}>
        {Array.from({ length: seriesCount }, (_, s) => {
          const points: string[] = [];
          const dots: string[] = [];
          data.forEach((d, i) => {
            const v = d.values[s];
            if (v === undefined) return;
            const p = pointAt(i, v.value);
            points.push(`${p.x},${p.y}`);
            if (markers) {
              dots.push(
                `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${seriesColor(palette, s)}"/>`,
              );
            }
          });
          const imgSrc = buildLineSvgSeries({
            width,
            height,
            padding,
            color: seriesColor(palette, s),
            points: points.join(" "),
            dots: dots.join(""),
            axisColor: s === 0 ? t.color.border.default : undefined,
            gridLines:
              s === 0 && grid
                ? lineGridMarkup(width, height, padding, t.color.border.default)
                : undefined,
            area: fill
              ? { top: t.color.chart.fillTop, bottom: t.color.chart.fillBottom }
              : undefined,
          });
          return (
            <img
              key={s}
              src={imgSrc}
              objectFit="fill"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height,
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>
    </ChartFrame>
  );
}
