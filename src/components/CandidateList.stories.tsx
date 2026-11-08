import { type ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { Labeled, TextPart } from "./text";
import { Column, Row } from "./Box";
import { Stage } from "../../.storybook/story-helpers";
import { CandidateList } from "./CandidateList";
import { CandidateRow, CANDIDATE_ROW_HEIGHT } from "./CandidateRow";

/** The bookmark and revset dialogs are 520 and 560 wide (`DialogFrame`). */
const BOOKMARK_DIALOG = 520;
const REVSET_DIALOG = 560;

/**
 * A picker on the surface of the dialog that holds it, with the line that
 * marks the hint bar following the list. The list's height is fixed to
 * `visible`, so that line never moves while the query filters the set.
 */
function PickerSurface({
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
      <Column gap={8} padding={12} style={{ width: "100%", minWidth: 0 }}>
        {children}
        <TextPart size="caption" dim>
          the dialog's hint bar follows directly under the list
        </TextPart>
      </Column>
    </Stage>
  );
}

/** The same bookmark picker, its create row drawn with `createIcon`. */
function BookmarkRows({ createIcon }: { createIcon: "plus" | "add" }) {
  return (
    <CandidateList visible={4}>
      <CandidateRow label="main" active icon="bookmark" />
      <CandidateRow label="trunk" icon="bookmark" />
      <CandidateRow label="release/1.0" icon="bookmark" />
      <CandidateRow
        label="feature/candidate-list"
        icon={createIcon}
        iconTone="warning"
        labelTone="warning"
        trailing="new bookmark"
      />
    </CandidateList>
  );
}

export default defineMeta({
  title: "Adwaita/CandidateList",
  component: CandidateList,
  parameters: { width: 620, height: 260 },
});

export const bookmarkPicker = defineStory({
  parameters: { height: 460 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption="bookmark picker — the cursor is on an existing name, the typed name is a new one"
        style={{ width: "100%" }}
      >
        <PickerSurface width={BOOKMARK_DIALOG} height={164}>
          <BookmarkRows createIcon="plus" />
        </PickerSurface>
      </Labeled>
      <Labeled
        caption={`the same row with icon="add" — this icon set ships no "plus", which falls back to a dot`}
        style={{ width: "100%" }}
      >
        <PickerSurface width={BOOKMARK_DIALOG} height={164}>
          <BookmarkRows createIcon="add" />
        </PickerSurface>
      </Labeled>
    </Column>
  ),
});

export const revsetPicker = defineStory({
  parameters: { width: 660, height: 320 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption="revset picker — the revset in use answers with an accent glyph, its expression trails in mono"
        style={{ width: "100%" }}
      >
        <PickerSurface width={REVSET_DIALOG} height={196}>
          <CandidateList visible={5}>
            <CandidateRow
              label="mine"
              active
              icon="list"
              trailing="author(me)"
              trailingMono
            />
            <CandidateRow
              label="in use"
              icon="taskAlt"
              iconTone="accent"
              trailing="main"
              trailingMono
            />
            <CandidateRow
              label="heads"
              icon="list"
              trailing="heads(trunk | main)"
              trailingMono
            />
            <CandidateRow
              label="descendants"
              icon="list"
              trailing="descendants(main)"
              trailingMono
            />
            <CandidateRow
              label="all"
              icon="list"
              trailing="all()"
              trailingMono
            />
          </CandidateList>
        </PickerSurface>
      </Labeled>
    </Column>
  ),
});

export const empty = defineStory({
  parameters: { width: 660, height: 200 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Labeled
        caption={`visible=0 + placeholder — the box keeps ${CANDIDATE_ROW_HEIGHT}px of room for the sentence`}
        style={{ width: "100%" }}
      >
        <PickerSurface width={REVSET_DIALOG} height={84}>
          <CandidateList visible={0} placeholder={'No revset matches "xyz"'} />
        </PickerSurface>
      </Labeled>
    </Column>
  ),
});

export const scrolling = defineStory({
  parameters: { width: 780, height: 300 },
  render: () => (
    <Column gap={16} padding={12} align="start" style={{ width: "100%" }}>
      <Row gap={24} align="start">
        <Labeled
          caption="visible=3 — exactly 3 candidates"
          style={{ width: 340 }}
        >
          <PickerSurface width={340} height={140}>
            <CandidateList visible={3}>
              <CandidateRow label="main" active icon="bookmark" />
              <CandidateRow label="trunk" icon="bookmark" />
              <CandidateRow label="release/1.0" icon="bookmark" />
            </CandidateList>
          </PickerSurface>
        </Labeled>
        <Labeled
          caption="visible=3 + scroll — the box never grows"
          style={{ width: 340 }}
        >
          <PickerSurface width={340} height={140}>
            <CandidateList visible={3} scroll>
              <CandidateRow label="main" active icon="bookmark" />
              <CandidateRow label="trunk" icon="bookmark" />
              <CandidateRow label="release/1.0" icon="bookmark" />
              <CandidateRow label="bookmark-picker" icon="bookmark" />
              <CandidateRow label="feature/candidate-list" icon="bookmark" />
              <CandidateRow label="archive/2024" icon="bookmark" />
            </CandidateList>
          </PickerSurface>
        </Labeled>
      </Row>
      <TextPart size="caption" dim>
        the right block's box stays 3 rows (80px) tall and the hint line never
        moves: `scroll` does not window the set, it squeezes all 6 rows into the
        same box (15px tall each) and cuts the 5th and 6th at the box's bottom
        edge, so the last candidate is never drawn
      </TextPart>
    </Column>
  ),
});
