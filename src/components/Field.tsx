import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./common";

export interface FieldProps {
  children: ReactNode;

  orientation?: "vertical" | "horizontal";
  style?: Partial<StyleDesc>;
}

export function Field({
  children,
  orientation = "vertical",
  style,
}: FieldProps) {
  const t = useAdwaita();
  const horizontal = orientation === "horizontal";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        alignItems: horizontal ? "flex-start" : "stretch",
        gap: t.spacing.gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface FieldLabelProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function FieldLabel({ children, style }: FieldLabelProps) {
  const t = useAdwaita();
  return (
    <T size="body" color={t.colors.fg} style={style}>
      {children}
    </T>
  );
}

export interface FieldDescriptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function FieldDescription({ children, style }: FieldDescriptionProps) {
  const t = useAdwaita();
  return (
    <T size="caption" color={t.colors.dim_fg} style={style}>
      {children}
    </T>
  );
}

export interface FieldErrorProps {
  children?: ReactNode;

  errors?: { message?: string }[];
  style?: Partial<StyleDesc>;
}

export function FieldError({ children, errors, style }: FieldErrorProps) {
  const t = useAdwaita();
  const { colors } = t;

  let content: ReactNode = null;
  if (children) {
    content = children;
  } else if (errors && errors.length > 0) {
    const messages = errors
      .map((e) => e?.message)
      .filter((m): m is string => Boolean(m));
    if (messages.length === 1) {
      content = messages[0];
    } else if (messages.length > 1) {
      content = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            paddingLeft: 8,
          }}
        >
          {messages.map((m, i) => (
            <T key={i} size="caption" color={colors.destructive}>
              {"• " + m}
            </T>
          ))}
        </div>
      );
    }
  }

  if (content === null) return null;

  return (
    <div style={style}>
      {typeof content === "string" ? (
        <T size="caption" color={colors.destructive}>
          {content}
        </T>
      ) : (
        content
      )}
    </div>
  );
}

export interface FieldContentProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function FieldContent({ children, style }: FieldContentProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        flexGrow: 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface FieldSetProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function FieldSet({ children, style }: FieldSetProps) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 24, ...style }}
    >
      {children}
    </div>
  );
}

export interface FieldLegendProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function FieldLegend({ children, style }: FieldLegendProps) {
  const t = useAdwaita();
  return (
    <div style={{ marginBottom: t.spacing.paddingTight, ...style }}>
      <T size="title4" weight={600} color={t.colors.fg}>
        {children}
      </T>
    </div>
  );
}

export interface FieldGroupProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function FieldGroup({ children, style }: FieldGroupProps) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 28, ...style }}
    >
      {children}
    </div>
  );
}

export interface FieldTitleProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function FieldTitle({ children, style }: FieldTitleProps) {
  const t = useAdwaita();
  return (
    <T size="body" weight={500} color={t.colors.fg} style={style}>
      {children}
    </T>
  );
}

export interface FieldSeparatorProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function FieldSeparator({ children, style }: FieldSeparatorProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.spacing.gap,
        ...style,
      }}
    >
      <div style={{ flexGrow: 1, height: 1, backgroundColor: colors.border }} />
      {children ? (
        <T size="caption" color={colors.dim_fg}>
          {children}
        </T>
      ) : null}
      <div style={{ flexGrow: 1, height: 1, backgroundColor: colors.border }} />
    </div>
  );
}
