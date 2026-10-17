import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Card } from "../Card";
import { Icon } from "../icons";
import { Badge } from "../Badge";
import { Row } from "../Box";

export interface HabitData {
  title: string;
  days: number[];
  perWeek: number | null;
  label: string | null;
}

export interface HabitCardProps {
  data: HabitData;
  style?: Partial<StyleDesc>;
}

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export function HabitCard({ data, style }: HabitCardProps) {
  const t = useAdwaita();
  const { colors } = t;
  const active = new Set(data.days);
  return (
    <Card style={style}>
      <Row gap={8} align="center">
        <Icon name="calendar" size={16} color={colors.accent} />
        <T size="body" weight={600} color={colors.fg}>
          {data.title}
        </T>
        {data.label ? <Badge variant="secondary">{data.label}</Badge> : null}
      </Row>
      {data.days.length > 0 ? (
        <Row gap={4}>
          {DAY_LETTERS.map((letter, i) => (
            <Badge key={i} variant={active.has(i) ? "default" : "outline"}>
              {letter}
            </Badge>
          ))}
        </Row>
      ) : null}
      {data.perWeek !== null ? (
        <T size="caption" color={colors.dim_fg}>
          {data.perWeek}× a week
        </T>
      ) : null}
    </Card>
  );
}
