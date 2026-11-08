import { type ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./text";
import { Column } from "./Box";
import { Stage } from "../../.storybook/story-helpers";
import { DialogHeading } from "./DialogHeading";

/** The widest dialog the apps open is 640 (`DialogFrame width={640}`). */
const WIDE_DIALOG = 640;
/** The bookmark and revset pickers are 520 and 560 wide. */
const PICKER_DIALOG = 560;

/**
 * A heading on the surface of the dialog that holds it, at that dialog's
 * width, so the PNG answers whether the whole title is drawn.
 */
function DialogSurface({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <Stage width={width} height={height} radius={8}>
      <Column padding={12} style={{ width: "100%", minWidth: 0 }}>
        {children}
      </Column>
    </Stage>
  );
}

export default defineMeta({
  title: "Adwaita/DialogHeading",
  component: DialogHeading,
  parameters: { width: 700, height: 260 },
});

export const iconAndTitle = defineStory({
  parameters: { height: 280 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption="icon + title — the accent glyph names what the dialog acts on"
        style={{ width: "100%" }}
      >
        <DialogSurface width={PICKER_DIALOG} height={54}>
          <DialogHeading icon="bookmark" title="Set Bookmark" />
        </DialogSurface>
      </Labeled>
      <Labeled
        caption="icon + title — a revset filter asks the same way"
        style={{ width: "100%" }}
      >
        <DialogSurface width={PICKER_DIALOG} height={54}>
          <DialogHeading icon="list" title="Revset" />
        </DialogSurface>
      </Labeled>
    </Column>
  ),
});

export const titleOnly = defineStory({
  parameters: { height: 180 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption="no icon — the title alone names the subject, so no glyph is drawn"
        style={{ width: "100%" }}
      >
        <DialogSurface width={PICKER_DIALOG} height={54}>
          <DialogHeading title="Restore Change" />
        </DialogSurface>
      </Labeled>
    </Column>
  ),
});

export const withSubtitle = defineStory({
  parameters: { height: 300 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption="icon + title + subtitle — one line of context under the title"
        style={{ width: "100%" }}
      >
        <DialogSurface width={PICKER_DIALOG} height={84}>
          <DialogHeading
            icon="article"
            title="Restore hunks — GraphGutter.tsx"
            subtitle="M · 6 hunks · 3 selected"
          />
        </DialogSurface>
      </Labeled>
      <Labeled
        caption="the subtitle is the user's sentence, never an id or a counter"
        style={{ width: "100%" }}
      >
        <DialogSurface width={PICKER_DIALOG} height={84}>
          <DialogHeading
            icon="history"
            title="Abandon Change"
            subtitle="The change is removed from the history."
          />
        </DialogSurface>
      </Labeled>
    </Column>
  ),
});

export const longTitle = defineStory({
  parameters: { width: 720, height: 300 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption="long title — the glyph keeps its room and the whole title is drawn"
        style={{ width: "100%" }}
      >
        <DialogSurface width={WIDE_DIALOG} height={84}>
          <DialogHeading
            icon="article"
            title="Restore hunks — src/components/chrome/VirtualListPanel.tsx"
            subtitle="M · 6 hunks · 3 selected"
          />
        </DialogSurface>
      </Labeled>
      <Labeled
        caption="the longest heading the apps open, with a long subtitle under it"
        style={{ width: "100%" }}
      >
        <DialogSurface width={WIDE_DIALOG} height={84}>
          <DialogHeading
            icon="article"
            title="Restore hunks — src/components/vcs/DiffCountColumn.tsx"
            subtitle="Interactive restore works on the working-copy change only."
          />
        </DialogSurface>
      </Labeled>
    </Column>
  ),
});
