import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Row, Column } from "../Box";
import { TintedPill } from "./TintedPill";
import { ToolCard } from "./ToolCard";

export interface ConvertData {
  value: number | null;
  from: string | null;
  to: string | null;
  result: number | null;
}

export interface ConvertCardProps {
  data: ConvertData;
  caption?: string;
  style?: Partial<StyleDesc>;
}

export function ConvertCard({ data, caption, style }: ConvertCardProps) {
  const a = useAdwaita();
  const { colors, spacing } = a;
  const result =
    data.result !== null ? Math.round(data.result * 1e6) / 1e6 : null;
  return (
    <ToolCard icon="refresh" title="Convert" style={style}>
      <Column gap={spacing.gap}>
        <Row justify="space-between" align="center">
          <T size="caption" color={colors.dim_fg}>
            from
          </T>
          <Row gap={4} align="center">
            <T weight={600}>
              {data.value !== null ? String(data.value) : "—"}
            </T>
            {data.from ? (
              <T size="caption" color={colors.dim_fg}>
                {data.from}
              </T>
            ) : null}
          </Row>
        </Row>
        <Row justify="space-between" align="center">
          <T size="caption" color={colors.dim_fg}>
            to
          </T>
          <TintedPill style={{ paddingTop: 2, paddingBottom: 2 }}>
            <T size="title3" weight={700} color={colors.accent}>
              {result !== null ? String(result) : "—"}
            </T>
            {data.to ? (
              <T size="caption" color={colors.dim_fg}>
                {data.to}
              </T>
            ) : null}
          </TintedPill>
        </Row>
        {caption ? (
          <T size="caption" color={colors.dim_fg}>
            {caption}
          </T>
        ) : null}
      </Column>
    </ToolCard>
  );
}
