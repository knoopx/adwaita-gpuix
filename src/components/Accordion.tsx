import { Children, type ReactNode, createContext, useContext } from "react";
import { type StyleDesc } from "@gpuix/react";
import { hexToRgba, useAdwaita } from "../theme/adwaita";
import { Icon } from "./icons";
import { DisclosureContent } from "./Collapsible";
import { groupCardStyle } from "./BoxedList";
import { isActivateKey } from "../lib/roving";

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
  const t = useAdwaita();
  const items = Children.toArray(children);
  return (
    <AccordionCtx.Provider value={{ type, value, onValueChange }}>
      <div
        style={groupCardStyle(t, {
          width: "100%",
          ...style,
        })}
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
                borderBottomWidth: t.control.dividerThickness,
                borderColor: t.color.divider.faint,
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
  const item = useAccordionItem();
  const isOpen = open ?? item.isOpen;
  const handleToggle = item.disabled ? undefined : (onToggle ?? item.onToggle);
  return (
    <div
      onClick={handleToggle}
      tabIndex={0}
      onKeyDown={(event) => {
        if (isActivateKey(event.key, { space: true })) handleToggle?.();
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
        flexGrow: 1,

        minHeight: t.control.rowHeight,
        borderRadius: t.radius.sm,

        paddingLeft: t.control.groupRowInset,
        paddingRight: t.control.groupRowInset,
        paddingTop: t.space.sm,
        paddingBottom: t.space.sm,
        cursor: item.disabled ? "default" : "pointer",

        opacity: item.disabled ? 0.5 : 1,
        pointerEvents: item.disabled ? "none" : "auto",

        hover: { backgroundColor: t.color.surface.hover },
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
        color={t.color.text.dim}
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
  const t = useAdwaita();
  return (
    <DisclosureContent
      open={open ?? item.isOpen}
      style={{
        paddingLeft: t.control.groupRowInset,
        paddingRight: t.control.groupRowInset,
        paddingBottom: t.space.md,
        ...style,
      }}
    >
      {children}
    </DisclosureContent>
  );
}
