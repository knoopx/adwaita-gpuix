import { createContext, useContext, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba } from "../theme/adwaita";
import { FloatingPanel, TextPart } from "./common";

export interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
}

export interface PopoverTriggerProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface PopoverContentProps {
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  style?: Partial<StyleDesc>;
}

export interface PopoverAnchorProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface PopoverHeaderProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface PopoverTitleProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface PopoverDescriptionProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

interface PopoverContext {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PopoverCtx = createContext<PopoverContext | null>(null);

function usePopover(): PopoverContext {
  const ctx = useContext(PopoverCtx);
  if (!ctx) throw new Error("Popover components must be used within <Popover>");
  return ctx;
}

export function Popover({ open, onOpenChange, children }: PopoverProps) {
  return (
    <PopoverCtx.Provider value={{ open, onOpenChange }}>
      {children}
    </PopoverCtx.Provider>
  );
}

export function PopoverTrigger({ children, style }: PopoverTriggerProps) {
  const { onOpenChange } = usePopover();
  const t = useAdwaita();
  return (
    <div
      onClick={() => onOpenChange(true)}
      style={{
        cursor: "pointer",
        borderRadius: t.radii.row,
        hover: { backgroundColor: hexToRgba(t.colors.fg, 0.08) },
        active: { backgroundColor: hexToRgba(t.colors.fg, 0.16) },
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PopoverContent({
  children,
  side = "bottom",
  sideOffset = 8,
  style,
}: PopoverContentProps) {
  const { open } = usePopover();

  if (!open) return null;

  return (
    <FloatingPanel
      side={side}
      sideOffset={sideOffset}
      padding={8}
      gap={8}
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

export function PopoverAnchor({ children, style }: PopoverAnchorProps) {
  return (
    <div style={{ position: "relative", display: "flex", ...style }}>
      {children}
    </div>
  );
}

export function PopoverHeader({ children, style }: PopoverHeaderProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      {children}
    </div>
  );
}

export function PopoverTitle({ children, style }: PopoverTitleProps) {
  return (
    <TextPart size="title3" weight={600} style={style}>
      {children}
    </TextPart>
  );
}

export function PopoverDescription({
  children,
  style,
}: PopoverDescriptionProps) {
  return (
    <TextPart dim style={style}>
      {children}
    </TextPart>
  );
}
