import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita, SPACE } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Column } from "./Box";
import {
  Heading,
  Paragraph,
  Small,
  Blockquote,
  InlineCode,
  type TextTone,
} from "./Typography";

export default defineMeta({
  title: "Adwaita/Typography",
  component: Heading,
  parameters: { width: 528, height: 320 },
});

function Row({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        gap: SPACE.md,
      }}
    >
      <div style={{ width: 96 }}>
        <T size="caption" color={t.colors.dim_fg}>
          {label}
        </T>
      </div>
      {children}
    </div>
  );
}

export const headings = defineStory({
  render: () => (
    <Column gap={SPACE.lg} align="center">
      <Labeled caption="levels 1–6">
        <Column gap={SPACE.xs} align="center">
          <Heading level={1}>Heading 1</Heading>
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Heading level={4}>Heading 4</Heading>
          <Heading level={5}>Heading 5</Heading>
          <Heading level={6}>Heading 6</Heading>
        </Column>
      </Labeled>
    </Column>
  ),
});

export const body = defineStory({
  render: () => (
    <Column gap={SPACE.lg} align="center">
      <Labeled caption="paragraph">
        <Paragraph>A paragraph of body text.</Paragraph>
      </Labeled>
      <Labeled caption="paragraph (dim)">
        <Paragraph tone="dim">A dim paragraph of body text.</Paragraph>
      </Labeled>
      <Labeled caption="small">
        <Small>A small caption-sized line of text.</Small>
      </Labeled>
    </Column>
  ),
});

const TONES: TextTone[] = [
  "default",
  "dim",
  "accent",
  "destructive",
  "success",
  "warning",
];

export const tones = defineStory({
  render: () => (
    <Column gap={SPACE.lg}>
      <Labeled caption="paragraph tone">
        <Column gap={SPACE.md}>
          {TONES.map((tone) => (
            <Row key={tone} label={tone}>
              <Paragraph tone={tone}>Body text in {tone}.</Paragraph>
            </Row>
          ))}
        </Column>
      </Labeled>
      <Labeled caption="small tone">
        <Column gap={SPACE.md}>
          <Row label="accent">
            <Small tone="accent">Small accent line.</Small>
          </Row>
          <Row label="destructive">
            <Small tone="destructive">Small destructive line.</Small>
          </Row>
        </Column>
      </Labeled>
    </Column>
  ),
});

export const alignment = defineStory({
  render: () => {
    const list = [
      { align: "left" as const, label: "left" },
      { align: "center" as const, label: "center" },
      { align: "right" as const, label: "right" },
    ];
    return (
      <Column gap={SPACE.md}>
        {list.map((item) => (
          <Row key={item.align} label={item.label}>
            <Paragraph align={item.align} style={{ flexGrow: 1 }}>
              Body text, {item.label}-aligned.
            </Paragraph>
          </Row>
        ))}
      </Column>
    );
  },
});

export const quoteCode = defineStory({
  render: () => (
    <Column gap={SPACE.lg} align="center">
      <Labeled caption="blockquote">
        <Blockquote>
          A blockquote of wise words, quoted from the source.
        </Blockquote>
      </Labeled>
      <Labeled caption="inline code">
        <Paragraph>
          A paragraph with <InlineCode>inline code</InlineCode> in the middle.
        </Paragraph>
      </Labeled>
    </Column>
  ),
});
