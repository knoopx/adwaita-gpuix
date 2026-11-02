import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";

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
      color={t.color.text.primary}
      style={{ minWidth: 0, height: lines * t.type.body * 2, ...style }}
    >
      {text}
    </T>
  );
}
