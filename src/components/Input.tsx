import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { AdwaitaInputBase } from "./common";

export type InputType =
  "text" | "password" | "email" | "number" | "search" | "url";

export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: InputType;
  disabled?: boolean;
  invalid?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  autoFocus?: boolean;
  style?: Partial<StyleDesc>;
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  invalid,
  leading,
  trailing,
  autoFocus,
  style,
}: InputProps) {
  const t = useAdwaita();
  return (
    <AdwaitaInputBase
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      invalid={invalid}
      autoFocus={autoFocus}
      mask={type === "password"}
      leading={leading}
      trailing={trailing}
      style={{
        paddingLeft: t.spacing.paddingTight,
        paddingRight: t.spacing.paddingTight,
        ...style,
      }}
    />
  );
}
