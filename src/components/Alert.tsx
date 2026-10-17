import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import {
  useAdwaita,
  type AdwaitaColors,
  type AdwaitaTheme,
} from "../theme/adwaita";
import { CloseButton, TextPart } from "./common";
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
  colors: AdwaitaColors,
): AlertVariantTheme {
  switch (variant) {
    case "success":
      return {
        bg: colors.successTint,
        accent: colors.success,
        icon: "success",
      };
    case "warning":
      return {
        bg: colors.warningTint,
        accent: colors.warning,
        icon: "warning",
      };
    case "destructive":
      
      return {
        bg: colors.destructiveTint,
        accent: colors.destructive,
        icon: "warning",
      };
    default:
      return { bg: colors.accentTint, accent: colors.accent, icon: "info" };
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
        padding: t.spacing.gap,
        gap: t.spacing.gap,
        iconSize: 16,
        iconTop: 1,
        radius: t.radii.row,
      }
    : {
        padding: t.spacing.paddingTight,
        gap: t.spacing.paddingTight,
        iconSize: 18,
        iconTop: 2,
        radius: t.radii.card,
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
  const theme = resolveVariantTheme(variant, t.colors);
  const m = resolveMetrics(size, t);
  const iconName: IconName | false = icon === false ? false : icon ?? theme.icon;

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
