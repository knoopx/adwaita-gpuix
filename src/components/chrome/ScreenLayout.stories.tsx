import { type ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { Labeled, T } from "../text";
import { Column } from "../Box";
import { FileListTitle, MonoBadge, PanelTrailing } from "../../lib/panel";
import { HeaderBar } from "./HeaderBar";
import { ViewSwitcher, type ViewSwitcherItem } from "./ViewSwitcher";
import { Entry } from "../Entry";
import { ScreenLayout } from "./ScreenLayout";

function LayoutDemo({
  withMid = true,
  midHeaderless = false,
  bottomHeaderless = false,
  bottom = <T>@@ -1,3 +1,4 @@</T>,
}: {
  withMid?: boolean;
  midHeaderless?: boolean;
  bottomHeaderless?: boolean;
  bottom?: ReactNode;
}) {
  return (
    <Column gap={0} style={{ height: 180, width: "100%" }}>
      <ScreenLayout
        leftTitle="Files"
        leftFocused={true}
        left={<T>src/main.ts</T>}
        mid={withMid ? <T>preview content</T> : undefined}
        midTitle="Preview"
        midHeaderless={midHeaderless}
        bottomTitle="Diff"
        bottomHeaderless={bottomHeaderless}
        bottom={bottom}
      />
    </Column>
  );
}

function ScreenCell({
  caption,
  height = 130,
  leftFocused,
  midFocused,
  leftGrow,
  rightGrow,
  mid,
}: {
  caption: string;
  height?: number;
  leftFocused: boolean;
  midFocused?: boolean;
  leftGrow?: number;
  rightGrow?: number;
  mid?: ReactNode;
}) {
  return (
    <Labeled caption={caption}>
      <Column gap={0} style={{ height, width: "100%" }}>
        <ScreenLayout
          leftTitle="Files"
          leftFocused={leftFocused}
          midFocused={midFocused}
          leftGrow={leftGrow}
          rightGrow={rightGrow}
          left={<T>src/main.ts</T>}
          mid={mid}
          midTitle="Preview"
          bottomTitle="Diff"
          bottom={<T>@@ -1,3 +1,4 @@</T>}
        />
      </Column>
    </Labeled>
  );
}

const SCREEN_VIEWS: ViewSwitcherItem[] = [
  { id: "files", icon: "article", label: "Files" },
  { id: "preview", icon: "visibility", label: "Preview" },
];

export default defineMeta({
  title: "Adwaita/ScreenLayout",
  component: ScreenLayout,
  parameters: { width: 528, height: 440 },
});

export const layout = defineStory({
  render: () => (
    <>
      <Labeled caption="three panels (left + mid + bottom)">
        <LayoutDemo withMid />
      </Labeled>
      <Labeled caption="two panels (left + bottom)">
        <LayoutDemo withMid={false} />
      </Labeled>
    </>
  ),
});

export const trailingControls = defineStory({
  render: () => (
    <Labeled caption="trailing nodes (left badge + bottom badge)">
      <Column gap={0} style={{ height: 220, width: "100%" }}>
        <ScreenLayout
          leftTitle="Files"
          leftFocused={true}
          trailing={
            <PanelTrailing loading={false} badge={<MonoBadge text="12" />} />
          }
          left={<T>src/main.ts</T>}
          bottomTitle="Diff"
          bottomTrailing={
            <PanelTrailing loading={false} badge={<MonoBadge text="3" />} />
          }
          bottom={<T>@@ -1,3 +1,4 @@</T>}
        />
      </Column>
    </Labeled>
  ),
});

export const focusStates = defineStory({
  render: () => (
    <Column gap={4}>
      <ScreenCell
        caption="left focused"
        leftFocused={true}
        midFocused={false}
        mid={<T>preview content</T>}
      />
      <Column gap={4} style={{ marginTop: 8 }}>
        <ScreenCell
          caption="mid focused"
          leftFocused={false}
          midFocused={true}
          mid={<T>preview content</T>}
        />
      </Column>
    </Column>
  ),
});

export const headerlessMid = defineStory({
  render: () => (
    <Labeled caption="headerless mid panel">
      <LayoutDemo midHeaderless={true} />
    </Labeled>
  ),
});

export const headerlessBottom = defineStory({
  render: () => (
    <Labeled caption="headerless bottom panel (the body names itself)">
      <LayoutDemo bottomHeaderless={true} bottom={<T>src/main.ts +1 -0</T>} />
    </Labeled>
  ),
});

export const growRatios = defineStory({
  render: () => (
    <Column gap={4}>
      <ScreenCell
        caption="wide left (leftGrow 45 / rightGrow 55)"
        height={120}
        leftFocused={true}
        leftGrow={45}
        rightGrow={55}
      />
      <Column gap={4} style={{ marginTop: 8 }}>
        <ScreenCell
          caption="narrow left (leftGrow 15 / rightGrow 85)"
          height={120}
          leftFocused={true}
          leftGrow={15}
          rightGrow={85}
        />
      </Column>
    </Column>
  ),
});

export const truncation = defineStory({
  render: () => (
    <Labeled caption="long pane titles ellipsize instead of spilling the header">
      <Column gap={0} style={{ height: 180, width: "100%" }}>
        <ScreenLayout
          leftTitle="Working copy changes in the repository (9 commits)"
          leftFocused={false}
          left={<T>src/main.ts</T>}
          mid={<T>preview content</T>}
          midTitle={
            <FileListTitle
              description="refactor(app): mount with adwaita-gpuix/app launchApp (theme + ToastProvider wrap + window options) instead of hand-rolling renderer setup"
              focused={true}
            />
          }
          midTrailing={
            <PanelTrailing
              loading={false}
              badge={<MonoBadge text="ulpzqwrk" />}
            />
          }
          bottomTitle="tests/integration/very/long/path/to/a/deeply/nested/module/harness.tsx"
          bottomTrailing={
            <PanelTrailing loading={false} badge={<MonoBadge text="+3 -0" />} />
          }
          bottom={<T>@@ -1,3 +1,4 @@</T>}
        />
      </Column>
    </Labeled>
  ),
});

export const screenComposition = defineStory({
  render: () => (
    <Labeled caption="app screen: headerbar + layout">
      <Column gap={0} style={{ height: 340, width: "100%" }}>
        <HeaderBar
          left={
            <ViewSwitcher
              items={SCREEN_VIEWS}
              value="files"
              onChange={() => {}}
            />
          }
          center={
            <Entry type="search" placeholder="Search" value="src/main.ts" />
          }
        />
        <ScreenLayout
          leftTitle="Files"
          leftFocused={true}
          left={<T>src/main.ts</T>}
          mid={<T>preview content</T>}
          midTitle="Preview"
          bottomTitle="Diff"
          bottom={<T>@@ -1,3 +1,4 @@</T>}
        />
      </Column>
    </Labeled>
  ),
});
