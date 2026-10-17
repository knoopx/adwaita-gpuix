import { createContext, useContext, Children, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba } from "../theme/adwaita";
import { Icon } from "./icons";
import { DisclosureContent } from "./common";

export interface AccordionProps {
  type?: "single" | "multiple";
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

interface AccordionContextValue {
  type: "single" | "multiple";
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
}

const AccordionCtx = createContext<AccordionContextValue | null>(null);

function useAccordion(): AccordionContextValue {
  const ctx = useContext(AccordionCtx);
  return ctx ?? { type: "single", value: "", onValueChange: () => {} };
}

const ItemLastCtx = createContext(false);

interface AccordionItemContextValue {
  itemValue: string;
  isOpen: boolean;
  disabled: boolean;
  onToggle: () => void;
}

const AccordionItemCtx = createContext<AccordionItemContextValue | null>(null);

function useAccordionItem(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemCtx);
  return (
    ctx ?? { itemValue: "", isOpen: false, disabled: false, onToggle: () => {} }
  );
}

export function Accordion({
  type = "single",
  value,
  onValueChange,
  children,
  style,
}: AccordionProps) {
  const items = Children.toArray(children);
  return (
    <AccordionCtx.Provider value={{ type, value, onValueChange }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          ...style,
        }}
      >
        {items.map((child, i) => (
          <ItemLastCtx.Provider
            key={`accordion-item-${i}`}
            value={i === items.length - 1}
          >
            {child}
          </ItemLastCtx.Provider>
        ))}
      </div>
    </AccordionCtx.Provider>
  );
}

export interface AccordionItemProps {
  value: string;

  disabled?: boolean;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function AccordionItem({
  value,
  disabled,
  children,
  style,
}: AccordionItemProps) {
  const acc = useAccordion();
  const isLast = useContext(ItemLastCtx);
  const t = useAdwaita();
  const multiple = acc.type === "multiple";

  const openList = multiple
    ? Array.isArray(acc.value)
      ? acc.value
      : acc.value
        ? [acc.value]
        : []
    : [];
  const isOpen = multiple ? openList.includes(value) : acc.value === value;
  const onToggle = () => {
    if (disabled) return;
    if (multiple) {
      const next = isOpen
        ? openList.filter((v) => v !== value)
        : [...openList, value];
      acc.onValueChange(next);
    } else {
      acc.onValueChange(isOpen ? "" : value);
    }
  };
  return (
    <AccordionItemCtx.Provider
      value={{
        itemValue: value,
        isOpen,
        disabled: disabled ?? false,
        onToggle,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          ...(isLast
            ? {}
            : {
                borderBottomWidth: 1,
                borderColor: t.colors.border,
              }),
          ...style,
        }}
      >
        {children}
      </div>
    </AccordionItemCtx.Provider>
  );
}

export interface AccordionTriggerProps {
  children: ReactNode;
  open?: boolean;
  onToggle?: () => void;
  style?: Partial<StyleDesc>;
}

export function AccordionTrigger({
  children,
  open,
  onToggle,
  style,
}: AccordionTriggerProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const item = useAccordionItem();
  const isOpen = open ?? item.isOpen;
  const handleToggle = item.disabled ? undefined : (onToggle ?? item.onToggle);
  return (
    <div
      onClick={handleToggle}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleToggle?.();
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.gap,
        flexGrow: 1,

        minHeight: 36,
        borderRadius: radii.row,

        paddingLeft: spacing.paddingTight,
        paddingRight: spacing.gap,
        paddingTop: spacing.gap,
        paddingBottom: spacing.gap,
        cursor: item.disabled ? "default" : "pointer",

        opacity: item.disabled ? 0.5 : 1,
        pointerEvents: item.disabled ? "none" : "auto",

        hover: { backgroundColor: hexToRgba(colors.fg, 0.04) },
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        {children}
      </div>
      <Icon
        name={isOpen ? "chevronUp" : "chevronDown"}
        size={16}
        color={colors.dim_fg}
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}

export interface AccordionContentProps {
  children: ReactNode;
  open?: boolean;
  style?: Partial<StyleDesc>;
}

export function AccordionContent({
  children,
  open,
  style,
}: AccordionContentProps) {
  const item = useAccordionItem();
  return (
    <DisclosureContent open={open ?? item.isOpen} style={style}>
      {children}
    </DisclosureContent>
  );
}
