import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { StyleDesc, EventPayload } from "@gpuix/react";
import { useAdwaita, hexToRgba } from "../theme/adwaita";
import { T } from "./common";
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

export function ListBox(props: ListBoxProps) {
  const multiple = props.multiple === true;

  const [internal, setInternal] = useState<string | string[] | null>(
    multiple
      ? (props.defaultValue ?? props.value ?? [])
      : (props.defaultValue ?? props.value ?? null),
  );

  const [focused, setFocused] = useState<string | null>(null);
  const orderedRef = useRef<string[]>([]);
  const register = (v: string) => {
    if (!orderedRef.current.includes(v)) orderedRef.current.push(v);
  };
  const unregister = (v: string) => {
    orderedRef.current = orderedRef.current.filter((x) => x !== v);
  };

  const current = multiple
    ? ((props.value ?? internal) as string[])
    : ((props.value ?? internal) as string | null);
  const selectedValues: string[] = multiple
    ? (current as string[])
    : current
      ? [current as string]
      : [];

  const handleSelect = (v: string) => {
    if (props.multiple === true) {
      const arr = (props.value ?? internal) as string[];
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
      if (props.value === undefined) setInternal(next);
      props.onValueChange?.(next);
    } else {
      if (props.value === undefined) setInternal(v);
      props.onValueChange?.(v);
    }
  };

  const handleKeyDown = (event: EventPayload) => {
    const ordered = orderedRef.current;
    if (ordered.length === 0) return;
    const key = event.key;
    if (key === "ArrowDown" || key === "ArrowUp") {
      const curIdx = focused ? ordered.indexOf(focused) : -1;
      let nextIdx: number;
      if (key === "ArrowDown")
        nextIdx = curIdx < 0 ? 0 : Math.min(curIdx + 1, ordered.length - 1);
      else nextIdx = curIdx < 0 ? ordered.length - 1 : Math.max(curIdx - 1, 0);
      setFocused(ordered[nextIdx]);
    } else if (key === "Enter") {
      if (focused) handleSelect(focused);
    }
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
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ListBoxItem({
  value,
  disabled,
  icon,
  children,
  style,
}: ListBoxItemProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const ctx = useContext(ListBoxContext);
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  useEffect(() => {
    ctxRef.current?.register(value);
    return () => ctxRef.current?.unregister(value);
  }, [value]);

  const selected = ctx ? ctx.selectedValues.includes(value) : false;
  const isFocused = ctx?.focused === value;

  
  
  const focusRing = isFocused
    ? {
        boxShadow: {
          offsetX: 0,
          offsetY: 0,
          blurRadius: 8,
          spreadRadius: 0,
          color: hexToRgba(colors.accent, 0.4),
        },
      }
    : {};

  return (
    <div
      onClick={
        disabled || !ctx
          ? undefined
          : () => {
              ctx.onFocusRow(value);
              ctx.onSelect(value);
            }
      }
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.gap,
        padding: spacing.paddingTight,
        minHeight: spacing.rowHeight,
        borderRadius: radii.row,
        cursor: disabled ? "default" : "pointer",
        backgroundColor: selected ? colors.accentTint : "transparent",
        opacity: disabled ? 0.5 : 1,
        hover:
          selected || disabled
            ? undefined
            : { backgroundColor: hexToRgba(colors.fg, 0.04) },
        ...focusRing,
        ...style,
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={16}
          color={selected ? colors.fg : colors.dim_fg}
        />
      ) : null}
      <T
        size="body"
        color={colors.fg}
        style={{
          flexGrow: 1,
          flexShrink: 1,
          minWidth: 0,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {children}
      </T>
    </div>
  );
}
