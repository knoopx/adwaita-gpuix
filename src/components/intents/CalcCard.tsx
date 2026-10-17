import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, shade, type AdwaitaTheme } from "../../theme/adwaita";
import { T } from "../common";
import { Icon } from "../icons";
import { Row, Column } from "../Box";

export interface CalcData {
  expression: string;
  result: number | null;
}

export interface CalcCardProps {
  data: CalcData;
  style?: Partial<StyleDesc>;
}

interface CalcKey {
  label: string;
  operator?: boolean;
}


const KEYS: CalcKey[] = [
  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "÷", operator: true },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "×", operator: true },
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "−", operator: true },
  { label: "0" },
  { label: "." },
  { label: "=", operator: true },
  { label: "+", operator: true },
];

function keyStyle(t: AdwaitaTheme, operator: boolean): Partial<StyleDesc> {
  const { colors, radii } = t;
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 34,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: operator ? colors.accentTint : colors.button_bg,
    cursor: "pointer",
    hover: {
      backgroundColor: operator
        ? shade(colors.accent, -0.08)
        : colors.button_hover,
    },
    active: {
      backgroundColor: operator
        ? shade(colors.accent, -0.18)
        : colors.button_active,
    },
  };
}

export function CalcCard({ data, style }: CalcCardProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const evaluated = data.result !== null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.gap,
        padding: spacing.padding,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        ...style,
      }}
    >
      <Row gap={spacing.gap} align="center">
        <Icon name="grid" size={16} color={colors.accent} />
        <T weight={600}>{data.expression}</T>
      </Row>
      <T
        size="title1"
        weight={700}
        align="right"
        color={evaluated ? colors.fg : colors.dim_fg}
      >
        {data.result !== null
          ? `= ${Math.round(data.result * 1e10) / 1e10}`
          : "unable to evaluate"}
      </T>
      <Column gap={spacing.gap}>
        {[0, 1, 2, 3].map((row) => (
          <Row key={row} gap={spacing.gap}>
            {KEYS.slice(row * 4, row * 4 + 4).map((key) => (
              <div key={key.label} style={keyStyle(t, key.operator ?? false)}>
                <T
                  size="body"
                  weight={600}
                  color={key.operator ? colors.accent : colors.fg}
                >
                  {key.label}
                </T>
              </div>
            ))}
          </Row>
        ))}
      </Column>
    </div>
  );
}
