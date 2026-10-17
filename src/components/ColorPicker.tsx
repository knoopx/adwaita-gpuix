import { useState } from "react";
import type { StyleDesc } from "@gpuix/react";
import {
  ACCENTS,
  accentForeground,
  hexToRgba,
  useAdwaita,
  type AccentKey,
} from "../theme/adwaita";
import { Icon } from "./icons";
import { FloatingPanel } from "./common";
import { Input } from "./Input";

export interface ColorPickerProps {
  
  value?: string;
  onChange?: (value: string) => void;
  
  swatchSize?: number;
  
  inputWidth?: number;
  style?: Partial<StyleDesc>;
}

const CELL = 22;
const SWATCHES = Object.entries(ACCENTS) as [AccentKey, string][];

function PaletteRow({
  swatches,
  value,
  onPick,
  colors,
}: {
  swatches: [AccentKey, string][];
  value: string;
  onPick: (hex: string) => void;
  colors: ReturnType<typeof useAdwaita>["colors"];
}) {
  const rows = [swatches.slice(0, 3), swatches.slice(3, 6), swatches.slice(6, 9)];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: CELL * 3 + 6 * 2,
      }}
    >
      {rows.map(
        (row, ri) =>
          row.length > 0 ? (
            <div
              key={ri}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 6,
              }}
            >
              {row.map(([key, hex]) => {
                const active =
                  value.toLowerCase() === hex.toLowerCase();
                return (
                  <div
                    key={key}
                    onClick={() => onPick(hex)}
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 4,
                      borderWidth: active ? 2 : 1,
                      borderColor: active ? colors.fg : colors.border,
                      backgroundColor: hex,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      hover: {
                        boxShadow: {
                          offsetX: 0,
                          offsetY: 0,
                          blurRadius: 6,
                          spreadRadius: 0,
                          color: hexToRgba(colors.fg, 0.35),
                        },
                      },
                    }}
                  >
                    {active ? (
                      <Icon
                        name="success"
                        size={12}
                        color={accentForeground(hex)}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null,
      )}
    </div>
  );
}

export function ColorPicker({
  value,
  onChange,
  swatchSize = 24,
  inputWidth = 96,
  style,
}: ColorPickerProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const [open, setOpen] = useState(false);
  const hex = value ?? "";

  const pick = (next: string) => {
    onChange?.(next);
    setOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        ...style,
      }}
    >
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          width: swatchSize,
          height: swatchSize,
          borderRadius: radii.button,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: hex || "transparent",
          cursor: "pointer",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          hover: {
            boxShadow: {
              offsetX: 0,
              offsetY: 0,
              blurRadius: 6,
              spreadRadius: 0,
              color: hexToRgba(colors.fg, 0.35),
            },
          },
        }}
      >
        {hex ? null : (
          <Icon name="circleDashed" size={12} color={colors.dim_fg} />
        )}
      </div>
      {open ? (
        <FloatingPanel
          side="bottom"
          sideOffset={4}
          padding={8}
          gap={0}
          minWidth={CELL * 3 + 6 * 2 + 16}
        >
          <PaletteRow
            swatches={SWATCHES}
            value={hex}
            onPick={pick}
            colors={colors}
          />
        </FloatingPanel>
      ) : null}
      <Input
        value={hex}
        onChange={(s) => onChange?.(s)}
        placeholder="#000000"
        style={{ width: inputWidth, flexShrink: 0 }}
      />
    </div>
  );
}
