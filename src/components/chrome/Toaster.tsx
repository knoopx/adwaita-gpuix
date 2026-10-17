import { useCallback, useRef, useState } from "react";
import { useWindowSize, type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { Toast, type ToastType } from "./Toast";

export interface ToastItem {
  message: string;
  id?: string;
  type?: ToastType;

  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ToastOptions {
  type?: ToastType;

  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, opts: ToastOptions = {}) => {
      counter.current += 1;
      const id = `toast-${counter.current}`;
      setToasts((current) => [...current, { id, message, ...opts }]);
      const duration = opts.duration ?? 5000;
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  return { toasts, toast, dismiss };
}

export type ToasterPosition =
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center";

const POSITION_ANCHORS: Record<
  ToasterPosition,
  { vertical: "top" | "bottom"; horizontal: "left" | "right" | "center" }
> = {
  "bottom-left": { vertical: "bottom", horizontal: "left" },
  "bottom-right": { vertical: "bottom", horizontal: "right" },
  "bottom-center": { vertical: "bottom", horizontal: "center" },
  "top-right": { vertical: "top", horizontal: "right" },
  "top-left": { vertical: "top", horizontal: "left" },
  "top-center": { vertical: "top", horizontal: "center" },
};

export interface ToasterProps {
  toasts?: ToastItem[];

  position?: ToasterPosition;

  onDismiss?: (id: string) => void;
  style?: Partial<StyleDesc>;
}

export function Toaster({
  toasts = [],
  position = "bottom-left",
  onDismiss,
  style,
}: ToasterProps) {
  const t = useAdwaita();
  const offset = t.spacing.padding;
  const { vertical, horizontal } = POSITION_ANCHORS[position];
  const win = useWindowSize();
  const measured = typeof win?.width === "number" && win.width > 0;
  const toastMaxWidth = measured
    ? Math.max(200, win.width - offset * 2)
    : undefined;
  const anchor: Partial<StyleDesc> = {
    ...(vertical === "top" ? { top: offset } : { bottom: offset }),
    ...(measured
      ? {
          left: 0,
          width: win.width,
          paddingLeft: offset,
          paddingRight: offset,
        }
      : horizontal === "center"
        ? { left: offset, right: offset }
        : horizontal === "left"
          ? { left: offset }
          : { right: offset }),
  };
  return (
    <div
      style={{
        position: "absolute",
        ...anchor,
        display: "flex",
        flexDirection: "column",
        alignItems:
          horizontal === "center"
            ? "center"
            : horizontal === "left"
              ? "flex-start"
              : "flex-end",
        gap: t.spacing.gap,
        pointerEvents: "none",
        ...style,
      }}
    >
      {toasts.map((toast, i) => {
        const id = toast.id;
        return (
          <Toast
            key={id ?? i}
            message={toast.message}
            type={toast.type}
            actionLabel={toast.actionLabel}
            onAction={toast.onAction}
            onDismiss={onDismiss ? () => onDismiss(id ?? "") : undefined}
            style={{
              pointerEvents: "auto",
              maxWidth: toastMaxWidth ?? "100%",
            }}
          />
        );
      })}
    </div>
  );
}
