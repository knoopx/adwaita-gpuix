import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled } from "./common";
import { Column } from "./Box";
import {
  Chart,
  ChartLegend,
  chartPalette,
  type ChartDataPoint,
  type ChartSeriesPoint,
} from "./Chart";

const SINGLE_DATA: ChartDataPoint[] = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 28 },
  { label: "Wed", value: 18 },
  { label: "Thu", value: 35 },
  { label: "Fri", value: 22 },
];

const MULTI_DATA: ChartSeriesPoint[] = [
  {
    label: "Mon",
    values: [
      { name: "A", value: 12 },
      { name: "B", value: 22 },
      { name: "C", value: 8 },
    ],
  },
  {
    label: "Tue",
    values: [
      { name: "A", value: 28 },
      { name: "B", value: 18 },
      { name: "C", value: 30 },
    ],
  },
  {
    label: "Wed",
    values: [
      { name: "A", value: 18 },
      { name: "B", value: 32 },
      { name: "C", value: 14 },
    ],
  },
  {
    label: "Thu",
    values: [
      { name: "A", value: 35 },
      { name: "B", value: 12 },
      { name: "C", value: 26 },
    ],
  },
  {
    label: "Fri",
    values: [
      { name: "A", value: 22 },
      { name: "B", value: 26 },
      { name: "C", value: 18 },
    ],
  },
];

const LONG_DATA: ChartDataPoint[] = [
  { label: "Infrastructure", value: 42 },
  { label: "Research & Development", value: 61 },
  { label: "Customer Support", value: 28 },
  { label: "Marketing", value: 35 },
  { label: "Sales", value: 52 },
];

const HOUR = 3_600_000;
const TIME_DATA: ChartDataPoint[] = [
  { label: "09:00", value: 12, ts: 0 * HOUR },
  { label: "10:00", value: 28, ts: 1 * HOUR },
  { label: "11:00", value: 18, ts: 2 * HOUR },
  { label: "14:00", value: 35, ts: 5 * HOUR },
  { label: "15:00", value: 22, ts: 6 * HOUR },
];

function legendItems(names: string[], palette: string[]) {
  return names.map((name, i) => ({ name, color: palette[i % palette.length] }));
}

function chartTypeBody(type: "bar" | "line") {
  const t = useAdwaita();
  const palette = chartPalette(t.colors);
  return (
    <Column gap={16} align="center">
      <Labeled caption="single series (default accent colour)" style={{ flexGrow: 1 }}>
        <Chart data={SINGLE_DATA} type={type} height={110} />
      </Labeled>
      <Labeled caption="single series · custom colour (warning token)" style={{ flexGrow: 1 }}>
        <Chart
          data={SINGLE_DATA}
          type={type}
          height={110}
          color={t.colors.warning}
        />
      </Labeled>
      <Labeled caption="multi-series (token palette) + legend" style={{ flexGrow: 1 }}>
        <Chart data={MULTI_DATA} type={type} height={110} />
        <ChartLegend items={legendItems(["A", "B", "C"], palette)} />
      </Labeled>
    </Column>
  );
}

export default defineMeta({
  title: "Adwaita/Chart",
  component: Chart,
  parameters: { width: 528, height: 520 },
});

export const bar = defineStory({
  render: () => chartTypeBody("bar"),
});

export const line = defineStory({
  render: () => chartTypeBody("line"),
});

export function grid() {
  const t = useAdwaita();
  const palette = chartPalette(t.colors);
  return (
    <Column gap={16} align="center">
      <Labeled caption="line · grid lines + markers (border token)" style={{ flexGrow: 1 }}>
        <Chart data={SINGLE_DATA} type="line" height={110} grid />
      </Labeled>
      <Labeled caption="multi-series bars · grid lines" style={{ flexGrow: 1 }}>
        <Chart data={MULTI_DATA} height={110} grid />
        <ChartLegend items={legendItems(["A", "B", "C"], palette)} />
      </Labeled>
    </Column>
  );
}

export function empty() {
  return (
    <Column gap={16} align="center">
      <Labeled caption="empty · bar (no data state)" style={{ flexGrow: 1 }}>
        <Chart data={[]} height={90} />
      </Labeled>
      <Labeled caption="empty · line (no data state)" style={{ flexGrow: 1 }}>
        <Chart data={[]} type="line" height={90} />
      </Labeled>
    </Column>
  );
}

export function noMarkers() {
  return (
    <Column gap={16} align="center">
      <Labeled caption="line · data point markers (default)" style={{ flexGrow: 1 }}>
        <Chart data={SINGLE_DATA} type="line" height={110} />
      </Labeled>
      <Labeled caption="line · markers off" style={{ flexGrow: 1 }}>
        <Chart data={SINGLE_DATA} type="line" height={110} markers={false} />
      </Labeled>
    </Column>
  );
}

export function longLabels() {
  return (
    <Column gap={16} align="center">
      <Labeled caption="long category labels · bar" style={{ flexGrow: 1 }}>
        <Chart data={LONG_DATA} height={110} />
      </Labeled>
      <Labeled caption="long category labels · line" style={{ flexGrow: 1 }}>
        <Chart data={LONG_DATA} type="line" height={110} />
      </Labeled>
    </Column>
  );
}

export function timeSeries() {
  return (
    <Column gap={16} align="center">
      <Labeled caption="hourly bars · gap-weighted layout (3 h gap)" style={{ flexGrow: 1 }}>
        <Chart data={TIME_DATA} height={110} />
      </Labeled>
      <Labeled caption="hourly bars · grid lines" style={{ flexGrow: 1 }}>
        <Chart data={TIME_DATA} height={110} grid />
      </Labeled>
    </Column>
  );
}
