import { Children, type ReactElement, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./common";
import { Input } from "./Input";
import { Textarea } from "./Textarea";

export interface InputGroupProps {
  children: ReactNode;

  align?: "row" | "block-start" | "block-end";

  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function InputGroup({
  children,
  align = "row",
  disabled,
  style,
}: InputGroupProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const column = align !== "row";

  let orderedChildren: ReactNode = children;
  if (column) {
    const arr = Children.toArray(children);
    const primary: ReactNode[] = [];
    const accessory: ReactNode[] = [];
    const unknown: ReactNode[] = [];
    for (const child of arr) {
      const type = (child as ReactElement | null | undefined)?.type;
      if (
        type === InputGroupInput ||
        type === InputGroupTextarea
      ) {
        primary.push(child);
      } else if (
        type === InputGroupAddon ||
        type === InputGroupButton ||
        type === InputGroupText
      ) {
        accessory.push(child);
      } else {
        unknown.push(child);
      }
    }
    const blockAlign = align as "block-start" | "block-end";
    orderedChildren =
      blockAlign === "block-start"
        ? [...accessory, ...primary, ...unknown]
        : [...primary, ...unknown, ...accessory];
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: column ? "column" : "row",
        alignItems: column ? "stretch" : "center",
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        overflow: "hidden",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : undefined,
        pointerEvents: disabled ? "none" : undefined,
        ...style,
      }}
    >
      {orderedChildren}
    </div>
  );
}

export interface InputGroupInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "search" | "url";
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function InputGroupInput({
  value,
  onChange,
  placeholder,
  type,
  disabled,
  style,
}: InputGroupInputProps) {
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      style={{
        borderWidth: 0,
        borderRadius: 0,
        flexGrow: 1,
        ...style,
      }}
    />
  );
}

export interface InputGroupAddonProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

function InputGroupTextSlot({ children, style }: InputGroupTextProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: t.spacing.gap,
        ...style,
      }}
    >
      <T size="body" color={t.colors.dim_fg}>
        {children}
      </T>
    </div>
  );
}

export function InputGroupAddon({ children, style }: InputGroupAddonProps) {
  return <InputGroupTextSlot children={children} style={style} />;
}

export interface InputGroupButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function InputGroupButton({
  onClick,
  children,
  style,
}: InputGroupButtonProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        flexShrink: 0,
        borderRadius: radii.button,
        cursor: "pointer",
        hover: { backgroundColor: colors.button_hover },
        active: { backgroundColor: colors.button_active },
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface InputGroupTextProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function InputGroupText({ children, style }: InputGroupTextProps) {
  return <InputGroupTextSlot children={children} style={style} />;
}

export interface InputGroupTextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function InputGroupTextarea({
  value,
  onChange,
  placeholder,
  rows,
  disabled,
  style,
}: InputGroupTextareaProps) {
  return (
    <Textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      style={{
        borderWidth: 0,
        borderRadius: 0,
        flexGrow: 1,
        ...style,
      }}
    />
  );
}
