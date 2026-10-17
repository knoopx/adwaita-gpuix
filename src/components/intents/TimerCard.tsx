import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Icon } from "../icons";
import { Card } from "../Card";
import { ProgressBar } from "../ProgressBar";
import { Row } from "../Box";

export interface TimerData {
  
  seconds: number | null;
  label: string;
  
  totalSeconds?: number;
}

export interface TimerCardProps {
  data: TimerData;
  style?: Partial<StyleDesc>;
}

function formatSeconds(total: number): string {
  const s = Math.max(0, Math.round(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export function TimerCard({ data, style }: TimerCardProps) {
  const a = useAdwaita();
  const { colors } = a;
  const finished = data.seconds === 0;
  const hasTotal = data.totalSeconds !== undefined && data.totalSeconds > 0;
  const elapsed =
    hasTotal && data.seconds !== null
      ? Math.min(1, Math.max(0, 1 - data.seconds / (data.totalSeconds as number)))
      : 0;
  const dim = finished || data.seconds === null;
  return (
    <Card style={style}>
      <Row gap={8} align="center">
        <Icon
          name="timer"
          size={16}
          color={dim ? colors.dim_fg : colors.accent}
        />
        <T weight={600} color={colors.dim_fg}>
          {data.label || "Timer"}
        </T>
      </Row>
      {data.seconds !== null ? (
        <T size="title1" weight={700} color={dim ? colors.dim_fg : colors.fg}>
          {formatSeconds(data.seconds)}
        </T>
      ) : (
        <T size="caption" color={colors.dim_fg}>
          no duration set
        </T>
      )}
      {hasTotal ? <ProgressBar value={elapsed * 100} /> : null}
    </Card>
  );
}
