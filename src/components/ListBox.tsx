import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { type EventPayload, type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, hexToRgba, useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { focusRingStyle } from "./input-base";
import { arrowStep, isActivateKey, stepIndex } from "../lib/roving";
import { TrailingSlot } from "./Box";
import { Icon, type IconName } from "./icons";

interface ListBoxContextValue {
  selectedValues: string[];

  focused: string | null;
  multiple: boolean;
  onSelect: (value: string) => void;
  onFocusRow: (value: string) => void;
  register: (value: string) => void;
  unregister: (value: string) => void;
}

const ListBoxContext = createContext<ListBoxContextValue | null>(null);

export type ListBoxProps =
  | {
      multiple?: false;
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
      children?: ReactNode;
      style?: Partial<StyleDesc>;
    }
  | {
      multiple: true;
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
      children?: ReactNode;
      style?: Partial<StyleDesc>;
    };

function initialSelection(
  multiple: boolean,
  props: ListBoxProps,
): string | string[] | null {
  const preset = props.defaultValue ?? props.value;
  if (preset !== undefined) return preset;
  return multiple ? [] : null;
}

function currentSelection(
  props: ListBoxProps,
  internal: string | string[] | null,
): string | string[] | null {
  return props.value ?? internal;
}

function selectionValues(
  multiple: boolean,
  current: string | string[] | null,
): string[] {
  if (multiple) return current as string[];
  return current ? [current as string] : [];
}

function toggleSelection(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function ListBox(props: ListBoxProps) {
  const multiple = props.multiple === true;

  const [internal, setInternal] = useState<string | string[] | null>(
    initialSelection(multiple, props),
  );

  const [focused, setFocused] = useState<string | null>(null);
  const orderedRef = useRef<string[]>([]);
  const register = (v: string) => {
    if (!orderedRef.current.includes(v)) orderedRef.current.push(v);
  };
  const unregister = (v: string) => {
    orderedRef.current = orderedRef.current.filter((x) => x !== v);
  };

  const resolved = currentSelection(props, internal);
  const current = multiple
    ? (resolved as string[])
    : (resolved as string | null);
  const selectedValues: string[] = selectionValues(multiple, current);

  const handleSelect = (v: string) => {
    if (props.multiple !== true) {
      if (props.value === undefined) setInternal(v);
      props.onValueChange?.(v);
      return;
    }
    const next = toggleSelection(
      currentSelection(props, internal) as string[],
      v,
    );
    if (props.value === undefined) setInternal(next);
    props.onValueChange?.(next);
  };

  const handleKeyDown = (event: EventPayload) => {
    const ordered = orderedRef.current;
    if (ordered.length === 0) return;
    const key = event.key;
    if (isActivateKey(key)) {
      if (focused) handleSelect(focused);
      return;
    }
    const step = arrowStep(key);
    if (step === 0) return;
    const curIdx = focused ? ordered.indexOf(focused) : -1;
    setFocused(ordered[stepIndex(curIdx, step, ordered.length, "last")]);
  };

  const ctxValue: ListBoxContextValue = {
    selectedValues,
    focused,
    multiple,
    onSelect: handleSelect,
    onFocusRow: setFocused,
    register,
    unregister,
  };

  return (
    <ListBoxContext.Provider value={ctxValue}>
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{
          display: "flex",
          flexDirection: "column",
          ...props.style,
        }}
      >
        {props.children}
      </div>
    </ListBoxContext.Provider>
  );
}

export interface ListBoxItemProps {
  value: string;
  disabled?: boolean;
  icon?: IconName;

  subtitle?: string;

  trailing?: ReactNode;

  mono?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ListBoxItem({
  value,
  disabled,
  icon,
  subtitle,
  trailing,
  mono,
  children,
  style,
}: ListBoxItemProps) {
  const t = useAdwaita();
  const ctx = useContext(ListBoxContext);
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  useEffect(() => {
    ctxRef.current?.register(value);
    return () => ctxRef.current?.unregister(value);
  }, [value]);

  const selected = ctx ? ctx.selectedValues.includes(value) : false;
  const isFocused = ctx?.focused === value;

  return (
    <div
      onClick={itemClickHandler(ctx, disabled, value)}
      style={{
        ...itemFrameStyle(t),
        ...itemStateStyle(t, selected, disabled),
        ...itemFocusStyle(t, isFocused),
        ...style,
      }}
    >
      {icon ? (
        <Icon name={icon} size={16} color={itemIconColor(t, selected)} />
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <T
          size="body"
          color={t.color.text.primary}
          style={{
            ...ITEM_LABEL_STYLE,
            ...(mono ? { fontFamily: t.type.fontFamilyMono } : {}),
          }}
        >
          {children}
        </T>
        {subtitle ? (
          <T size="caption" color={t.color.text.dim} style={ITEM_LABEL_STYLE}>
            {subtitle}
          </T>
        ) : null}
      </div>
      {trailing ? <TrailingSlot>{trailing}</TrailingSlot> : null}
    </div>
  );
}

const ITEM_LABEL_STYLE: Partial<StyleDesc> = {
  flexGrow: 1,
  flexShrink: 1,
  minWidth: 0,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

function itemFrameStyle(t: AdwaitaTheme): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.space.sm,
    paddingLeft: t.control.groupRowInset,
    paddingRight: t.control.groupRowInset,
    paddingTop: t.space.xs,
    paddingBottom: t.space.xs,
    minHeight: t.control.rowHeight,
    borderRadius: t.radius.sm,
  };
}

function itemStateStyle(
  t: AdwaitaTheme,
  selected: boolean,
  disabled: boolean | undefined,
): Partial<StyleDesc> {
  return {
    cursor: disabled ? "default" : "pointer",
    backgroundColor: selected ? t.color.selection.accent : "transparent",
    opacity: disabled ? 0.5 : 1,
    hover:
      selected || disabled
        ? undefined
        : { backgroundColor: hexToRgba(t.color.text.primary, 0.04) },
  };
}

function itemFocusStyle(
  t: AdwaitaTheme,
  isFocused: boolean,
): Partial<StyleDesc> {
  if (!isFocused) return {};
  return focusRingStyle(hexToRgba(t.color.accent.base, 0.4));
}

function itemIconColor(t: AdwaitaTheme, selected: boolean): string {
  return selected ? t.color.text.primary : t.color.text.dim;
}

function itemClickHandler(
  ctx: ListBoxContextValue | null,
  disabled: boolean | undefined,
  value: string,
): (() => void) | undefined {
  if (disabled || !ctx) return undefined;
  return () => {
    ctx.onFocusRow(value);
    ctx.onSelect(value);
  };
}
