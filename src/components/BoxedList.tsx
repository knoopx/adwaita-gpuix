import { Children, useState, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba, isDarkScheme } from "../theme/adwaita";
import { T } from "./common";
import { Icon, type IconName } from "./icons";
import { Switch } from "./Switch";
import { Entry } from "./Entry";

export function BoxedList({
  children,
  style,
}: {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const items = Children.toArray(children);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.view_bg,
        overflow: "hidden",
        ...style,
      }}
    >
      {items.map((child, i) => (
        <div
          key={i}
          style={{
            borderBottomWidth: i < items.length - 1 ? 1 : 0,
            borderColor: t.colors.border,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface RowShellProps {
  title: string;
  subtitle?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  onClick?: () => void;
  height?: number;
}

function RowShell({
  title,
  subtitle,
  prefix,
  suffix,
  onClick,
  height,
}: RowShellProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minHeight: height ?? 44,
        paddingLeft: 12,
        paddingRight: 12,
        cursor: onClick ? "pointer" : "default",
        hover: onClick
          ? {
              backgroundColor: hexToRgba(
                colors.fg,
                isDarkScheme(t.scheme) ? 0.06 : 0.04,
              ),
            }
          : undefined,
      }}
    >
      {prefix}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        {/* Fixed-height line boxes: <text> has no reliable intrinsic height in
            the takumi rasterizer (a unitless lineHeight serializes as a CSS
            multiplier and balloons the row), so each line gets an explicit
            box. Valid GPUix layout in the native app as well. */}
        <div style={{ height: 18 }}>
          <T size="body" color={colors.fg}>
            {title}
          </T>
        </div>
        {subtitle ? (
          <div style={{ height: 16 }}>
            <T size="caption" color={colors.dim_fg}>
              {subtitle}
            </T>
          </div>
        ) : null}
      </div>
      {suffix}
    </div>
  );
}

export interface ActionRowProps {
  title: string;
  subtitle?: string;
  prefix?: IconName;
  suffix?: IconName;
  onClick?: () => void;
}

export function ActionRow({
  title,
  subtitle,
  prefix,
  suffix,
  onClick,
}: ActionRowProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <RowShell
      title={title}
      subtitle={subtitle}
      onClick={onClick}
      prefix={
        prefix ? (
          <Icon name={prefix} size={18} color={colors.dim_fg} />
        ) : undefined
      }
      suffix={
        suffix ? (
          <Icon name={suffix} size={18} color={colors.dim_fg} />
        ) : undefined
      }
    />
  );
}

export interface EntryRowProps {
  title: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function EntryRow({
  title,
  value,
  placeholder,
  onChange,
}: EntryRowProps) {
  return (
    <RowShell
      title={title}
      suffix={
        <Entry
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          style={{
            width: 160,
            flexGrow: 0,
            minHeight: 30,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        />
      }
    />
  );
}

export interface SwitchRowProps {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SwitchRow({
  title,
  subtitle,
  checked,
  onChange,
}: SwitchRowProps) {
  return (
    <RowShell
      title={title}
      subtitle={subtitle}
      suffix={<Switch checked={checked} onChange={onChange} />}
    />
  );
}

export interface SpinRowProps {
  title: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function SpinRow({
  title,
  value,
  min = 0,
  max = 99,
  step = 1,
  onChange,
}: SpinRowProps) {
  const t = useAdwaita();
  const { colors } = t;
  const stepBtn = (dir: -1 | 1, disabled: boolean) => (
    <div
      onClick={
        disabled
          ? undefined
          : () => onChange(Math.min(max, Math.max(min, value + dir * step)))
      }
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.button_bg,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        hover: disabled ? undefined : { backgroundColor: colors.button_hover },
      }}
    >
      <Icon name={dir === 1 ? "plus" : "minus"} size={16} color={colors.fg} />
    </div>
  );
  return (
    <RowShell
      title={title}
      suffix={
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {stepBtn(-1, value <= min)}
          <T
            size="body"
            weight={600}
            color={colors.fg}
            style={{ minWidth: 20, textAlign: "center" }}
          >
            {String(value)}
          </T>
          {stepBtn(1, value >= max)}
        </div>
      }
    />
  );
}

export interface ComboRowProps {
  title: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function ComboRow({ title, value, options, onChange }: ComboRowProps) {
  const t = useAdwaita();
  const { colors } = t;
  const cycle = () => {
    const i = options.indexOf(value);
    const next = options[(i + 1) % options.length];
    onChange(next);
  };
  return (
    <RowShell
      title={title}
      suffix={
        <div
          onClick={cycle}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            minHeight: 30,
            paddingLeft: 10,
            paddingRight: 8,
            borderRadius: 8,
            backgroundColor: colors.button_bg,
            cursor: "pointer",
            hover: { backgroundColor: colors.button_hover },
          }}
        >
          <T size="body" color={colors.fg}>
            {value}
          </T>
          <Icon name="chevronDown" size={16} color={colors.dim_fg} />
        </div>
      }
    />
  );
}

export interface ExpanderRowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function ExpanderRow({ title, subtitle, children }: ExpanderRowProps) {
  const t = useAdwaita();
  const { colors } = t;
  const [open, setOpen] = useState(false);
  return (
    <div>
      <RowShell
        title={title}
        subtitle={subtitle}
        onClick={() => setOpen((o) => !o)}
        suffix={<Icon name="chevronDown" size={18} color={colors.dim_fg} />}
      />
      {open ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 12,
            paddingTop: 0,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export interface ButtonRowProps {
  title: string;
  label: string;
  destructive?: boolean;
  onClick?: () => void;
}

export function ButtonRow({
  title,
  label,
  destructive,
  onClick,
}: ButtonRowProps) {
  const t = useAdwaita();
  const { colors } = t;
  const fg = destructive ? colors.destructive : colors.accent;
  const hoverBg = destructive ? colors.destructiveTint : colors.button_hover;
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 44,
        paddingLeft: 12,
        paddingRight: 12,
        cursor: "pointer",
        hover: { backgroundColor: hoverBg },
      }}
    >
      <T size="body" color={colors.fg}>
        {title}
      </T>
      <T size="body" weight={600} color={fg}>
        {label}
      </T>
    </div>
  );
}

import type { ComponentShot } from "../../scripts/shot";
import { Row, Shot, ShotItem } from "./common";

export const BoxedListShot: ComponentShot = {
  name: "BoxedList",
  el: (
    <Shot>
      <Row label="ActionRow" col>
        <ShotItem label="with prefix + suffix icons">
          <BoxedList>
            <ActionRow title="Open settings" subtitle="Configure the application" prefix="settings" suffix="chevronDown" onClick={() => {}} />
          </BoxedList>
        </ShotItem>
        <ShotItem label="plain (no icons)">
          <BoxedList>
            <ActionRow title="Open settings" subtitle="Configure the application" onClick={() => {}} />
          </BoxedList>
        </ShotItem>
      </Row>
      <Row label="EntryRow" col>
        <ShotItem label="with value">
          <BoxedList><EntryRow title="Display name" value="Ada Lovelace" /></BoxedList>
        </ShotItem>
        <ShotItem label="placeholder (empty)">
          <BoxedList><EntryRow title="Display name" placeholder="Type here…" /></BoxedList>
        </ShotItem>
      </Row>
      <Row label="SwitchRow" col>
        <ShotItem label="on">
          <BoxedList><SwitchRow title="Notifications" subtitle="Show badges" checked={true} onChange={() => {}} /></BoxedList>
        </ShotItem>
        <ShotItem label="off">
          <BoxedList><SwitchRow title="Notifications" checked={false} onChange={() => {}} /></BoxedList>
        </ShotItem>
      </Row>
      <Row label="SpinRow" col>
        <ShotItem label="mid range">
          <BoxedList><SpinRow title="Volume" value={40} onChange={() => {}} /></BoxedList>
        </ShotItem>
        <ShotItem label="at min (− disabled)">
          <BoxedList><SpinRow title="Volume" value={0} onChange={() => {}} /></BoxedList>
        </ShotItem>
        <ShotItem label="at max (+ disabled)">
          <BoxedList><SpinRow title="Volume" value={99} onChange={() => {}} /></BoxedList>
        </ShotItem>
      </Row>
      <Row label="ComboRow" col>
        <ShotItem label="cycling pill">
          <BoxedList><ComboRow title="Language" value="English" options={['English', 'Español', 'Français']} onChange={() => {}} /></BoxedList>
        </ShotItem>
      </Row>
      <Row label="ExpanderRow" col>
        <ShotItem label="collapsed (expanded is internal state)">
          <BoxedList>
            <ExpanderRow title="Advanced" subtitle="More options">
              <T>Advanced details revealed here.</T>
            </ExpanderRow>
          </BoxedList>
        </ShotItem>
      </Row>
      <Row label="ButtonRow" col>
        <ShotItem label="accent">
          <BoxedList><ButtonRow title="Share project" label="Share" onClick={() => {}} /></BoxedList>
        </ShotItem>
        <ShotItem label="destructive">
          <BoxedList><ButtonRow title="Delete project" label="Delete" destructive onClick={() => {}} /></BoxedList>
        </ShotItem>
      </Row>
    </Shot>
  ),
};
