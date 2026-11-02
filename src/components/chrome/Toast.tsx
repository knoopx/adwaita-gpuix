import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { CloseButton } from "../overlay";
import { T } from "../text";
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
  t: AdwaitaTheme,
): ToastTypeTheme {
  switch (type) {
    case "success":
      return { icon: "checkCircle", color: t.color.functional.success };
    case "info":
      return { icon: "info", color: t.color.accent.base };
    case "warning":
      return { icon: "warning", color: t.color.functional.warning };
    case "error":
    case "destructive":
      return { icon: "error", color: t.color.functional.destructive };
    case "loading":
      return { icon: "refresh", color: t.color.accent.base };
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
  const typeTheme = type === "default" ? null : resolveTypeTheme(type, t);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
        padding: t.space.md,
        borderRadius: t.radius.sm,
        borderWidth: 0,
        backgroundColor: t.color.surface.headerbar,
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
          color={t.color.text.primary}
          style={{
            lineHeight: TOAST_LINE_HEIGHT,
            whiteSpace: "normal",
            minWidth: 0,
          }}
        >
          {message}
        </T>
        {body ? (
          <T
            size="caption"
            color={t.color.text.dim}
            style={{
              lineHeight: TOAST_LINE_HEIGHT,
              whiteSpace: "normal",
              minWidth: 0,
            }}
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
