import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Card } from "../Card";
import { ProgressBar } from "../ProgressBar";
import { type Currency } from "./Currency";

export interface ExpenseData {
  
  amount: number | null;
  
  item: string;
  currency: Currency;
  
  date?: string;
  
  budget?: number;
}

export interface ExpenseCardProps {
  data: ExpenseData;
  style?: Partial<StyleDesc>;
}

export function ExpenseCard({ data, style }: ExpenseCardProps) {
  const t = useAdwaita();
  const { colors } = t;
  const budget = data.budget;
  const hasBudget = budget !== undefined && budget > 0;
  const overBudget = hasBudget && data.amount !== null && data.amount > budget;
  const barValue = hasBudget
    ? Math.min(100, Math.round(((data.amount ?? 0) / budget) * 100))
    : 0;
  return (
    <Card style={style}>
      <T size="caption" color={colors.dim_fg}>
        {data.item}
      </T>
      {data.amount !== null ? (
        <T size="title1" weight={700} color={colors.fg}>
          {data.currency}
          {data.amount.toFixed(2)}
        </T>
      ) : (
        <T size="caption" color={colors.dim_fg}>
          no amount
        </T>
      )}
      {hasBudget ? (
        <ProgressBar value={barValue} color={overBudget ? "destructive" : "accent"} />
      ) : null}
      {data.date ? (
        <T size="caption" color={colors.dim_fg}>
          {data.date}
        </T>
      ) : null}
    </Card>
  );
}
