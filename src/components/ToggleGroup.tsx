import { Fragment } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba, isDarkScheme } from "../theme/adwaita";
import { SegmentedOptionCell } from "./common";
import type { IconName } from "./icons";

export interface ToggleOption {
  id: string;
  label?: string;
  icon?: IconName;
  disabled?: boolean;
}

export type ToggleGroupVariant = "default" | "outline";
export type ToggleGroupSize = "sm" | "default" | "lg";
export type ToggleGroupDirection = "horizontal" | "vertical";

interface ToggleGroupBaseProps {
  options: ToggleOption[];

  direction?: ToggleGroupDirection;

  
  spacing?: number;

  variant?: ToggleGroupVariant;

  size?: ToggleGroupSize;
  style?: Partial<StyleDesc>;
}

export type ToggleGroupProps =
  | (ToggleGroupBaseProps & {
      multiple?: false;
      value: string;
      onChange: (id: string) => void;
    })
  | (ToggleGroupBaseProps & {
      multiple: true;
      value: string[];
      onChange: (ids: string[]) => void;
    });

const SEG_MIN_HEIGHT: Record<ToggleGroupSize, number> = {
  sm: 24,
  default: 28,
  lg: 36,
};

export function ToggleGroup(props: ToggleGroupProps) {
  const t = useAdwaita();
  const { colors, radii, spacing: sp } = t;
  const {
    options,
    direction = "horizontal",
    spacing = 0,
    variant = "default",
    size = "default",
    style,
  } = props;
  const vertical = direction === "vertical";
  const itemRadius = vertical ? radii.button : radii.pill;
  const outline = variant === "outline";
  const dark = isDarkScheme(t.scheme);
  const minHeight = SEG_MIN_HEIGHT[size];

  const active: string[] =
    props.multiple === true ? props.value : props.value ? [props.value] : [];

  const toggle = (id: string) => {
    if (props.multiple === true) {
      const next = active.includes(id)
        ? active.filter((x) => x !== id)
        : [...active, id];
      props.onChange(next);
    } else {
      props.onChange(id);
    }
  };

  const separator = vertical ? (
    <div
      style={{
        height: 1,
        backgroundColor: colors.border,
        pointerEvents: "none",
      }}
    />
  ) : (
    <div
      style={{
        width: 1,
        backgroundColor: colors.border,
        pointerEvents: "none",
      }}
    />
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        alignItems: "stretch",
        gap: spacing,
        padding: 2,
        borderRadius: itemRadius,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: outline ? "transparent" : colors.button_bg,
        ...style,
      }}
    >
      {options.map((opt, i) => {
        const isActive = active.includes(opt.id);
        const disabled = opt.disabled === true;
        return (
          <Fragment key={opt.id}>
            {i > 0 && spacing === 0 ? separator : null}
            <div
              onClick={disabled ? undefined : () => toggle(opt.id)}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(event) => {
                if (disabled) return;
                if (event.key === "Enter" || event.key === " ") toggle(opt.id);
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                minHeight,
                paddingLeft: sp.paddingTight,
                paddingRight: sp.paddingTight,
                borderRadius: itemRadius,
                backgroundColor: isActive ? colors.accentTint : "transparent",
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "default" : "pointer",
                ...(disabled
                  ? {}
                  : isActive
                    ? {
                        hover: { backgroundColor: colors.accentTint },
                        active: {
                          backgroundColor: hexToRgba(
                            colors.accent,
                            dark ? 0.35 : 0.25,
                          ),
                        },
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
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  pointerEvents: "none",
                }}
              >
                <SegmentedOptionCell
                  active={isActive}
                  icon={opt.icon}
                  label={opt.label}
                  iconActiveColor={colors.accent}
                  labelActiveColor={colors.accent}
                />
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
