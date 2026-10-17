import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Card } from "../Card";
import { Row } from "../Box";
import { InfoRow } from "./InfoRow";
import { TintedPill } from "./TintedPill";

export interface EventData {
  title: string;
  date: string | null;
  hasTime: boolean;
  people: string[];
  link: string | null;
  location: string | null;
  status?: string | null;
}

export interface EventCardProps {
  data: EventData;
  style?: Partial<StyleDesc>;
}

function formatEventDate(iso: string, hasTime: boolean): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (!hasTime) return date;
  return `${date} ${d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function EventCard({ data, style }: EventCardProps) {
  const a = useAdwaita();
  const { colors } = a;
  return (
    <Card style={style}>
      <Row gap={8} align="center" justify="space-between">
        <T weight={600} style={{ flexGrow: 1, minWidth: 0 }}>
          {data.title}
        </T>
        {data.status ? (
          <TintedPill>
            <T size="caption" weight={600} color={colors.accent}>
              {data.status}
            </T>
          </TintedPill>
        ) : null}
      </Row>
      {data.date ? (
        <InfoRow icon="calendar">
          {formatEventDate(data.date, data.hasTime)}
        </InfoRow>
      ) : null}
      {data.location ? <InfoRow icon="mapPin">{data.location}</InfoRow> : null}
      {data.people.length > 0 ? (
        <InfoRow icon="user">with {data.people.join(", ")}</InfoRow>
      ) : null}
      {data.link ? <InfoRow icon="link">{data.link}</InfoRow> : null}
    </Card>
  );
}
