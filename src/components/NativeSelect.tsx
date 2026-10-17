import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T, selectTriggerStyle, listPanelStyle } from "./common";
import { useControllableOpen } from "./Collapsible";
import { Icon } from "./icons";

export interface NativeSelectOption {
  value: string;
  label: string;
}

export interface NativeSelectGroup {
  label: string;
  options: NativeSelectOption[];
}

export interface NativeSelectProps {
  value: string;
  options: NativeSelectOption[];

  groups?: NativeSelectGroup[];
  onChange?: (value: string) => void;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  disabled?: boolean;

  placeholder?: string;

  style?: Partial<StyleDesc>;
}

export function NativeSelect({
  value,
  options,
  groups,
  onChange,
  open,
  onOpenChange,
  disabled,
  placeholder,
  style,
}: NativeSelectProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    false,
    onOpenChange,
  );

  const allOptions = groups ? groups.flatMap((g) => g.options) : options;
  const selected = allOptions.find((o) => o.value === value);

  const optionRow = (option: NativeSelectOption): ReactNode => {
    const isSelected = option.value === value;
    return (
      <div
        key={option.value}
        onClick={() => {
          onChange?.(option.value);
          setOpen(false);
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          height: 36,
          padding: 8,
          borderRadius: radii.row,
          cursor: "pointer",
          backgroundColor: isSelected ? colors.accentTint : "transparent",
          hover: { backgroundColor: colors.accentTint },
        }}
      >
        {isSelected ? (
          <Icon
            name="success"
            size={14}
            color={colors.accent}
            style={{ flexShrink: 0, pointerEvents: "none" }}
          />
        ) : null}
        <T size="body" color={colors.fg} style={{ flexGrow: 1 }}>
          {option.label}
        </T>
      </div>
    );
  };

  const groupHeader = (label: string): ReactNode => (
    <div
      key={"group-" + label}
      style={{
        display: "flex",
        alignItems: "center",
        padding: 8,
        paddingBottom: 4,
      }}
    >
      <T size="caption" color={colors.dim_fg}>
        {label}
      </T>
    </div>
  );

  const rows: ReactNode[] = [];
  if (groups) {
    for (const g of groups) {
      rows.push(groupHeader(g.label));
      for (const o of g.options) rows.push(optionRow(o));
    }
  } else {
    for (const o of options) rows.push(optionRow(o));
  }

  return (
    <div style={style}>
      <div
        onClick={disabled ? undefined : () => setOpen(!isOpen)}
        style={selectTriggerStyle(t, {
          borderColor: isOpen && !disabled ? colors.accent : colors.border,
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.5 : 1,
          hover: disabled ? undefined : { backgroundColor: colors.button_bg },
          active: disabled
            ? undefined
            : { backgroundColor: colors.button_active },
        })}
      >
        <T size="body" color={selected ? colors.fg : colors.dim_fg}>
          {selected?.label ?? (placeholder ?? "Select…")}
        </T>
        <Icon name="chevronDown" size={14} color={colors.dim_fg} />
      </div>

      {isOpen && !disabled ? (
        <anchored side="bottom" offset={{ x: 0, y: 4 }}>
          <div
            style={listPanelStyle(t, {
              display: "flex",
              flexDirection: "column",
              padding: 4,
            })}
          >
            <virtual-list
              estimatedItemHeight={36}
              style={{ maxHeight: 200, width: "100%" }}
            >
              {rows}
            </virtual-list>
          </div>
        </anchored>
      ) : null}
    </div>
  );
}
