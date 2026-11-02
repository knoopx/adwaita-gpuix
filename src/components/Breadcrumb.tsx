import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T, TitleText } from "./text";
import { Icon, type IconName } from "./icons";

export interface BreadcrumbProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Breadcrumb({ children, style }: BreadcrumbProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface BreadcrumbListProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function BreadcrumbList({ children, style }: BreadcrumbListProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface BreadcrumbItemProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function BreadcrumbItem({ children, style }: BreadcrumbItemProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface BreadcrumbLinkProps {
  children: ReactNode;
  icon?: IconName;
  onClick?: () => void;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function BreadcrumbLink({
  children,
  icon,
  onClick,
  disabled,
  style,
}: BreadcrumbLinkProps) {
  const t = useAdwaita();
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        hover: disabled ? undefined : { textDecoration: "underline" },
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={14} color={t.color.accent.base} /> : null}
      <T size="body" color={t.color.accent.base}>
        {children}
      </T>
    </div>
  );
}

export interface BreadcrumbPageProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function BreadcrumbPage({ children, style }: BreadcrumbPageProps) {
  return (
    <TitleText size="body" style={style}>
      {children}
    </TitleText>
  );
}

export interface BreadcrumbSeparatorProps {
  style?: Partial<StyleDesc>;
}

export function BreadcrumbSeparator({ style }: BreadcrumbSeparatorProps) {
  const t = useAdwaita();
  return (
    <Icon
      name="chevronRight"
      size={14}
      color={t.color.text.dim}
      style={{ pointerEvents: "none", ...style }}
    />
  );
}

export interface BreadcrumbEllipsisProps {
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}

export function BreadcrumbEllipsis({
  onClick,
  style,
}: BreadcrumbEllipsisProps) {
  const t = useAdwaita();
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        borderRadius: t.radius.sm,
        cursor: "pointer",
        hover: { backgroundColor: t.color.surface.buttonHover },
        ...style,
      }}
    >
      <T size="body" color={t.color.text.dim}>
        …
      </T>
    </div>
  );
}
