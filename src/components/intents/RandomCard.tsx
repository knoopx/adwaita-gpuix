import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { ToolCard } from "./ToolCard";

export type RandomKind = "dice" | "coin" | "number" | "pick";

export type RandomData =
  | { kind: "dice"; count: number; sides: number }
  | { kind: "coin" }
  | { kind: "number"; min: number; max: number }
  | { kind: "pick"; options: string[] };

export interface RandomCardProps {
  data: RandomData;
  
  result?: ReactNode;
  style?: Partial<StyleDesc>;
}

function randomSummary(data: RandomData): string {
  switch (data.kind) {
    case "dice":
      return `${data.count}d${data.sides}`;
    case "coin":
      return "heads or tails";
    case "number":
      return `between ${data.min} and ${data.max}`;
    case "pick":
      return data.options.join(" / ");
  }
}

export function RandomCard({ data, result, style }: RandomCardProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <ToolCard icon="sparkles" title={`Random ${data.kind}`} style={style}>
      <T size="caption" color={colors.dim_fg}>
        {randomSummary(data)}
      </T>
      {result !== undefined ? (
        <T size="title1" weight={700} color={colors.fg}>
          {result}
        </T>
      ) : null}
    </ToolCard>
  );
}
