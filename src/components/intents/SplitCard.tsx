import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Card } from "../Card";
import { Icon } from "../icons";
import { Badge } from "../Badge";
import { Row } from "../Box";
import { type Currency } from "./Currency";

export interface SplitData {
  title?: string;
  total: number | null;
  people: number | null;
  currency: Currency;
}

export interface SplitCardProps {
  data: SplitData;
  style?: Partial<StyleDesc>;
}

function perPerson(total: number, people: number, currency: Currency): string {
  return `${currency}${(total / people).toFixed(2)}`;
}

export function SplitCard({ data, style }: SplitCardProps) {
  const t = useAdwaita();
  const { colors } = t;
  const c = data.currency;
  return (
    <Card style={style}>
      <Row gap={8} align="center">
        <Icon name="layers" size={16} color={colors.accent} />
        <T size="body" weight={600} color={colors.fg}>
          {data.title || "Split"}
        </T>
      </Row>
      <Row gap={8} align="center">
        <T size="title4" weight={700} color={colors.fg}>
          {data.total !== null ? `${c}${data.total.toFixed(2)}` : "—"}
        </T>
        {data.people !== null ? (
          <Badge variant="secondary">{data.people} people</Badge>
        ) : null}
      </Row>
      {data.total !== null && data.people !== null && data.people > 0 ? (
        <T size="caption" color={colors.dim_fg}>
          {perPerson(data.total, data.people, c)} each
        </T>
      ) : null}
    </Card>
  );
}
