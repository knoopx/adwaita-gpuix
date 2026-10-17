import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row, Column } from "./Box";
import { Icon } from "./icons";
import { Card } from "./Card";
import { AspectRatio } from "./AspectRatio";

export default defineMeta({
  title: "Adwaita/AspectRatio",
  component: AspectRatio,
  parameters: { width: 528, height: 360 },
});

interface TileProps {
  label: string;
  ratio: number;
  width?: number;
  height?: number;
}

function Tile({ label, ratio, width, height }: TileProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <AspectRatio ratio={ratio} width={width} height={height}>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.accentTint,
          borderRadius: radii.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <T>{label}</T>
      </div>
    </AspectRatio>
  );
}

export const byWidth = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="By width (16 : 9, width=400 → height 225)">
        <Tile label="16 : 9" ratio={16 / 9} width={400} />
      </Labeled>
    </Column>
  ),
});

export function byHeight() {
  const t = useAdwaita();
  return (
    <Column gap={16} align="center">
      <Labeled caption="By height (16 : 9, height=90 → width 160)">
        <Tile label="16 : 9" ratio={16 / 9} height={90} />
      </Labeled>
      <Labeled caption="Fixed width+height (120×68)">
        <Tile
          label="120×68"
          ratio={16 / 9}
          width={120}
          height={68}
        />
      </Labeled>
      <Column gap={4} align="center">
        <T size="caption" color={t.colors.dim_fg}>
          Fills parent (180×101, no explicit dimensions)
        </T>
        <div style={{ width: 180, height: 101 }}>
          <AspectRatio ratio={16 / 9}>
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: t.colors.accentTint,
                borderRadius: t.radii.card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <T>16 : 9</T>
            </div>
          </AspectRatio>
        </div>
      </Column>
    </Column>
  );
}

export const commonRatios = defineStory({
  parameters: { width: 760, height: 200 },
  render: () => (
    <Column gap={16} align="center">
      <Row gap={16} align="start">
        <Labeled caption="1 : 1">
          <Tile label="1 : 1" ratio={1} height={90} />
        </Labeled>
        <Labeled caption="4 : 3">
          <Tile label="4 : 3" ratio={4 / 3} height={90} />
        </Labeled>
        <Labeled caption="16 : 9">
          <Tile label="16 : 9" ratio={16 / 9} height={90} />
        </Labeled>
        <Labeled caption="3 : 2">
          <Tile label="3 : 2" ratio={3 / 2} height={90} />
        </Labeled>
        <Labeled caption="2 : 3">
          <Tile label="2 : 3" ratio={2 / 3} height={90} />
        </Labeled>
        <Labeled caption="9 : 16">
          <Tile label="9 : 16" ratio={9 / 16} height={90} />
        </Labeled>
      </Row>
    </Column>
  ),
});

export function content() {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <Column gap={16} align="center">
      <Column gap={4} align="center">
        <T size="caption" color={t.colors.dim_fg}>
          Image placeholder (4 : 3, width=240)
        </T>
        <AspectRatio ratio={4 / 3} width={240}>
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: colors.button_bg,
              borderRadius: radii.card,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Icon name="image" size={28} color={colors.dim_fg} />
            <T size="caption" color={colors.dim_fg}>
              Image
            </T>
          </div>
        </AspectRatio>
      </Column>
      <Column gap={4} align="center">
        <T size="caption" color={t.colors.dim_fg}>
          Text content (16 : 9, width=320)
        </T>
        <AspectRatio ratio={16 / 9} width={320}>
          <Card
            title="Card in a 16 : 9 frame"
            style={{ width: "100%", height: "100%" }}
          >
            <T size="caption" color={colors.dim_fg}>
              A card constrained to the aspect frame.
            </T>
          </Card>
        </AspectRatio>
      </Column>
      <Column gap={4} align="center">
        <T size="caption" color={t.colors.dim_fg}>
          Nested card (3 : 2 tile inside a card)
        </T>
        <Card title="Nested card">
          <AspectRatio ratio={3 / 2} width={260}>
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: colors.accentTint,
                borderRadius: radii.card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <T>3 : 2</T>
            </div>
          </AspectRatio>
        </Card>
      </Column>
    </Column>
  );
}
content.parameters = { height: 620 };

export const constrainedVsFull = defineStory({
  parameters: { height: 440 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="Constrained width (16 : 9, width=200)">
        <Tile label="16 : 9" ratio={16 / 9} width={200} />
      </Labeled>
      <Labeled caption="Wider width (16 : 9, width=400)">
        <Tile label="16 : 9" ratio={16 / 9} width={400} />
      </Labeled>
    </Column>
  ),
});
