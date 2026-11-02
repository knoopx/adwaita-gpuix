import { defineMeta, defineStory } from "storybook";
import { AdwaitaProvider, useAdwaita } from "../../theme/adwaita";
import { Labeled } from "../text";
import { Button } from "../Button";
import { StatusBar } from "./StatusBar";
import { Stack, Transport } from "../../../.storybook/app-helpers";
import { type Shortcut } from "../../lib/shortcuts";

const meta = defineMeta({
  title: "Adwaita/StatusBar",
  component: StatusBar,
  parameters: { width: 640, height: 210 },
});

export default meta;

const noop = () => {};

function FooterActions() {
  const t = useAdwaita();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: t.space.sm,
        width: "100%",
        paddingLeft: t.space.md,
        paddingRight: t.space.md,
      }}
    >
      <Button variant="icon" size="icon" icon="info" onClick={noop} />
      <Button
        variant="destructive"
        label="End App"
        trailingIcon="expandMore"
        onClick={noop}
      />
    </div>
  );
}

export const resourcesFooter = defineStory({
  parameters: {
    width: 640,
    height: 150,
    source:
      "Resources-1.png — the window's bottom slot is inert text; the info button and the destructive `End App` sit below it, never in the bar.",
  },
  render: () => (
    <Labeled caption="Resources (Resources-1): inert bar, the footer actions below it">
      <StatusBar />
      <FooterActions />
    </Labeled>
  ),
});

export const decibelsTransport = defineStory({
  parameters: {
    source:
      "Decibels-1.png — the bottom of the window shows the elapsed time `02:18` at the left edge and the total `03:21` at the right edge; the transport row (x 1.0, seek, pause, volume) is controls, so it stays under the bar.",
  },
  render: () => (
    <Stack>
      <Labeled caption="Decibels-1: the times in the bar, the transport row below">
        <StatusBar message="02:18" trailing="03:21" />
        <Transport />
      </Labeled>
    </Stack>
  ),
});

export const decibelsTransportDark = defineStory({
  parameters: {
    source:
      "Decibels-2.png — the same bar (`02:18` left, `03:21` right) and the same transport row in the dark scheme.",
  },
  render: () => (
    <AdwaitaProvider scheme="dark">
      <Stack>
        <Labeled caption="Decibels-2 (dark): the same bar and transport">
          <StatusBar message="02:18" trailing="03:21" />
          <Transport />
        </Labeled>
      </Stack>
    </AdwaitaProvider>
  ),
});

export const statusText = defineStory({
  parameters: {
    width: 640,
    height: 90,
    source:
      "Resources-1.png (HIG §15.2) — one dim line, the figures right-aligned: the visible app list is 12 apps (Files, Firefox, GNOME Shell, GSConnect, Mullvad VPN, Problem Reporting, Resources, Settings, Software, Syncthing Web UI, System Processes, Thunderbird) and the selected `Resources` row reads `73.15 MB`, `1.2 %`, `3.2 %`.",
  },
  render: () => (
    <Labeled caption="Resources-1: the facts of the open object, one inert line">
      <StatusBar message="12 apps" trailing="73.15 MB · 1.2 % · 3.2 %" />
    </Labeled>
  ),
});

export const progressRail = defineStory({
  parameters: {
    width: 640,
    height: 90,
    source:
      "Impression-3.png (HIG §15.3) — the writing screen: the heading `Writing…`, the line `Copying files…` and `65 %` over the progress bar; the words and the percent move to the inert bottom slot, answered by the 4px rail.",
  },
  render: () => (
    <Labeled caption="Impression-3: the task in words, the 4px rail, the percent">
      <StatusBar message="Copying files…" progress={0.65} trailing="65%" />
    </Labeled>
  ),
});

const COMMIT_HINTS: Shortcut[] = [
  { id: "confirm", kbds: [["ctrl", "enter"]], desc: "save and confirm" },
  { id: "dismiss", kbds: ["escape"], desc: "cancel and dismiss" },
  { id: "quit", kbds: [["ctrl", "q"]], desc: "quit" },
];

export const keyHints = defineStory({
  parameters: {
    width: 640,
    height: 90,
    source:
      "Commit-2.png (HIG §15.2) — the Shortcuts window: `Ctrl + enter` is `Save and Confirm`, `Escape` is `Cancel and Dismiss`, `Ctrl + Q` is `Quit`; their caps in the inert bottom slot.",
  },
  render: () => (
    <Labeled caption="Commit-2: the window's shortcuts as key caps">
      <StatusBar hints={COMMIT_HINTS} />
    </Labeled>
  ),
});
