import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { disabledStyle } from "./disabled.ts";
import { selectTriggerStyle } from "./Select";
import { listPanelStyle } from "./FloatingPanel";
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

function flattenOptions(
  options: NativeSelectOption[],
  groups?: NativeSelectGroup[],
): NativeSelectOption[] {
  return groups ? groups.flatMap((group) => group.options) : options;
}

function GroupHeader({ label }: { label: string }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: 8,
        paddingBottom: 4,
      }}
    >
      <T size="caption" color={t.color.text.dim}>
        {label}
      </T>
    </div>
  );
}

function OptionRow({
  option,
  selected,
  onPick,
}: {
  option: NativeSelectOption;
  selected: boolean;
  onPick: (value: string) => void;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={() => onPick(option.value)}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        height: 36,
        padding: 8,
        borderRadius: t.radius.sm,
        cursor: "pointer",
        backgroundColor: selected ? t.color.accent.tint : "transparent",
        hover: { backgroundColor: t.color.accent.tint },
      }}
    >
      {selected ? (
        <Icon
          name="checkCircle"
          size={14}
          color={t.color.accent.base}
          style={{ flexShrink: 0, pointerEvents: "none" }}
        />
      ) : null}
      <T size="body" color={t.color.text.primary} style={{ flexGrow: 1 }}>
        {option.label}
      </T>
    </div>
  );
}

function optionRows(
  options: NativeSelectOption[],
  value: string,
  onPick: (value: string) => void,
): ReactNode[] {
  return options.map((option) => (
    <OptionRow
      key={option.value}
      option={option}
      selected={option.value === value}
      onPick={onPick}
    />
  ));
}

function groupedRows(
  groups: NativeSelectGroup[],
  value: string,
  onPick: (value: string) => void,
): ReactNode[] {
  return groups.flatMap((group) => [
    <GroupHeader key={`group-${group.label}`} label={group.label} />,
    ...optionRows(group.options, value, onPick),
  ]);
}

function triggerStyle(
  t: AdwaitaTheme,
  args: { open: boolean; disabled?: boolean },
): Partial<StyleDesc> {
  return selectTriggerStyle(t, {
    ...disabledStyle(args.disabled, {
      hover: { backgroundColor: t.color.surface.button },
      active: { backgroundColor: t.color.surface.buttonActive },
    }),
    borderColor:
      args.open && !args.disabled
        ? t.color.accent.base
        : t.color.border.default,
  });
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
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    false,
    onOpenChange,
  );

  const selected = flattenOptions(options, groups).find(
    (option) => option.value === value,
  );

  const onPick = (next: string) => {
    onChange?.(next);
    setOpen(false);
  };

  const rows = groups
    ? groupedRows(groups, value, onPick)
    : optionRows(options, value, onPick);

  return (
    <div style={style}>
      <div
        onClick={disabled ? undefined : () => setOpen(!isOpen)}
        style={triggerStyle(t, { open: isOpen, disabled })}
      >
        <T
          size="body"
          color={selected ? t.color.text.primary : t.color.text.dim}
        >
          {selected?.label ?? placeholder ?? "Select…"}
        </T>
        <Icon name="expandMore" size={14} color={t.color.text.dim} />
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
