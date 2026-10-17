import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";

export interface SummaryProps {
  text: ReactNode;
  lines?: number;
  style?: Partial<StyleDesc>;
}

export function Summary({ text, lines = 1, style }: SummaryProps) {
  const t = useAdwaita();
  return (
    <T
      size="body"
      color={t.colors.fg}
      style={{ minWidth: 0, height: lines * t.typography.body * 2, ...style }}
    >
      {text}
    </T>
  );
}
