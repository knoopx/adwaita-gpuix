import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./common";

export interface FrameProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Frame({ children, style }: FrameProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <div
      style={{
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface CardProps {
  title?: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Card({ title, children, style }: CardProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  return (
    <Frame
      style={{
        display: "flex",
        flexDirection: "column",
        padding: spacing.padding,
        gap: spacing.gap,
        ...style,
      }}
    >
      {title ? (
        <T size="title4" weight={700} color={colors.fg}>
          {title}
        </T>
      ) : null}
      {children}
    </Frame>
  );
}

export interface CardHeaderProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface CardTitleProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function CardTitle({ children, style }: CardTitleProps) {
  const t = useAdwaita();
  return (
    <T size="title4" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  );
}

export interface CardDescriptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  const t = useAdwaita();
  return (
    <T size="body" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  );
}

export interface CardContentProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function CardContent({ children, style }: CardContentProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        flexGrow: 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface CardFooterProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function CardFooter({ children, style }: CardFooterProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface CardActionProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function CardAction({ children, style }: CardActionProps) {
  return (
    <div
      style={{
        alignSelf: "flex-end",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

