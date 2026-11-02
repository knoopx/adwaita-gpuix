import { Children, type ReactNode, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import {
  type AdwaitaTheme,
  hexToRgba,
  isDarkScheme,
  useAdwaita,
} from "../theme/adwaita";
import { T } from "./text";
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
    <div style={groupCardStyle(t, style)}>
      {items.length === 0 && emptyLabel !== undefined ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: t.control.rowHeight,
            padding: t.space.md,
          }}
        >
          <T size="caption" color={t.color.text.dim}>
            {emptyLabel}
          </T>
        </div>
      ) : null}
      {items.map((child, i) => (
        <div
          key={i}
          style={{
            borderBottomWidth:
              i < items.length - 1 ? t.control.dividerThickness : 0,
            borderColor: t.color.divider.faint,
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

  titleWeight?: number;

  inset?: number;

  background?: string;

  titleColor?: string;

  subtitleColor?: string;

  subtitleSize?: "body" | "caption";

  subtitleWeight?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  height?: number;
}

function rowHoverTint(t: AdwaitaTheme): string {
  return t.color.surface.hover;
}

function rowShellStateStyle(
  t: AdwaitaTheme,
  interactive: boolean,
  disabled: boolean | undefined,
  selected: boolean | undefined,
): Partial<StyleDesc> {
  return {
    cursor: interactive ? "pointer" : "default",
    backgroundColor: selected ? t.color.selection.accent : "transparent",
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? "none" : "auto",
  };
}

function rowShellHoverStyle(
  t: AdwaitaTheme,
  interactive: boolean,
  selected: boolean | undefined,
): Partial<StyleDesc> {
  const enabled = interactive && !selected;
  return { hover: enabled ? { backgroundColor: rowHoverTint(t) } : undefined };
}

function RowShellTitle({
  title,
  subtitle,
  weight,
  titleColor,
  subtitleColor,
  subtitleSize,
  subtitleWeight,
}: {
  title: string;
  subtitle?: string;

  weight?: number;

  titleColor?: string;

  subtitleColor?: string;

  subtitleSize?: "body" | "caption";

  subtitleWeight?: number;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minWidth: 0,
        gap: t.space.xs,
      }}
    >
      <T
        size="body"
        color={t.color.text.primary}
        style={{ whiteSpace: "nowrap", lineClamp: 1, textOverflow: "ellipsis" }}
      >
        {title}
      </T>
      {subtitle ? (
        <T
          size={subtitleSize ?? "caption"}
          weight={subtitleWeight}
          color={subtitleColor ?? t.color.text.dim}
          style={{
            whiteSpace: "nowrap",
            lineClamp: 1,
            textOverflow: "ellipsis",
          }}
        >
          {subtitle}
        </T>
      ) : null}
    </div>
  );
}

function RowShell({
  title,
  subtitle,
  titleWeight,
  inset,
  background,
  titleColor,
  subtitleColor,
  subtitleSize,
  subtitleWeight,
  prefix,
  suffix,
  onClick,
  selected,
  disabled,
  height,
}: RowShellProps) {
  const t = useAdwaita();
  const interactive = onClick !== undefined && !disabled;
  return (
    <div
      onClick={interactive ? onClick : undefined}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.md,
        minHeight: height ?? t.control.rowMinHeight,
        paddingLeft: inset ?? t.control.groupRowInset,
        paddingRight: inset ?? t.control.groupRowInset,
        paddingTop: t.control.groupRowPaddingY,
        paddingBottom: t.control.groupRowPaddingY,
        ...rowShellStateStyle(t, interactive, disabled, selected),
        ...rowShellHoverStyle(t, interactive, selected),
        ...(background ? { backgroundColor: background } : {}),
      }}
    >
      {prefix}
      <RowShellTitle
        title={title}
        subtitle={subtitle}
        weight={titleWeight}
        titleColor={titleColor}
        subtitleColor={subtitleColor}
        subtitleSize={subtitleSize}
        subtitleWeight={subtitleWeight}
      />
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
  return (
    <RowShell
      title={title}
      subtitle={subtitle}
      onClick={disabled ? undefined : onClick}
      selected={selected}
      disabled={disabled}
      prefix={
        prefix ? (
          <Icon name={prefix} size={18} color={t.color.text.dim} />
        ) : undefined
      }
      suffix={
        suffix ? (
          <Icon name={suffix} size={18} color={t.color.text.dim} />
        ) : undefined
      }
    />
  );
}

export interface BoxedRowProps {
  title: string;
  subtitle?: string;

  titleWeight?: number;

  inset?: number;

  height?: number;

  background?: string;

  titleColor?: string;

  subtitleColor?: string;

  subtitleSize?: "body" | "caption";

  subtitleWeight?: number;
  prefix?: ReactNode;

  trailing?: ReactNode;

  caption?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function BoxedRow({
  title,
  subtitle,
  titleWeight,
  inset,
  height,
  background,
  titleColor,
  subtitleColor,
  subtitleSize,
  subtitleWeight,
  prefix,
  trailing,
  caption,
  onClick,
  disabled,
}: BoxedRowProps) {
  const t = useAdwaita();
  return (
    <RowShell
      title={title}
      subtitle={subtitle}
      titleWeight={titleWeight}
      inset={inset}
      height={height}
      background={background}
      titleColor={titleColor}
      subtitleColor={subtitleColor}
      subtitleSize={subtitleSize}
      subtitleWeight={subtitleWeight}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      prefix={prefix}
      suffix={
        trailing ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 2,
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            {trailing}
            {caption ? (
              <T size="caption" color={t.color.text.dim}>
                {caption}
              </T>
            ) : null}
          </div>
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
        <Switch checked={checked} onChange={onChange} disabled={disabled} />
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
        borderRadius: t.radius.sm,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: t.color.surface.button,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        hover: disabled
          ? undefined
          : { backgroundColor: t.color.surface.buttonHover },
      }}
    >
      <Icon
        name={dir === 1 ? "plus" : "minus"}
        size={16}
        color={t.color.text.primary}
      />
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
            color={t.color.text.primary}
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
  subtitle?: string;

  icon?: IconName;
  value: string;
  options: string[];
  onChange: (value: string) => void;

  trailing?: ReactNode;
}

export function ComboRow({
  title,
  subtitle,
  icon,
  value,
  options,
  onChange,
  trailing,
}: ComboRowProps) {
  const t = useAdwaita();
  const cycle = () => {
    const i = options.indexOf(value);
    const next = options[(i + 1) % options.length];
    onChange(next);
  };
  return (
    <RowShell
      title={title}
      subtitle={subtitle}
      suffix={
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: t.space.sm,
          }}
        >
          <ComboPill value={value} icon={icon} onCycle={cycle} />
          {trailing}
        </div>
      }
    />
  );
}

function ComboPill({
  value,
  icon,
  onCycle,
}: {
  value: string;
  icon?: IconName;
  onCycle: () => void;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={onCycle}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
        minHeight: t.control.comboPillHeight,
        paddingLeft: t.control.comboPillPaddingX,
        paddingRight: t.space.md,
        borderRadius: t.radius.sm,
        backgroundColor: t.color.surface.active,
        cursor: "pointer",
        hover: { backgroundColor: t.color.surface.buttonHover },
      }}
    >
      {icon ? (
        <Icon name={icon} size={16} color={t.color.text.primary} />
      ) : null}
      <div
        style={{
          maxWidth: t.control.comboPillMaxWidth,
          overflow: "hidden",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <T
          size="body"
          weight={700}
          color={t.color.text.primary}
          style={{
            whiteSpace: "nowrap",
            lineClamp: 1,
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </T>
      </div>
      <Icon name="expandMore" size={16} color={t.color.text.dim} />
    </div>
  );
}

export interface ExpanderRowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function ExpanderRow({ title, subtitle, children }: ExpanderRowProps) {
  const t = useAdwaita();
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
            color={t.color.text.dim}
          />
        }
      />
      {open ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.space.sm,
            paddingLeft: t.control.groupRowInset,
            paddingRight: t.control.groupRowInset,
            paddingBottom: t.space.md,
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
  const fg = destructive ? t.color.functional.destructive : t.color.accent.base;
  const hoverBg = destructive
    ? t.color.functional.destructiveTint
    : t.color.accent.tint;
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: t.space.md,
        minHeight: t.control.rowMinHeight,
        paddingLeft: t.control.groupRowInset,
        paddingRight: t.control.groupRowInset,
        paddingTop: t.space.md,
        paddingBottom: t.space.md,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        hover: disabled ? undefined : { backgroundColor: hoverBg },
      }}
    >
      <T size="body" color={t.color.text.primary}>
        {title}
      </T>
      <T size="body" weight={600} color={fg}>
        {label}
      </T>
    </div>
  );
}

export function groupCardStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "column",
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.color.divider.default,
    backgroundColor: t.color.surface.card,
    overflow: "hidden",
    ...style,
  };
}
