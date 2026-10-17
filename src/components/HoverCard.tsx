import { createContext, useContext, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba } from "../theme/adwaita";
import { FloatingPanel } from "./common";

export interface HoverCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface HoverCardTriggerProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface HoverCardContentProps {
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  style?: Partial<StyleDesc>;
}

interface HoverCardContext {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HoverCardCtx = createContext<HoverCardContext | null>(null);

function useHoverCard(): HoverCardContext {
  const ctx = useContext(HoverCardCtx);
  if (!ctx)
    throw new Error("HoverCard components must be used within <HoverCard>");
  return ctx;
}

export function HoverCard({ open, onOpenChange, children, style }: HoverCardProps) {
  return (
    <HoverCardCtx.Provider value={{ open, onOpenChange }}>
      <div style={{ display: "flex", position: "relative", ...style }}>
        {children}
      </div>
    </HoverCardCtx.Provider>
  );
}

export function HoverCardTrigger({ children, style }: HoverCardTriggerProps) {
  const { onOpenChange } = useHoverCard();
  const t = useAdwaita();
  return (
    <div
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
      style={{
        cursor: "pointer",
        borderRadius: t.radii.row,
        hover: { backgroundColor: hexToRgba(t.colors.fg, 0.08) },
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function HoverCardContent({
  children,
  side = "bottom",
  sideOffset = 8,
  style,
}: HoverCardContentProps) {
  const { open } = useHoverCard();

  if (!open) return null;

  return (
    <FloatingPanel
      side={side}
      sideOffset={sideOffset}
      padding={8}
      gap={8}
      minWidth={200}
      style={{
        boxShadow: {
          offsetX: 0,
          offsetY: 4,
          blurRadius: 16,
          spreadRadius: 0,
          color: "rgba(0,0,0,0.35)",
        },
        ...style,
      }}
    >
      {children}
    </FloatingPanel>
  );
}
