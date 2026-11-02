import { type StyleDesc } from "@gpuix/react";
import { type ReactNode } from "react";
import { T } from "./text";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { hexToRgba, isDarkScheme, shade } from "../theme/tokens";

export function LabeledControl({
  control,
  label,
  disabled,
  labelPosition = "end",
  style,
}: {
  control: ReactNode;
  label: string;
  disabled?: boolean;
  labelPosition?: "start" | "end";
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const labelText = (
    <T size="body" color={t.color.text.primary}>
      {label}
    </T>
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {labelPosition === "start" ? labelText : null}
      {control}
      {labelPosition === "end" ? labelText : null}
    </div>
  );
}

export function accentFillInteractions(t: AdwaitaTheme, filled: boolean) {
  return {
    hover: {
      backgroundColor: filled
        ? shade(t.color.accent.base, -0.08)
        : t.color.accent.tint,
    },
    active: {
      backgroundColor: filled
        ? shade(t.color.accent.base, -0.18)
        : hexToRgba(t.color.accent.base, isDarkScheme(t.scheme) ? 0.3 : 0.2),
    },
  };
}
