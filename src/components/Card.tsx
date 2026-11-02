import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";

export interface FrameProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Frame({ children, style }: FrameProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        borderRadius: t.radius.sm,
        borderWidth: 0,
        backgroundColor: t.color.surface.view,
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
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}

export function Card({ title, children, onClick, style }: CardProps) {
  const t = useAdwaita();
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: t.space.lg,
        gap: t.space.sm,
        borderRadius: t.radius.lg,
        ...style,
      }}
    >
      {title ? (
        <T size="title4" weight={700} color={t.color.text.primary}>
          {title}
        </T>
      ) : null}
      {children}
    </div>
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
    <T size="title4" weight={700} color={t.color.text.primary} style={style}>
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
    <T size="body" color={t.color.text.dim} style={style}>
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
