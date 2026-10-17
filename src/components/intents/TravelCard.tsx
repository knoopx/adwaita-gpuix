import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Icon } from "../icons";
import { Badge } from "../Badge";
import { Card } from "../Card";
import { Row } from "../Box";

export interface TravelData {
  origin: string | null;
  destination: string | null;
  duration: string | null;
  start: string | null;
  end: string | null;
}

export interface TravelCardProps {
  data: TravelData;
  style?: Partial<StyleDesc>;
}

function formatTravelDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TravelCard({ data, style }: TravelCardProps) {
  const a = useAdwaita();
  const { colors } = a;
  return (
    <Card style={style}>
      <Row gap={8} align="center">
        <Icon name="footprints" size={16} color={colors.dim_fg} />
        {data.origin ? (
          <>
            <T weight={600}>{data.origin}</T>
            <T color={colors.dim_fg}>→</T>
          </>
        ) : null}
        <T weight={600}>{data.destination ?? "Trip"}</T>
      </Row>
      {data.duration ? (
        <T size="caption" color={colors.dim_fg}>
          {data.duration}
        </T>
      ) : null}
      {data.start ? (
        <Row gap={6} align="center">
          <Badge variant="secondary">{formatTravelDate(data.start)}</Badge>
          {data.end ? (
            <>
              <T size="caption" color={colors.dim_fg}>
                –
              </T>
              <Badge variant="secondary">{formatTravelDate(data.end)}</Badge>
            </>
          ) : null}
        </Row>
      ) : null}
    </Card>
  );
}
