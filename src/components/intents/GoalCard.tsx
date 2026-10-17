import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Card } from "../Card";
import { Icon } from "../icons";
import { ProgressBar } from "../ProgressBar";
import { Row } from "../Box";

export interface GoalData {
  title: string;
  current: number;
  target: number | null;
  unit: string | null;
}

export interface GoalCardProps {
  data: GoalData;
  style?: Partial<StyleDesc>;
}

export function GoalCard({ data, style }: GoalCardProps) {
  const t = useAdwaita();
  const { colors } = t;
  const pct =
    data.target && data.target > 0
      ? Math.min(100, Math.round((data.current / data.target) * 100))
      : 0;
  const done = pct === 100;
  const unit = data.unit ? ` ${data.unit}` : "";
  const detail =
    data.target !== null
      ? `${data.current}${unit} / ${data.target}${unit}`
      : `${data.current}${unit}`;
  return (
    <Card style={style}>
      <Row gap={8} align="center">
        <Icon
          name={done ? "success" : "circleDot"}
          size={16}
          color={done ? colors.success : colors.accent}
        />
        <T size="body" weight={600} color={colors.fg}>
          {data.title || "Goal"}
        </T>
      </Row>
      <ProgressBar value={pct} color={done ? "success" : "accent"} />
      <Row gap={8} align="center" justify="space-between">
        <T size="caption" color={colors.dim_fg}>
          {detail}
        </T>
        <Row gap={2} align="center">
          <T size="caption" weight={600} color={colors.fg}>
            {pct}
          </T>
          <T size="caption" color={colors.dim_fg}>
            %
          </T>
        </Row>
      </Row>
    </Card>
  );
}
