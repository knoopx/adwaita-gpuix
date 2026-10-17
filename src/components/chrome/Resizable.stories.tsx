import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { Labeled, T } from "../common";
import { Column } from "../Box";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  Resizable,
} from "./Resizable";

function Pane({ label, height = 64 }: { label: string; height?: number }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        width: "100%",
        height,
        backgroundColor: t.colors.accentTint,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <T>{label}</T>
    </div>
  );
}

export default defineMeta({
  title: "Adwaita/Resizable",
  component: Resizable,
  parameters: { width: 528, height: 320 },
});

export const horizontalGroup = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="drag the handles">
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
      </Labeled>
    </Column>
  ),
});

export const verticalGroup = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="row-resize handles">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={56} min={32} max={120}>
            <Pane label="Top" height={48} />
          </ResizablePanel>
          <ResizableHandle panel={0} />
          <ResizablePanel defaultSize={56} min={32} max={120}>
            <Pane label="Bottom" height={48} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Labeled>
    </Column>
  ),
});

export const legacyResizable = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="left pane + flexible right pane">
        <Resizable initialLeftWidth={200}>
          <Pane label="Left pane" height={96} />
        </Resizable>
      </Labeled>
    </Column>
  ),
});

export const clampedPanels = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="drag is clamped to min 80 / max 120">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={100} min={80} max={120}>
            <Pane label="Clamped" />
          </ResizablePanel>
          <ResizableHandle panel={0} />
          <ResizablePanel>
            <Pane label="Right (flexible)" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Labeled>
    </Column>
  ),
});
