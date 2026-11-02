import { Children, type ReactElement, type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";
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
  const column = align !== "row";

  const orderedChildren = column
    ? orderChildren(partitionChildren(Children.toArray(children)), align)
    : children;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: column ? "column" : "row",
        alignItems: column ? "stretch" : "center",
        borderRadius: t.radius.sm,
        borderWidth: 1,
        borderColor: t.color.border.default,
        backgroundColor: t.color.surface.view,
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

type ChildParts = {
  primary: ReactNode[];
  accessory: ReactNode[];
  unknown: ReactNode[];
};

const PRIMARY_CHILD_TYPES: Set<unknown> = new Set([
  InputGroupInput,
  InputGroupTextarea,
]);

const ACCESSORY_CHILD_TYPES: Set<unknown> = new Set([
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
]);

function childType(child: ReactNode): unknown {
  return (child as ReactElement | null | undefined)?.type;
}

function partitionChildren(arr: ReactNode[]): ChildParts {
  const primary: ReactNode[] = [];
  const accessory: ReactNode[] = [];
  const unknown: ReactNode[] = [];
  for (const child of arr) {
    const type = childType(child);
    if (PRIMARY_CHILD_TYPES.has(type)) {
      primary.push(child);
    } else if (ACCESSORY_CHILD_TYPES.has(type)) {
      accessory.push(child);
    } else {
      unknown.push(child);
    }
  }
  return { primary, accessory, unknown };
}

function orderChildren(
  parts: ChildParts,
  align: InputGroupProps["align"],
): ReactNode[] {
  const { primary, accessory, unknown } = parts;
  if (align === "block-start") return [...accessory, ...primary, ...unknown];
  return [...primary, ...unknown, ...accessory];
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
        padding: t.space.sm,
        ...style,
      }}
    >
      <T size="body" color={t.color.text.dim}>
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
        borderRadius: t.radius.sm,
        cursor: "pointer",
        hover: { backgroundColor: t.color.surface.buttonHover },
        active: { backgroundColor: t.color.surface.buttonActive },
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
