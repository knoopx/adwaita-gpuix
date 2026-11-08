import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { type Tone, toneColor, toneFill } from "../../theme/tones";
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

/**
 * A type is wear, not a badge: the tone fills the toast and its base colour
 * draws the glyph. A toast floats over content, so the fill is the tone baked
 * into the surface rather than the translucent `*Tint` an inline `Alert` wears.
 */
interface ToastTypeTheme {
  icon: IconName;
  tone: Tone;
}

function resolveTypeTheme(type: Exclude<ToastType, "default">): ToastTypeTheme {
  switch (type) {
    case "success":
      return { icon: "checkCircle", tone: "success" };
    case "info":
      return { icon: "info", tone: "accent" };
    case "warning":
      return { icon: "warning", tone: "warning" };
    case "error":
    case "destructive":
      return { icon: "error", tone: "destructive" };
    case "loading":
      return { icon: "refresh", tone: "accent" };
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
  const typeTheme = type === "default" ? null : resolveTypeTheme(type);
  const surface = t.color.surface.headerbar;
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
        // An untyped toast is a plain surface; a typed one wears its type.
        backgroundColor: typeTheme
          ? toneFill(t, typeTheme.tone, surface)
          : surface,
        ...style,
      }}
    >
      {typeTheme ? (
        <Icon
          name={typeTheme.icon}
          size={14}
          color={toneColor(t, typeTheme.tone)}
        />
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
