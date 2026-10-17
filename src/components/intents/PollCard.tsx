import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Card } from "../Card";
import { Icon } from "../icons";
import { ProgressBar } from "../ProgressBar";
import { Row, Column } from "../Box";

export interface PollOption {
  label: string;
  votes: number;
}

export interface PollData {
  title: string;
  options: PollOption[];
}

export interface PollCardProps {
  data: PollData;
  style?: Partial<StyleDesc>;
}

export function PollCard({ data, style }: PollCardProps) {
  const t = useAdwaita();
  const { colors } = t;
  const totalVotes = data.options.reduce(
    (sum, option) => sum + Math.max(0, option.votes),
    0,
  );
  const hasVotes = totalVotes > 0;
  return (
    <Card style={style}>
      <Row gap={8} align="center">
        <Icon name="listOrdered" size={16} color={colors.accent} />
        <T size="body" weight={600} color={colors.fg}>
          {data.title || "Poll"}
        </T>
      </Row>
      <Column gap={8}>
        {data.options.map((option) => {
          const votes = Math.max(0, option.votes);
          const pct = hasVotes ? Math.round((votes / totalVotes) * 100) : 0;
          return (
            <Column key={option.label} gap={2}>
              <Row gap={8} align="center" justify="space-between">
                <T size="body" color={colors.fg}>
                  {option.label}
                </T>
                <T size="caption" color={colors.dim_fg}>
                  {hasVotes
                    ? `${pct}% · ${votes} votes`
                    : "no votes"}
                </T>
              </Row>
              <ProgressBar value={pct} color="accent" />
            </Column>
          );
        })}
      </Column>
    </Card>
  );
}
