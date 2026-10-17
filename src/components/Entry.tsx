import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { AdwaitaInputBase } from "./common";

export type EntryType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "search"
  | "url";

export interface EntryProps {
  value?: string;
  placeholder?: string;
  type?: EntryType;
  disabled?: boolean;
  invalid?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
  style?: Partial<StyleDesc>;
  testId?: string;
}

export function Entry({
  value,
  placeholder,
  type = "text",
  disabled,
  invalid,
  leading,
  trailing,
  onChange,
  onSubmit,
  autoFocus,
  style,
  testId,
}: EntryProps) {
  const t = useAdwaita();
  return (
    <AdwaitaInputBase
      testId={testId}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      invalid={invalid}
      autoFocus={autoFocus}
      onSubmit={onSubmit}
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
