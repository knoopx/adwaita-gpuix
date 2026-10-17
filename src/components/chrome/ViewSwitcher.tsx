import { Fragment } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba, isDarkScheme } from "../../theme/adwaita";
import { SegmentedOptionCell } from "../common";
import type { IconName } from "../icons";

export interface ViewSwitcherItem {
  id: string;
  icon: IconName;
  label?: string;
  disabled?: boolean;
}

export interface ViewSwitcherProps {
  items: ViewSwitcherItem[];
  value: string;
  onChange: (id: string) => void;

  showLabels?: boolean;
  separators?: boolean;
  style?: Partial<StyleDesc>;
}

export function ViewSwitcher({
  items,
  value,
  onChange,
  showLabels = true,
  separators = true,
  style,
}: ViewSwitcherProps) {
  const t = useAdwaita();
  const { colors, radii, spacing: sp } = t;
  const dark = isDarkScheme(t.scheme);
  const pressTint = hexToRgba(colors.accent, dark ? 0.35 : 0.25);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        padding: 2,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.button_bg,
        ...style,
      }}
    >
      {items.map((item, i) => {
        const selected = item.id === value;
        const disabled = item.disabled === true;
        return (
          <Fragment key={item.id}>
            {separators && i > 0 ? (
              <div
                style={{
                  width: 1,
                  backgroundColor: colors.border,
                  pointerEvents: "none",
                }}
              />
            ) : null}
            <div
              onClick={disabled ? undefined : () => onChange(item.id)}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(event) => {
                if (disabled) return;
                if (event.key === "Enter" || event.key === " ")
                  onChange(item.id);
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: sp.paddingTight,
                paddingRight: sp.paddingTight,
                minHeight: 32,
                minWidth: showLabels ? 56 : 0,
                borderRadius: radii.pill,
                backgroundColor: selected ? colors.accentTint : "transparent",
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "default" : "pointer",
                ...(disabled
                  ? {}
                  : selected
                    ? {
                        hover: { backgroundColor: colors.accentTint },
                        active: { backgroundColor: pressTint },
                      }
                    : {
                        hover: { backgroundColor: colors.button_hover },
                        active: { backgroundColor: colors.button_active },
                      }),
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: showLabels ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: showLabels ? 2 : 0,
                  pointerEvents: "none",
                }}
              >
                <SegmentedOptionCell
                  active={selected}
                  icon={item.icon}
                  iconActiveColor={colors.accent}
                  label={showLabels ? item.label : undefined}
                  labelActiveColor={colors.accent}
                  labelSize="caption"
                />
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
