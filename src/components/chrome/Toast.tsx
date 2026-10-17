import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, type AdwaitaColors } from "../../theme/adwaita";
import { CloseButton, T } from "../common";
import { Button } from "../Button";
import { Icon, type IconName } from "../icons";

export type ToastType =
  | "default"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "destructive"
  | "loading";

interface ToastTypeTheme {
  icon: IconName;
  color: string;
}

function resolveTypeTheme(
  type: Exclude<ToastType, "default">,
  colors: AdwaitaColors,
): ToastTypeTheme {
  switch (type) {
    case "success":
      return { icon: "success", color: colors.success };
    case "info":
      return { icon: "info", color: colors.accent };
    case "warning":
      return { icon: "warning", color: colors.warning };
    case "error":
    case "destructive":
      return { icon: "alert", color: colors.destructive };
    case "loading":
      return { icon: "refresh", color: colors.accent };
  }
}

const TOAST_LINE_HEIGHT = 16;

export interface ToastProps {
  message: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;

  type?: ToastType;

  onDismiss?: () => void;
  style?: Partial<StyleDesc>;
}

export function Toast({
  message,
  body,
  actionLabel,
  onAction,
  type = "default",
  onDismiss,
  style,
}: ToastProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const typeTheme = type === "default" ? null : resolveTypeTheme(type, colors);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.gap,
        padding: spacing.paddingTight,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.headerbar_bg,
        ...style,
      }}
    >
      {typeTheme ? (
        <Icon name={typeTheme.icon} size={14} color={typeTheme.color} />
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexShrink: 1,
          minWidth: 0,
        }}
      >
        <T
          size="body"
          color={colors.fg}
          style={{ lineHeight: TOAST_LINE_HEIGHT, whiteSpace: "normal", minWidth: 0 }}
        >
          {message}
        </T>
        {body ? (
          <T
            size="caption"
            color={colors.dim_fg}
            style={{ lineHeight: TOAST_LINE_HEIGHT, whiteSpace: "normal", minWidth: 0 }}
          >
            {body}
          </T>
        ) : null}
      </div>
      {actionLabel ? (
        <Button
          variant="pill"
          size="sm"
          label={actionLabel}
          onClick={onAction}
          style={{ flexShrink: 0 }}
        />
      ) : null}
      {onDismiss ? (
        <CloseButton onClick={onDismiss} style={{ flexShrink: 0 }} />
      ) : null}
    </div>
  );
}
