import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, type AdwaitaColors } from "../theme/adwaita";
import { T, CloseButton } from "./common";
import { Button } from "./Button";
import { Icon, type IconName } from "./icons";

export type BannerTone = "info" | "warning" | "error" | "success";

export type BannerVariant = "default" | "destructive";

function variantToTone(variant: BannerVariant): BannerTone {
  return variant === "destructive" ? "error" : "info";
}

export interface BannerProps {
  title: string;
  body?: string;
  tone?: BannerTone;

  variant?: BannerVariant;
  
  icon?: IconName;
  
  showIcon?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;

  narrow?: boolean;
  style?: Partial<StyleDesc>;
}

interface BannerToneTheme {
  bg: string;
  fg: string;
  icon: IconName;
}

function resolveToneTheme(
  tone: BannerTone,
  colors: AdwaitaColors,
): BannerToneTheme {
  switch (tone) {
    case "warning":
      return { bg: colors.warningTint, fg: colors.warning, icon: "warning" };
    case "error":
      return {
        bg: colors.destructiveTint,
        fg: colors.destructive,
        icon: "alert",
      };
    case "success":
      return { bg: colors.successTint, fg: colors.success, icon: "success" };
    default:
      return { bg: colors.accentTint, fg: colors.accent, icon: "info" };
  }
}

function BannerBody({
  title,
  body,
  tone,
  icon,
  showIcon,
}: {
  title: string;
  body?: string;
  tone: BannerToneTheme;
  icon?: IconName;
  showIcon?: boolean;
}) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flexGrow: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.gap,
        }}
      >
        {showIcon === false ? null : (
          <Icon name={icon ?? tone.icon} size={18} color={tone.fg} />
        )}
        <T size="body" weight={700} color={colors.fg}>
          {title}
        </T>
      </div>
      {body ? (
        <T size="caption" color={colors.dim_fg}>
          {body}
        </T>
      ) : null}
    </div>
  );
}

export interface BannerTitleProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function BannerTitle({ children, style }: BannerTitleProps) {
  const t = useAdwaita();
  return (
    <T size="body" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  );
}

export interface BannerDescriptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function BannerDescription({ children, style }: BannerDescriptionProps) {
  const t = useAdwaita();
  return (
    <T size="caption" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  );
}

export function Banner({
  title,
  body,
  tone,
  variant,
  icon,
  showIcon,
  actionLabel,
  onAction,
  onClose,
  narrow,
  style,
}: BannerProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const resolvedTone = tone ?? (variant ? variantToTone(variant) : "info");
  const toneTheme = resolveToneTheme(resolvedTone, colors);
  const close = onClose ? <CloseButton onClick={onClose} /> : null;
  const action = actionLabel ? (
    <Button variant="text" label={actionLabel} onClick={onAction} />
  ) : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: narrow ? "column" : "row",
        alignItems: narrow ? "stretch" : "center",
        gap: spacing.gap,
        padding: spacing.paddingTight,
        borderRadius: radii.card,
        backgroundColor: toneTheme.bg,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.gap,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <BannerBody title={title} body={body} tone={toneTheme} icon={icon} showIcon={showIcon} />
      </div>
      {narrow ? (
        action || close ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent:
                action && close
                  ? "space-between"
                  : close
                    ? "flex-end"
                    : "flex-start",
            }}
          >
            {action}
            {close}
          </div>
        ) : null
      ) : (
        <>
          {action}
          {close}
        </>
      )}
    </div>
  );
}
