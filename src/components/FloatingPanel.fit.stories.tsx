import { defineMeta, defineStory } from "storybook";
import { T } from "./common";
import { useAdwaita } from "../theme/adwaita";

function TallMenu({
  rows,
  maxHeight,
}: {
  rows: number;
  maxHeight?: number;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 4,
        minWidth: 200,
        ...(maxHeight !== undefined
          ? { maxHeight, overflowY: "auto" }
          : {}),
        borderRadius: t.radii.card,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.view_bg,
      }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ padding: 8 }}>
          <T size="body">Row {i + 1}</T>
        </div>
      ))}
    </div>
  );
}

function Stage({ children }: { children?: import("react").ReactNode }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        position: "relative",
        width: 400,
        height: 500,
        backgroundColor: t.colors.window_bg,
        borderRadius: t.radii.card,
      }}
    >
      {children}
    </div>
  );
}

function BottomFlipTrigger({ maxHeight }: { maxHeight?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: 24,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <T size="body" color="#fff">
        trigger
      </T>
      <anchored side="bottom" offset={{ x: 0, y: 8 }} fit="switch">
        <TallMenu rows={12} maxHeight={maxHeight} />
      </anchored>
    </div>
  );
}

function BottomFlipFitStory({ maxHeight }: { maxHeight?: number }) {
  return (
    <Stage>
      <BottomFlipTrigger maxHeight={maxHeight} />
    </Stage>
  );
}

export default defineMeta({
  title: "Adwaita/FloatingPanelFit",
  parameters: { width: 420, height: 520 },
});



export const bottomFlip = defineStory({
  render: () => <BottomFlipFitStory />,
});


export const bottomFlipCapped = defineStory({
  render: () => <BottomFlipFitStory maxHeight={140} />,
});
