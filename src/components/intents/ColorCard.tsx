import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Badge } from "../Badge";
import { Card } from "../Card";
import { Row, Column } from "../Box";

export type ColorSource = "hex" | "rgb" | "named" | "mood";

export interface ColorData {
  hex: string | null;
  name: string | null;
  source: ColorSource | null;
}

export interface ColorCardProps {
  data: ColorData;
  
  swatches?: ColorData[];
  style?: Partial<StyleDesc>;
}

const SWATCH_SIZE = 24;

export function ColorCard({ data, swatches, style }: ColorCardProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const swatchList = swatches ?? [];
  const multi = swatchList.length > 0;

  const chipStyle = (hex: string | null): Partial<StyleDesc> => ({
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: radii.button,
    backgroundColor: hex ?? colors.button_bg,
    borderWidth: 1,
    borderColor: colors.border,
    flexShrink: 0,
  });

  return (
    <Card style={style}>
      <Row gap={8} align="center" justify="space-between">
        <T weight={600} style={{ flexShrink: 1 }}>
          {data.name ?? "Color"}
        </T>
        {data.source ? (
          <Badge variant="outline" size="sm">
            {data.source}
          </Badge>
        ) : null}
      </Row>
      {multi ? (
        <Row gap={spacing.paddingTight} align="start">
          {swatchList.map((swatch, i) => (
            <Column key={i} gap={4} align="center">
              <div style={chipStyle(swatch.hex)} />
              <T size="caption" color={colors.dim_fg}>
                {swatch.name ?? swatch.hex ?? "unresolved"}
              </T>
            </Column>
          ))}
        </Row>
      ) : (
        <Row gap={8} align="center">
          <div style={chipStyle(data.hex)} />
          <T size="caption" color={colors.dim_fg}>
            {data.hex ?? "no color resolved"}
          </T>
        </Row>
      )}
    </Card>
  );
}
