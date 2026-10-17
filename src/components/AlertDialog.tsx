import { createContext, useContext, type ReactNode } from "react";
import type { StyleDesc, EventPayload } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T, OverlayShell, dialogCardStyle, OverlayTitle, OverlayDescription } from "./common";
import { Button, type ButtonVariant } from "./Button";

export interface AlertDialogAction {
  label: string;
  variant?: "default" | "suggested" | "destructive";
  onClick?: () => void;
}

export interface AlertDialogProps {
  heading?: string;

  body?: string;

  actions?: AlertDialogAction[];

  media?: ReactNode;

  size?: "default" | "sm";

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  contained?: boolean;

  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface AlertDialogHeaderProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface AlertDialogFooterProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface AlertDialogTitleProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface AlertDialogDescriptionProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface AlertDialogActionProps {
  label?: string;

  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface AlertDialogCancelProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

interface AlertDialogContextValue {
  onOpenChange?: (open: boolean) => void;
}

const AlertDialogCtx = createContext<AlertDialogContextValue | null>(null);

function useAlertDialog(): AlertDialogContextValue {
  return useContext(AlertDialogCtx) ?? {};
}

const variantMap: Record<
  NonNullable<AlertDialogAction["variant"]>,
  ButtonVariant
> = {
  suggested: "suggested",
  destructive: "destructive",
  default: "default",
};

function AlertDialogCardBody({
  heading,
  body,
  actions,
  media,
  size = "default",
  children,
  style,
}: Omit<AlertDialogProps, "open" | "onOpenChange" | "contained">) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const minWidth = size === "sm" ? 288 : 320;

  return (
    <div style={{ ...dialogCardStyle(t, { gap: 16, minWidth }), ...style }}>
      {media ? (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: radii.card,
            backgroundColor: colors.button_bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {media}
        </div>
      ) : null}
      {heading ? (
        <T size="title2" weight={700} color={colors.fg} align="center">
          {heading}
        </T>
      ) : null}
      {body ? (
        <T size="body" color={colors.dim_fg} align="center">
          {body}
        </T>
      ) : null}
      {actions && actions.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {actions.map((a, i) => (
            <Button
              key={i}
              variant={a.variant ? variantMap[a.variant] : "default"}
              label={a.label}
              onClick={a.onClick}
              style={{ width: "100%" }}
            />
          ))}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function AlertDialog({
  open,
  onOpenChange,
  contained = false,
  ...card
}: AlertDialogProps) {
  const ctxValue: AlertDialogContextValue = { onOpenChange };

  if (open === undefined) {
    return (
      <AlertDialogCtx.Provider value={ctxValue}>
        <AlertDialogCardBody {...card} />
      </AlertDialogCtx.Provider>
    );
  }

  if (!open) return null;

  const pos = contained ? "absolute" : "fixed";

  return (
    <AlertDialogCtx.Provider value={ctxValue}>
      <OverlayShell position={pos} onDismiss={() => onOpenChange?.(false)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          onKeyDown={(e: EventPayload) => {
            if (e.key === "Escape") onOpenChange?.(false);
          }}
        >
          <AlertDialogCardBody
            {...card}
            style={{ pointerEvents: "auto", ...card.style }}
          />
        </div>
      </OverlayShell>
    </AlertDialogCtx.Provider>
  );
}

export function AlertDialogHeader({ children, style }: AlertDialogHeaderProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      {children}
    </div>
  );
}

export function AlertDialogFooter({ children, style }: AlertDialogFooterProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {children}
    </div>
  );
}

export function AlertDialogTitle(props: AlertDialogTitleProps) {
  return <OverlayTitle {...props} />;
}

export function AlertDialogDescription(props: AlertDialogDescriptionProps) {
  return <OverlayDescription {...props} />;
}

export function AlertDialogAction({
  label,
  variant = "suggested",
  onClick,
  disabled,
  children,
  style,
}: AlertDialogActionProps) {
  const { onOpenChange } = useAlertDialog();
  return (
    <Button
      variant={variant}
      label={label}
      disabled={disabled}
      onClick={() => {
        onClick?.();
        onOpenChange?.(false);
      }}
      style={style}
    >
      {children}
    </Button>
  );
}

export function AlertDialogCancel({
  label,
  onClick,
  disabled,
  children,
  style,
}: AlertDialogCancelProps) {
  const { onOpenChange } = useAlertDialog();
  return (
    <Button
      variant="default"
      label={label}
      disabled={disabled}
      onClick={() => {
        onClick?.();
        onOpenChange?.(false);
      }}
      style={style}
    >
      {children}
    </Button>
  );
}

export const MessageDialog = AlertDialog;
