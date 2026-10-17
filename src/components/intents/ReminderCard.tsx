import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Card } from "../Card";
import { Icon } from "../icons";
import { Row } from "../Box";
import { InfoRow } from "./InfoRow";

export interface ReminderData {
  task: string;
  when: string | null;
  hasTime: boolean;
  repeat?: string | null;
}

export interface ReminderCardProps {
  data: ReminderData;
  style?: Partial<StyleDesc>;
}

function formatReminderWhen(iso: string, hasTime: boolean): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  if (!hasTime) return date;
  return `${date}, ${d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function ReminderCard({ data, style }: ReminderCardProps) {
  const a = useAdwaita();
  const { colors } = a;
  return (
    <Card style={style}>
      <Row gap={8} align="center">
        <Icon name="bell" size={16} color={colors.accent} />
        <T weight={600}>{data.task}</T>
      </Row>
      <InfoRow icon="clock">
        {data.when
          ? formatReminderWhen(data.when, data.hasTime)
          : "no time set"}
      </InfoRow>
      {data.repeat ? <InfoRow icon="refresh">{data.repeat}</InfoRow> : null}
    </Card>
  );
}
