import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { DescriptionText, T, TitleText } from "./text";
import { CloseButton } from "./overlay";
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

function resolveToneTheme(tone: BannerTone, t: AdwaitaTheme): BannerToneTheme {
  switch (tone) {
    case "warning":
      return {
        bg: t.color.functional.warningTint,
        fg: t.color.functional.warning,
        icon: "warning",
      };
    case "error":
      return {
        bg: t.color.functional.destructiveTint,
        fg: t.color.functional.destructive,
        icon: "error",
      };
    case "success":
      return {
        bg: t.color.functional.successTint,
        fg: t.color.functional.success,
        icon: "checkCircle",
      };
    default:
      return { bg: t.color.accent.tint, fg: t.color.accent.base, icon: "info" };
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
          gap: t.space.sm,
        }}
      >
        {showIcon === false ? null : (
          <Icon name={icon ?? tone.icon} size={18} color={tone.fg} />
        )}
        <T size="body" weight={700} color={t.color.text.primary}>
          {title}
        </T>
      </div>
      {body ? (
        <T size="caption" color={t.color.text.dim}>
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
  return (
    <TitleText size="body" style={style}>
      {children}
    </TitleText>
  );
}

export interface BannerDescriptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function BannerDescription({ children, style }: BannerDescriptionProps) {
  return (
    <DescriptionText size="caption" style={style}>
      {children}
    </DescriptionText>
  );
}

function actionRowJustify(
  hasAction: boolean,
  hasClose: boolean,
): "space-between" | "flex-end" | "flex-start" {
  if (hasAction && hasClose) return "space-between";
  if (hasClose) return "flex-end";
  return "flex-start";
}

function BannerActions({
  narrow,
  action,
  close,
}: {
  narrow?: boolean;
  action: ReactNode;
  close: ReactNode;
}) {
  if (!narrow)
    return (
      <>
        {action}
        {close}
      </>
    );
  if (!action && !close) return null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: actionRowJustify(!!action, !!close),
      }}
    >
      {action}
      {close}
    </div>
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
  const resolvedTone = tone ?? (variant ? variantToTone(variant) : "info");
  const toneTheme = resolveToneTheme(resolvedTone, t);
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
        gap: t.space.sm,
        padding: t.space.md,
        borderRadius: t.radius.sm,
        backgroundColor: toneTheme.bg,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.sm,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <BannerBody
          title={title}
          body={body}
          tone={toneTheme}
          icon={icon}
          showIcon={showIcon}
        />
      </div>
      <BannerActions narrow={narrow} action={action} close={close} />
    </div>
  );
}
