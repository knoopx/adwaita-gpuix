import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { CloseButton } from "./overlay";
import { TextPart } from "./text";
import { Button } from "./Button";
import { Icon, type IconName } from "./icons";

export type AlertVariant = "default" | "success" | "warning" | "destructive";

export type AlertSize = "sm" | "md";

export interface AlertAction {
  label: string;
  onClick?: () => void;
}

export interface AlertProps {
  variant?: AlertVariant;
  size?: AlertSize;
  icon?: IconName | false;
  action?: AlertAction;
  onDismiss?: () => void;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

interface AlertVariantTheme {
  bg: string;
  accent: string;
  icon: IconName;
}

function resolveVariantTheme(
  variant: AlertVariant,
  t: AdwaitaTheme,
): AlertVariantTheme {
  switch (variant) {
    case "success":
      return {
        bg: t.color.functional.successTint,
        accent: t.color.functional.success,
        icon: "checkCircle",
      };
    case "warning":
      return {
        bg: t.color.functional.warningTint,
        accent: t.color.functional.warning,
        icon: "warning",
      };
    case "destructive":
      return {
        bg: t.color.functional.destructiveTint,
        accent: t.color.functional.destructive,
        icon: "warning",
      };
    default:
      return {
        bg: t.color.accent.tint,
        accent: t.color.accent.base,
        icon: "info",
      };
  }
}

interface AlertMetrics {
  padding: number;
  gap: number;
  iconSize: number;
  iconTop: number;
  radius: number;
}

function resolveMetrics(size: AlertSize, t: AdwaitaTheme): AlertMetrics {
  return size === "sm"
    ? {
        padding: t.space.sm,
        gap: t.space.sm,
        iconSize: 16,
        iconTop: 1,
        radius: t.radius.sm,
      }
    : {
        padding: t.space.md,
        gap: t.space.md,
        iconSize: 18,
        iconTop: 2,
        radius: t.radius.sm,
      };
}

export function Alert({
  variant = "default",
  size = "md",
  icon,
  action,
  onDismiss,
  children,
  style,
}: AlertProps) {
  const t = useAdwaita();
  const theme = resolveVariantTheme(variant, t);
  const m = resolveMetrics(size, t);
  const iconName: IconName | false =
    icon === false ? false : (icon ?? theme.icon);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: m.gap,
        padding: m.padding,
        borderRadius: m.radius,
        backgroundColor: theme.bg,
        borderLeftWidth: 3,
        borderColor: theme.accent,
        ...style,
      }}
    >
      {iconName !== false ? (
        <Icon
          name={iconName}
          size={m.iconSize}
          color={theme.accent}
          style={{
            marginTop: m.iconTop,
            flexShrink: 0,
            pointerEvents: "none",
          }}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        {children}
      </div>
      {action ? (
        <Button
          size="sm"
          label={action.label}
          onClick={action.onClick}
          style={{ flexShrink: 0, marginTop: 2 }}
        />
      ) : null}
      {onDismiss ? (
        <CloseButton
          onClick={onDismiss}
          style={{ flexShrink: 0, marginTop: 2 }}
        />
      ) : null}
    </div>
  );
}

export interface AlertTitleProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function AlertTitle({ children, style }: AlertTitleProps) {
  return (
    <TextPart size="title4" weight={700} style={style}>
      {children}
    </TextPart>
  );
}

export interface AlertDescriptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function AlertDescription({ children, style }: AlertDescriptionProps) {
  return (
    <TextPart dim style={style}>
      {children}
    </TextPart>
  );
}
