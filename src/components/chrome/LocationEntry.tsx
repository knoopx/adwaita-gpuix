import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon, type IconName } from "../icons";

export interface LocationEntryProps {
  icon?: IconName;

  label: string;

  trailingIcon?: IconName;
  onActivate?: () => void;
  style?: Partial<StyleDesc>;
}

export function LocationEntry({
  icon,
  label,
  trailingIcon,
  onActivate,
  style,
}: LocationEntryProps) {
  const t = useAdwaita();

  return (
    <div
      onClick={onActivate}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
        flexGrow: 1,
        flexShrink: 1,
        minWidth: t.control.locationEntryMinWidth,
        height: t.control.locationEntryHeight,
        paddingLeft: t.space.md,
        paddingRight: t.space.sm,
        borderRadius: t.radius.full,
        backgroundColor: t.color.surface.sidebar,
        cursor: onActivate ? "pointer" : "default",
        hover: { backgroundColor: t.color.surface.buttonActive },
        ...style,
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={t.control.navIconSize}
          color={t.color.text.dim}
        />
      ) : null}
      <T
        size="body"
        weight={500}
        color={t.color.text.primary}
        style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", minWidth: 0 }}
      >
        {label}
      </T>
      <div style={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }} />
      {trailingIcon ? (
        <Icon
          name={trailingIcon}
          size={t.control.navIconSize}
          color={t.color.text.dim}
        />
      ) : null}
    </div>
  );
}
