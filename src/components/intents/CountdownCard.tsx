import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Icon } from "../icons";
import { Card } from "../Card";
import { ProgressBar, type ProgressBarColor } from "../ProgressBar";
import { Row } from "../Box";

export type CountdownTone = "default" | "warning" | "expired";

export interface CountdownData {
  title: string;
  
  remaining: string;
  
  progress: number;
  
  date?: string | null;
  
  tone?: CountdownTone;
}

export interface CountdownCardProps {
  data: CountdownData;
  style?: Partial<StyleDesc>;
}

const TONE_BAR_COLOR: Record<CountdownTone, ProgressBarColor> = {
  default: "accent",
  warning: "warning",
  expired: "destructive",
};

function formatCountdownDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CountdownCard({ data, style }: CountdownCardProps) {
  const a = useAdwaita();
  const { colors } = a;
  const tone = data.tone ?? "default";
  const expired = tone === "expired";
  const fill = Math.min(100, Math.max(0, Math.round(data.progress * 100)));
  return (
    <Card style={style}>
      <Row gap={8} align="center">
        <Icon
          name="clock"
          size={16}
          color={expired ? colors.dim_fg : colors.accent}
        />
        <T weight={600} color={expired ? colors.dim_fg : colors.fg}>
          {data.title || "Countdown"}
        </T>
      </Row>
      <T size="title1" weight={700} color={expired ? colors.dim_fg : colors.fg}>
        {data.remaining}
      </T>
      <ProgressBar value={expired ? 100 : fill} color={TONE_BAR_COLOR[tone]} />
      {data.date ? (
        <T size="caption" color={colors.dim_fg}>
          {formatCountdownDate(data.date)}
        </T>
      ) : null}
    </Card>
  );
}
