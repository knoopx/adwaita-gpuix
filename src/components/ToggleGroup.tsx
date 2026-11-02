import { Fragment } from "react";
import { type StyleDesc } from "@gpuix/react";
import { hexToRgba, isDarkScheme, useAdwaita } from "../theme/adwaita";
import { Icon, type IconName } from "./icons";
import { T, type TextSize } from "./text";
import { isActivateKey } from "../lib/roving";

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

export function ToggleGroup(props: ToggleGroupProps) {
  const t = useAdwaita();
  const {
    options,
    direction = "horizontal",
    spacing = 0,
    variant = "default",
    size = "default",
    style,
  } = props;
  const vertical = direction === "vertical";
  const outline = variant === "outline";
  const segmentHeight: Record<ToggleGroupSize, number> = {
    sm: t.control.toggleSegmentHeightSm,
    default: t.control.viewSwitcherHeight - t.control.toggleGroupPadding * 2,
    lg: t.control.toggleSegmentHeightLg,
  };
  const minHeight = segmentHeight[size];

  const checkedBg = t.color.surface.raised;
  const hoverBg = t.color.surface.hover;

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
        backgroundColor: t.color.border.default,
        pointerEvents: "none",
      }}
    />
  ) : (
    <div
      style={{
        width: 1,
        backgroundColor: t.color.border.default,
        pointerEvents: "none",
      }}
    />
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        padding: t.control.toggleGroupPadding,
        minHeight: t.control.viewSwitcherHeight,
        borderRadius: t.radius.sm,
        borderWidth: 0,
        backgroundColor: t.color.surface.input,
        flexDirection: vertical ? "column" : "row",
        gap: spacing,
        ...(outline ? { backgroundColor: "transparent" } : {}),
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
                if (isActivateKey(event.key, { space: true })) toggle(opt.id);
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: t.control.toggleSegmentPaddingX,
                paddingRight: t.control.toggleSegmentPaddingX,
                borderRadius: Math.max(
                  2,
                  t.radius.sm - t.control.toggleGroupPadding,
                ),
                gap: 6,
                minHeight,
                backgroundColor: isActive ? checkedBg : "transparent",
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "default" : "pointer",
                ...(disabled
                  ? {}
                  : isActive
                    ? {
                        hover: { backgroundColor: checkedBg },
                        active: {
                          backgroundColor: t.color.surface.buttonActive,
                        },
                      }
                    : {
                        hover: { backgroundColor: hoverBg },
                        active: {
                          backgroundColor: t.color.surface.buttonActive,
                        },
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
                  iconActiveColor={t.color.text.primary}
                  labelActiveColor={t.color.text.primary}
                />
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export interface SegmentedOptionCellProps {
  active: boolean;
  icon?: IconName;
  iconSize?: number;
  iconActiveColor?: string;
  label?: string;
  labelActiveColor?: string;
  labelSize?: TextSize;
  style?: Partial<StyleDesc>;
}

export function SegmentedOptionCell({
  active,
  icon,
  iconSize = 16,
  iconActiveColor,
  label,
  labelActiveColor,
  labelSize = "body",
  style,
}: SegmentedOptionCellProps) {
  const t = useAdwaita();
  const fg = t.color.text.primary;
  return (
    <>
      {icon ? (
        <Icon
          name={icon}
          size={iconSize}
          color={active ? (iconActiveColor ?? fg) : fg}
        />
      ) : null}
      {label ? (
        <T
          size={labelSize}
          weight={active ? 600 : 400}
          color={active ? (labelActiveColor ?? fg) : fg}
          style={style}
        >
          {label}
        </T>
      ) : null}
    </>
  );
}
