import { Fragment, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, type AdwaitaColors } from "../theme/adwaita";
import { T } from "./common";

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

export interface ChartProps {
  data: ChartData;
  type?: "bar" | "line";

  
  color?: string;

  
  colors?: string[];
  height?: number;
  style?: Partial<StyleDesc>;
  hideZeroLabels?: boolean;

  
  grid?: boolean;
  
  markers?: boolean;
  
  width?: number;
}

function isMultiSeriesData(data: ChartData): data is ChartSeriesPoint[] {
  return data.length > 0 && Array.isArray((data[0] as ChartSeriesPoint).values);
}


export function chartPalette(
  colors: Pick<
    AdwaitaColors,
    "accent" | "success" | "warning" | "destructive" | "dim_fg"
  >,
): string[] {
  return [
    colors.accent,
    colors.success,
    colors.warning,
    colors.destructive,
    colors.dim_fg,
  ];
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
  grid = false,
  markers = true,
  width = 480,
}: ChartProps) {
  const t = useAdwaita();

  if (data.length === 0) {
    return <EmptyChart height={height} style={style} />;
  }

  const palette = colors ?? chartPalette(t.colors);
  if (isMultiSeriesData(data)) {
    if (type === "line") {
      return (
        <MultiLineChart
          data={data}
          palette={palette}
          height={height}
          style={style}
          grid={grid}
          markers={markers}
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
        grid={grid}
      />
    );
  }

  const chartColor = color ?? t.colors.accent;
  if (type === "line") {
    return (
      <LineChart
        data={data}
        color={chartColor}
        height={height}
        style={style}
        grid={grid}
        markers={markers}
        width={width}
      />
    );
  }
  return (
    <BarChart
      data={data}
      color={chartColor}
      height={height}
      style={style}
      hideZeroLabels={hideZeroLabels}
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
  const { colors } = t;
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
          <T size="caption" color={colors.dim_fg}>
            {item.name}
          </T>
        </div>
      ))}
    </div>
  );
}

interface ChartRendererProps {
  data: ChartDataPoint[];
  color: string;
  height: number;
  style?: Partial<StyleDesc>;
  hideZeroLabels?: boolean;
  grid?: boolean;
  markers?: boolean;
  width?: number;
}

function EmptyChart({ height, style }: { height: number; style?: Partial<StyleDesc> }) {
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
      <T size="caption" color={t.colors.dim_fg}>
        No data
      </T>
    </div>
  );
}

function ChartLabels({ labels }: { labels: ChartData }) {
  const t = useAdwaita();
  const { colors } = t;
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
            <T size="caption" color={colors.dim_fg} align="center">
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


function BarGrid({
  plotHeight,
  color,
}: {
  plotHeight: number;
  color: string;
}) {
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
}): string {
  const { width, height, padding, color, points, dots, axisColor, gridLines } =
    params;
  const svgSource = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${gridLines ?? ""}
    ${axisColor !== undefined ? `<line x1="0" y1="${height - padding}" x2="${width}" y2="${height - padding}" stroke="${axisColor}" stroke-width="1"/>` : ""}
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
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


function timeGapWeights(data: ChartDataPoint[]): { base: number; gaps: number[] } {
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
  grid = false,
}: ChartRendererProps) {
  const t = useAdwaita();
  const { colors } = t;

  const plotHeight = Math.max(height - 16, 8);
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const { base, gaps } = timeGapWeights(data);

  return (
    <ChartFrame labels={data} style={style}>
      <div style={{ position: "relative" }}>
        {grid ? <BarGrid plotHeight={plotHeight} color={colors.border} /> : null}
        <BarRow height={height} gap={4}>
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
                    gap: 4,
                  }}
                >
                  {hideZeroLabels && d.value === 0 ? null : (
                    <T size="caption" color={colors.dim_fg}>
                      {d.value}
                    </T>
                  )}
                  <div
                    style={{
                      width: "100%",
                      minHeight: d.value === 0 ? 0 : 4,
                      height: barHeight,
                      borderRadius: 4,
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
        </BarRow>
      </div>
    </ChartFrame>
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
  return value === 0 ? 0 : Math.max(4, Math.round((value / maxValue) * plotHeight));
}

function MultiBarChart({
  data,
  palette,
  height,
  style,
  hideZeroLabels = false,
  grid = false,
}: {
  data: ChartSeriesPoint[];
  palette: string[];
  height: number;
  style?: Partial<StyleDesc>;
  hideZeroLabels?: boolean;
  grid?: boolean;
}) {
  const t = useAdwaita();
  const { colors } = t;
  const plotHeight = Math.max(height - 16, 8);
  const maxValue = maxSeriesValue(data);

  return (
    <ChartFrame style={style}>
      <div style={{ position: "relative" }}>
        {grid ? <BarGrid plotHeight={plotHeight} color={colors.border} /> : null}
        <BarRow height={height} gap={8}>
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
                      {hideZeroLabels && v.value === 0 ? null : (
                        <T size="caption" color={colors.dim_fg}>
                          {v.value}
                        </T>
                      )}
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
              <T size="caption" color={colors.dim_fg} align="center">
                {d.label}
              </T>
            </div>
          ))}
        </BarRow>
      </div>
    </ChartFrame>
  );
}

function LineChart({
  data,
  color,
  height,
  style,
  grid = false,
  markers = true,
  width = 480,
}: ChartRendererProps) {
  const t = useAdwaita();
  const { colors } = t;
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const padding = 10;

  const pointAt = makeLinePointAt(data.length, maxValue, width, height, padding);

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
          return `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${color}"/>`;
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
    axisColor: colors.border,
    gridLines: grid ? lineGridMarkup(width, height, padding, colors.border) : undefined,
  });

  return (
    <ChartFrame labels={data} style={style}>
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
  grid = false,
  markers = true,
  width = 480,
}: {
  data: ChartSeriesPoint[];
  palette: string[];
  height: number;
  style?: Partial<StyleDesc>;
  grid?: boolean;
  markers?: boolean;
  width?: number;
}) {
  const t = useAdwaita();
  const { colors } = t;
  const seriesCount = Math.max(...data.map((d) => d.values.length), 1);
  const maxValue = maxSeriesValue(data);
  const padding = 10;

  const pointAt = makeLinePointAt(data.length, maxValue, width, height, padding);

  return (
    <ChartFrame labels={data} style={style}>
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
            axisColor: s === 0 ? colors.border : undefined,
            gridLines:
              s === 0 && grid
                ? lineGridMarkup(width, height, padding, colors.border)
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
