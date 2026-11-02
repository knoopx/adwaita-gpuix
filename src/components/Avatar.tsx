import { Children, type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { Icon, type IconName } from "./icons";

export interface AvatarProps {
  name: string;
  size?: number;
  src?: string;

  icon?: IconName;

  ring?: boolean;

  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.slice(0, 2).map((w) => w[0]);
  return letters.join("").toUpperCase();
}

export function Avatar({
  name,
  size = 32,
  src,
  icon,
  ring,
  disabled,
  style,
}: AvatarProps) {
  const t = useAdwaita();
  const hasName = name.trim().length > 0;
  const ringStyle = ring
    ? { borderWidth: 1, borderColor: t.color.border.default }
    : {};
  const opacity = disabled ? 0.5 : 1;
  if (src) {
    return (
      <img
        src={src}
        objectFit="cover"
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          flexShrink: 0,
          ...ringStyle,
          opacity,
          ...style,
        }}
      />
    );
  }
  const content = icon ? (
    <Icon
      name={icon}
      size={Math.max(12, Math.round(size * 0.5))}
      color={hasName ? t.color.accent.base : t.color.text.dim}
    />
  ) : hasName ? (
    <T
      weight={700}
      color={t.color.accent.base}
      style={{ fontSize: Math.max(10, Math.round(size * 0.4)) }}
    >
      {initials(name)}
    </T>
  ) : (
    <Icon
      name="person"
      size={Math.max(12, Math.round(size * 0.5))}
      color={t.color.text.dim}
    />
  );
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: hasName ? t.color.accent.tint : t.color.surface.button,
        flexShrink: 0,
        ...ringStyle,
        opacity,
        ...style,
      }}
    >
      {content}
    </div>
  );
}

export interface AvatarBadgeProps {
  children?: ReactNode;

  size?: number;

  color?: string;

  ringColor?: string;
  style?: Partial<StyleDesc>;
}

export function AvatarBadge({
  children,
  size = 12,
  color,
  ringColor,
  style,
}: AvatarBadgeProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: ringColor ?? t.color.surface.view,
        backgroundColor: color ?? t.color.accent.base,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface AvatarGroupProps {
  children: ReactNode;

  size?: number;

  overlap?: number;
  style?: Partial<StyleDesc>;
}

export function AvatarGroup({
  children,
  size = 32,
  overlap = 8,
  style,
}: AvatarGroupProps) {
  const kids = Children.toArray(children);

  const ordered = [...kids].reverse();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        minHeight: size,
        ...style,
      }}
    >
      {ordered.map((child, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            flexShrink: 0,
            marginRight: i === ordered.length - 1 ? 0 : -overlap,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export interface AvatarGroupCountProps {
  count: number;

  size?: number;
  style?: Partial<StyleDesc>;
}

export function AvatarGroupCount({
  count,
  size = 32,
  style,
}: AvatarGroupCountProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: t.color.surface.button,
        borderWidth: 1,
        borderColor: t.color.border.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      <T
        size="caption"
        color={t.color.text.dim}
        style={{ fontSize: Math.max(10, Math.round(size * 0.35)) }}
      >
        {`+${count}`}
      </T>
    </div>
  );
}
