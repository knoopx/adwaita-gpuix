import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Card } from "../Card";
import { Icon } from "../icons";
import { Row } from "../Box";
import { TintedPill } from "./TintedPill";

export interface NoteData {
  title: string;
  body: string;
  tag?: string | null;
}

export interface NoteCardProps {
  data: NoteData;
  style?: Partial<StyleDesc>;
}

export function NoteCard({ data, style }: NoteCardProps) {
  const a = useAdwaita();
  const { colors } = a;
  return (
    <Card style={style}>
      <Row gap={8} align="center" justify="space-between">
        <Row gap={8} align="center" style={{ flexGrow: 1, minWidth: 0 }}>
          <Icon name="fileText" size={16} color={colors.accent} />
          <T weight={600} style={{ minWidth: 0 }}>
            {data.title || "Note"}
          </T>
        </Row>
        {data.tag ? (
          <TintedPill>
            <T size="caption" weight={600} color={colors.accent}>
              {data.tag}
            </T>
          </TintedPill>
        ) : null}
      </Row>
      {data.body ? (
        <T size="caption" color={colors.dim_fg} clamp={4}>
          {data.body}
        </T>
      ) : null}
    </Card>
  );
}
