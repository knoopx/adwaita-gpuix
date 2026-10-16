import type { StyleDesc } from "@gpuix/react";
import { AdwaitaInputBase } from "./common";

export type EntryType =
  "text" | "password" | "email" | "number" | "search" | "url";

export interface EntryProps {
  value?: string;
  placeholder?: string;
  type?: EntryType;
  disabled?: boolean;
  invalid?: boolean;
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
  onChange,
  onSubmit,
  autoFocus,
  style,
  testId,
}: EntryProps) {
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
      style={{ paddingLeft: 12, paddingRight: 12, ...style }}
    />
  );
}

import type { ComponentShot } from "../../scripts/shot";
import { Row, Shot, ShotItem } from "./common";

export const EntryShot: ComponentShot = {
  name: "Entry",
  el: (
    <Shot>
      <Row label="States" col>
        <ShotItem label="placeholder">
          <Entry placeholder="Type here…" />
        </ShotItem>
        <ShotItem label="with value">
          <Entry value="Hello world" />
        </ShotItem>
        <ShotItem label="invalid">
          <Entry value="invalid value" invalid />
        </ShotItem>
        <ShotItem label="disabled">
          <Entry value="Read only" disabled />
        </ShotItem>
      </Row>
      <Row label="Types (password masks; the rest render plain text)" col>
        <ShotItem label="text">
          <Entry type="text" placeholder="Plain text" />
        </ShotItem>
        <ShotItem label="password">
          <Entry type="password" value="hunter2" />
        </ShotItem>
        <ShotItem label="password (empty)">
          <Entry type="password" placeholder="Password" />
        </ShotItem>
        <ShotItem label="email">
          <Entry type="email" placeholder="you@example.com" />
        </ShotItem>
        <ShotItem label="number">
          <Entry type="number" placeholder="42" />
        </ShotItem>
        <ShotItem label="search">
          <Entry type="search" placeholder="Search…" />
        </ShotItem>
        <ShotItem label="url">
          <Entry type="url" placeholder="https://…" />
        </ShotItem>
      </Row>
    </Shot>
  ),
};
