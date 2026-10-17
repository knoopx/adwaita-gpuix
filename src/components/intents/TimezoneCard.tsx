import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Icon } from "../icons";
import { Badge } from "../Badge";
import { Card } from "../Card";
import { Row } from "../Box";

export interface ZoneData {
  label: string;
  tz: string;
}

export interface TimezoneData {
  instant: string | null;
  isNow: boolean;
  from: ZoneData;
  to: ZoneData | null;
}

export interface TimezoneCardProps {
  data: TimezoneData;
  style?: Partial<StyleDesc>;
}

function zoneTime(iso: string | null, tz: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function TimezoneCard({ data, style }: TimezoneCardProps) {
  const a = useAdwaita();
  const { colors } = a;
  const dim = data.instant === null;
  const fromTime = zoneTime(data.instant, data.from.tz) || "—";
  const toTime = data.to ? zoneTime(data.instant, data.to.tz) || "—" : null;
  return (
    <Card style={style}>
      <Row gap={8} align="center">
        <Icon
          name="globe"
          size={16}
          color={dim ? colors.dim_fg : colors.accent}
        />
        <T weight={600} color={colors.fg}>
          {data.from.label}
          {data.to ? ` → ${data.to.label}` : ""}
        </T>
        {data.isNow ? <Badge variant="outline">now</Badge> : null}
      </Row>
      {toTime !== null ? (
        <Row gap={8} align="end">
          <T size="caption" color={colors.dim_fg}>
            {fromTime} →
          </T>
          <T size="title1" weight={700} color={dim ? colors.dim_fg : colors.fg}>
            {toTime}
          </T>
        </Row>
      ) : (
        <>
          <T size="title1" weight={700} color={dim ? colors.dim_fg : colors.fg}>
            {fromTime}
          </T>
          <T size="caption" color={colors.dim_fg}>
            {data.from.tz}
          </T>
        </>
      )}
    </Card>
  );
}
