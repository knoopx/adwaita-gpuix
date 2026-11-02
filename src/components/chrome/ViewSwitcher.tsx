import { type StyleDesc } from "@gpuix/react";
import { hexToRgba, isDarkScheme, useAdwaita } from "../../theme/adwaita";
import { SegmentedOptionCell } from "../ToggleGroup";
import { type IconName } from "../icons";
import { isActivateKey } from "../../lib/roving";

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
  style?: Partial<StyleDesc>;
}

export function ViewSwitcher({
  items,
  value,
  onChange,
  style,
}: ViewSwitcherProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        padding: t.control.viewSwitcherPadding,
        borderRadius: t.radius.full,

        backgroundColor: t.color.surface.button,
        ...style,
      }}
    >
      {items.map((item) => {
        const selected = item.id === value;
        const disabled = item.disabled === true;
        return (
          <div
            key={item.id}
            onClick={disabled ? undefined : () => onChange(item.id)}
            tabIndex={disabled ? -1 : 0}
            role="tab"
            aria-label={item.label ?? item.id}
            aria-selected={selected}
            onKeyDown={(event) => {
              if (disabled) return;
              if (isActivateKey(event.key, { space: true })) onChange(item.id);
            }}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              minHeight: t.control.viewSwitcherHeight,
              width:
                item.label === undefined
                  ? t.control.viewSwitcherHeight +
                    t.control.viewSwitcherPadding * 2
                  : undefined,
              paddingLeft:
                item.label === undefined ? 0 : t.control.viewSwitcherPaddingX,
              paddingRight:
                item.label === undefined ? 0 : t.control.viewSwitcherPaddingX,
              borderRadius: t.radius.full,
              backgroundColor: selected ? t.color.accent.tint : "transparent",
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "default" : "pointer",
              ...(disabled
                ? {}
                : selected
                  ? {
                      hover: { backgroundColor: t.color.accent.tint },
                      active: {
                        backgroundColor: t.color.surface.active,
                      },
                    }
                  : {
                      hover: { backgroundColor: t.color.surface.buttonHover },
                      active: { backgroundColor: t.color.surface.buttonActive },
                    }),
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: t.space.sm,
                pointerEvents: "none",
              }}
            >
              <SegmentedOptionCell
                active={selected}
                icon={item.icon}
                label={item.label}
                iconActiveColor={t.color.accent.base}
                labelActiveColor={t.color.accent.base}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
