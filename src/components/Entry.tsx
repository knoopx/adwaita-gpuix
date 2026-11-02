import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { AdwaitaInputBase } from "./input-base";

export type EntryType =
  "text" | "password" | "email" | "number" | "search" | "url";

export interface EntryProps {
  value?: string;
  placeholder?: string;
  type?: EntryType;
  disabled?: boolean;
  invalid?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;

  surface?: "view" | "control";

  focused?: boolean;
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
  surface,
  focused,
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
      {...(surface !== undefined ? { surface } : {})}
      {...(focused !== undefined ? { focused } : {})}
      style={{
        paddingLeft: t.space.md,
        paddingRight: t.space.md,
        ...style,
      }}
    />
  );
}
