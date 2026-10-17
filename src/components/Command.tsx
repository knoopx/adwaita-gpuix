import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import {
  MenuLabel,
  MenuRow,
  MenuSeparator,
  MenuShortcut,
  T,
  inputShellStyle,
} from "./common";
import { Icon, type IconName } from "./icons";
import { Dialog, DialogContent } from "./Dialog";

export interface CommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  closeOnSelect?: boolean;
  
  defaultQuery?: string;
  
  anchored?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface CommandInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: Partial<StyleDesc>;
}

export interface CommandListProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface CommandEmptyProps {
  style?: Partial<StyleDesc>;
}

export interface CommandGroupProps {
  label?: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface CommandItemProps {
  label: string;
  icon?: IconName;
  onSelect?: () => void;
  selected?: boolean;
  disabled?: boolean;

  searchTerms?: string;

  shortcut?: string;
  
  trailing?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface CommandShortcutProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface CommandSeparatorProps {
  style?: Partial<StyleDesc>;
}

export interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contained?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

interface CommandContext {
  query: string;
  setQuery: (q: string) => void;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect: boolean;
}

const CommandCtx = createContext<CommandContext | null>(null);

function useCommand(): CommandContext {
  const ctx = useContext(CommandCtx);
  if (!ctx) throw new Error("Command components must be used within <Command>");
  return ctx;
}

function itemMatchesQuery(
  label: string,
  searchTerms: string | undefined,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = `${label} ${searchTerms ?? ""}`.toLowerCase();
  return q
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function Command({
  open,
  onOpenChange,
  closeOnSelect,
  defaultQuery,
  anchored = true,
  children,
  style,
}: CommandProps) {
  const [query, setQuery] = useState(defaultQuery ?? "");
  const t = useAdwaita();
  const { colors, radii } = t;

  if (open === false) return null;

  const panel = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 12,
        minWidth: 320,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        ...style,
      }}
    >
      {children}
    </div>
  );

  return (
    <CommandCtx.Provider
      value={{
        query,
        setQuery,
        onOpenChange,
        closeOnSelect: closeOnSelect ?? true,
      }}
    >
      {anchored ? (
        <anchored side="bottom" offset={{ x: 0, y: 4 }}>
          {panel}
        </anchored>
      ) : (
        panel
      )}
    </CommandCtx.Provider>
  );
}

export function CommandInput({
  value,
  onChange,
  placeholder,
  style,
}: CommandInputProps) {
  const { query, setQuery } = useCommand();
  const t = useAdwaita();
  const { colors, typography } = t;

  return (
    <div style={inputShellStyle(t, style)}>
      <Icon
        name="search"
        size={14}
        color={colors.dim_fg}
        style={{ pointerEvents: "none" }}
      />
      <input
        value={value ?? query}
        placeholder={placeholder ?? "Type a command…"}
        onChange={(event) => {
          const v = event.value ?? "";
          setQuery(v);
          onChange?.(v);
        }}
        style={{
          flexGrow: 1,
          fontSize: typography.body,
          fontFamily: typography.fontFamily,
          color: colors.fg,
        }}
      />
    </div>
  );
}

export function CommandList({ children, style }: CommandListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <virtual-list
        estimatedItemHeight={36}
        style={{ maxHeight: 240, width: "100%" }}
      >
        {children}
      </virtual-list>
    </div>
  );
}

export function CommandEmpty({ style }: CommandEmptyProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: 16,
        ...style,
      }}
    >
      <Icon
        name="search"
        size={20}
        color={t.colors.dim_fg}
        style={{ pointerEvents: "none" }}
      />
      <T size="body" color={t.colors.dim_fg}>
        No results found.
      </T>
    </div>
  );
}

export function CommandGroup({ label, children, style }: CommandGroupProps) {
  const { query } = useCommand();
  const active = query.trim().length > 0;
  const visible = Children.toArray(children).filter((child) => {
    if (!isValidElement<CommandItemProps>(child)) return true;
    return itemMatchesQuery(child.props.label, child.props.searchTerms, query);
  });
  if (active && visible.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, ...style }}>
      {label ? (
        <MenuLabel style={{ padding: 4, paddingBottom: 2 }}>{label}</MenuLabel>
      ) : null}
      {visible}
    </div>
  );
}

export function CommandItem({
  label,
  icon,
  onSelect,
  selected,
  disabled,
  searchTerms,
  shortcut,
  trailing,
  style,
}: CommandItemProps) {
  const { query, onOpenChange, closeOnSelect } = useCommand();
  const t = useAdwaita();
  const { colors } = t;

  if (!itemMatchesQuery(label, searchTerms, query)) return null;

  return (
    <div
      style={{ minHeight: 36, display: "flex", alignItems: "center", ...style }}
    >
      <MenuRow
        label={label}
        leading={
          icon ? (
            <Icon
              name={icon}
              size={14}
              color={colors.dim_fg}
              style={{ pointerEvents: "none" }}
            />
          ) : null
        }
        disabled={disabled}
        onClick={() => {
          onSelect?.();
          if (closeOnSelect) onOpenChange?.(false);
        }}
        trailing={
          trailing ??
          (shortcut ? (
            <MenuShortcut>{shortcut}</MenuShortcut>
          ) : selected ? (
            <Icon
              name="success"
              size={12}
              color={colors.accent}
              style={{ pointerEvents: "none" }}
            />
          ) : null)
        }
        style={{
          justifyContent: "space-between",
          backgroundColor: selected ? colors.accentTint : "transparent",
        }}
      />
    </div>
  );
}

export function CommandShortcut({ children, style }: CommandShortcutProps) {
  return <MenuShortcut style={style}>{children}</MenuShortcut>;
}

export function CommandSeparator({ style }: CommandSeparatorProps) {
  return <MenuSeparator style={style} />;
}

export function CommandDialog({
  open,
  onOpenChange,
  contained,
  children,
  style,
}: CommandDialogProps) {
  return (
    <Dialog
      open={open ?? false}
      onOpenChange={onOpenChange ?? (() => {})}
      contained={contained ?? true}
    >
      <DialogContent showCloseButton={false} style={style}>
        <Command open={open} onOpenChange={onOpenChange} closeOnSelect>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
