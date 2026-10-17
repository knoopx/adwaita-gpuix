import { defineMeta, defineStory } from "storybook";
import type { ReactNode } from "react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Row, Column } from "../Box";
import { Glyph, type GlyphName } from "./Glyph";

function Stage({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
      }}
    >
      {children}
    </div>
  );
}

function GlyphRow() {
  const t = useAdwaita();
  const glyphs: { name: GlyphName; color: string }[] = [
    { name: "terminal", color: t.colors.fg },
    { name: "flask", color: t.colors.accent },
    { name: "globe", color: t.colors.success },
  ];
  return (
    <Row gap={24}>
      {glyphs.map(({ name, color }) => (
        <Column key={name} gap={6} align="center">
          <Glyph name={name} size={16} color={color} />
          <T size="caption" color={t.colors.dim_fg}>
            {name}
          </T>
        </Column>
      ))}
    </Row>
  );
}

export default defineMeta({
  title: "Adwaita/Glyph",
  component: Glyph,
  parameters: { width: 320, height: 120 },
});

export const row = defineStory({
  parameters: { width: 320, height: 120 },
  render: () => (
    <Stage>
      <GlyphRow />
    </Stage>
  ),
});
