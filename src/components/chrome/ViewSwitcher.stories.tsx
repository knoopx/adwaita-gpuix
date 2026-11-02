import { type ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../text";
import { ViewSwitcher, type ViewSwitcherItem } from "./ViewSwitcher";
import {
  FILES_VIEWS,
  MONITOR_VIEWS,
  Stack,
  WEATHER_VIEWS,
} from "../../../.storybook/app-helpers";

const meta = defineMeta({
  title: "Adwaita/ViewSwitcher",
  component: ViewSwitcher,
  parameters: { width: 560, height: 250 },
});

export default meta;

const noop = () => {};

function Centred({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

const CLOCKS_VIEWS: ViewSwitcherItem[] = [
  { id: "world", icon: "globe", label: "World" },
  { id: "alarms", icon: "alarm", label: "Alarms" },
  { id: "stopwatch", icon: "timer", label: "Stopwatch" },
  { id: "timer", icon: "hourglass", label: "Timer" },
];

export const weatherHourly = defineStory({
  render: () => (
    <Stack>
      <Labeled caption="Weather (Weather-1): Hourly active">
        <Centred>
          <ViewSwitcher items={WEATHER_VIEWS} value="hourly" onChange={noop} />
        </Centred>
      </Labeled>
      <Labeled caption="Weather (Weather-2): Daily active">
        <Centred>
          <ViewSwitcher items={WEATHER_VIEWS} value="daily" onChange={noop} />
        </Centred>
      </Labeled>
    </Stack>
  ),
});

export const filesViewIcons = defineStory({
  parameters: { width: 560, height: 130 },
  render: () => (
    <Labeled caption="Files (Nautilus-2): grid / list, icon-only segments">
      <Centred>
        <ViewSwitcher items={FILES_VIEWS} value="list" onChange={noop} />
      </Centred>
    </Labeled>
  ),
});

export const systemMonitorViews = defineStory({
  parameters: { width: 560, height: 130 },
  render: () => (
    <Labeled caption="System Monitor (SystemMonitor-1): Processes active">
      <Centred>
        <ViewSwitcher items={MONITOR_VIEWS} value="processes" onChange={noop} />
      </Centred>
    </Labeled>
  ),
});

export const clocksViews = defineStory({
  parameters: { width: 560, height: 130 },
  render: () => (
    <Labeled caption="Clocks (Clocks-1): World active">
      <Centred>
        <ViewSwitcher items={CLOCKS_VIEWS} value="world" onChange={noop} />
      </Centred>
    </Labeled>
  ),
});
