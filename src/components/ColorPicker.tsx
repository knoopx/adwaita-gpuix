import { useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import {
  ACCENTS,
  type AccentKey,
  accentForeground,
  useAdwaita,
} from "../theme/adwaita";
import { Icon } from "./icons";
import { FloatingPanel } from "./FloatingPanel";
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
}: {
  swatches: [AccentKey, string][];
  value: string;
  onPick: (hex: string) => void;
}) {
  const rows = [
    swatches.slice(0, 3),
    swatches.slice(3, 6),
    swatches.slice(6, 9),
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: CELL * 3 + 6 * 2,
      }}
    >
      {rows.map((row, ri) =>
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
              const active = value.toLowerCase() === hex.toLowerCase();
              return (
                <div
                  key={key}
                  onClick={() => onPick(hex)}
                  style={{
                    width: CELL,
                    height: CELL,
                    borderRadius: 4,
                    borderWidth: 0,
                    backgroundColor: hex,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: active ? 1 : 0.85,
                  }}
                >
                  {active ? (
                    <Icon
                      name="checkCircle"
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
          borderRadius: t.radius.sm,
          borderWidth: 0,
          backgroundColor: hex || t.color.surface.button,
          cursor: "pointer",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hex ? null : (
          <Icon
            name="radioButtonUnchecked"
            size={12}
            color={t.color.text.dim}
          />
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
          <PaletteRow swatches={SWATCHES} value={hex} onPick={pick} />
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
