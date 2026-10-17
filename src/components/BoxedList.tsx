import { Children, useState, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba, isDarkScheme } from "../theme/adwaita";
import { T } from "./common";
import { Icon, type IconName } from "./icons";
import { Switch } from "./Switch";
import { Entry } from "./Entry";

export interface BoxedListProps {
  children?: ReactNode;
  
  emptyLabel?: string;
  style?: Partial<StyleDesc>;
}

export function BoxedList({ children, emptyLabel, style }: BoxedListProps) {
  const t = useAdwaita();
  const items = Children.toArray(children);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: t.radii.card,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.view_bg,
        overflow: "hidden",
        ...style,
      }}
    >
      {items.length === 0 && emptyLabel !== undefined ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: t.spacing.rowHeight,
            padding: t.spacing.paddingTight,
          }}
        >
          <T size="caption" color={t.colors.dim_fg}>
            {emptyLabel}
          </T>
        </div>
      ) : null}
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
  selected?: boolean;
  disabled?: boolean;
  height?: number;
}

function RowShell({
  title,
  subtitle,
  prefix,
  suffix,
  onClick,
  selected,
  disabled,
  height,
}: RowShellProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  const interactive = onClick !== undefined && !disabled;
  return (
    <div
      onClick={interactive ? onClick : undefined}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.paddingTight,
        minHeight: height ?? spacing.rowHeight,
        paddingLeft: spacing.paddingTight,
        paddingRight: spacing.paddingTight,
        cursor: interactive ? "pointer" : "default",
        backgroundColor: selected ? colors.accentTint : "transparent",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        hover: interactive && !selected
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
        <T size="body" color={colors.fg}>
          {title}
        </T>
        {subtitle ? (
          <T size="caption" color={colors.dim_fg}>
            {subtitle}
          </T>
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
  selected?: boolean;
  disabled?: boolean;
}

export function ActionRow({
  title,
  subtitle,
  prefix,
  suffix,
  onClick,
  selected,
  disabled,
}: ActionRowProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <RowShell
      title={title}
      subtitle={subtitle}
      onClick={disabled ? undefined : onClick}
      selected={selected}
      disabled={disabled}
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
  disabled?: boolean;
}

export function SwitchRow({
  title,
  subtitle,
  checked,
  onChange,
  disabled,
}: SwitchRowProps) {
  return (
    <RowShell
      title={title}
      subtitle={subtitle}
      disabled={disabled}
      suffix={
        <Switch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      }
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
  const { colors, radii } = t;
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
        borderRadius: radii.button,
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
  const { colors, radii } = t;
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
            borderRadius: radii.button,
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
  const { colors, spacing } = t;
  const [open, setOpen] = useState(false);
  return (
    <div>
      <RowShell
        title={title}
        subtitle={subtitle}
        onClick={() => setOpen((o) => !o)}
        suffix={
          <Icon
            name={open ? "chevronUp" : "chevronDown"}
            size={18}
            color={colors.dim_fg}
          />
        }
      />
      {open ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacing.gap,
            padding: spacing.paddingTight,
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
  disabled?: boolean;
  onClick?: () => void;
}

export function ButtonRow({
  title,
  label,
  destructive,
  disabled,
  onClick,
}: ButtonRowProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  const fg = destructive ? colors.destructive : colors.accent;
  const hoverBg = destructive ? colors.destructiveTint : colors.accentTint;
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.paddingTight,
        minHeight: spacing.rowHeight,
        paddingLeft: spacing.paddingTight,
        paddingRight: spacing.paddingTight,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        hover: disabled ? undefined : { backgroundColor: hoverBg },
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
