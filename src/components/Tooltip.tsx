import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, accentForeground } from "../theme/adwaita";
import { T } from "./common";

export interface TooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
}

export interface TooltipProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  style?: Partial<StyleDesc>;
}

export interface TooltipTriggerProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface TooltipContentProps {
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  style?: Partial<StyleDesc>;
}

const TooltipProviderCtx = createContext<number>(0);

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  delayDuration: number;
  side: "top" | "right" | "bottom" | "left";
}

const TooltipCtx = createContext<TooltipContextValue | null>(null);

function useTooltip(): TooltipContextValue {
  const ctx = useContext(TooltipCtx);
  if (!ctx) throw new Error("Tooltip components must be used within <Tooltip>");
  return ctx;
}

export function TooltipProvider({
  children,
  delayDuration = 0,
}: TooltipProviderProps) {
  return (
    <TooltipProviderCtx.Provider value={delayDuration}>
      <div style={{ display: "flex" }}>{children}</div>
    </TooltipProviderCtx.Provider>
  );
}

export function Tooltip({
  children,
  open,
  onOpenChange,
  defaultOpen,
  delayDuration,
  side,
  style,
}: TooltipProps) {
  const providerDelay = useContext(TooltipProviderCtx);
  const [internal, setInternal] = useState(defaultOpen ?? false);
  const isOpen = open ?? internal;
  const setOpen = (v: boolean) => {
    if (open === undefined) setInternal(v);
    onOpenChange?.(v);
  };
  const delay = delayDuration ?? providerDelay;
  return (
    <TooltipCtx.Provider
      value={{
        open: isOpen,
        setOpen,
        delayDuration: delay,
        side: side ?? "top",
      }}
    >
      <div style={{ display: "flex", position: "relative", ...style }}>
        {children}
      </div>
    </TooltipCtx.Provider>
  );
}

export function TooltipTrigger({ children, style }: TooltipTriggerProps) {
  const { open, setOpen, delayDuration } = useTooltip();
  void open;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openTooltip = () => {
    if (delayDuration > 0) {
      timer.current = setTimeout(() => setOpen(true), delayDuration);
    } else {
      setOpen(true);
    }
  };
  const closeTooltip = () => {
    if (timer.current !== undefined) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
    setOpen(false);
  };
  return (
    <div
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      tabIndex={0}
      onFocus={openTooltip}
      onBlur={closeTooltip}
      style={{ cursor: "pointer", ...style }}
    >
      {children}
    </div>
  );
}

export function TooltipContent({
  children,
  side,
  sideOffset = 4,
  style,
}: TooltipContentProps) {
  const ctx = useTooltip();
  const t = useAdwaita();
  const effectiveSide = side ?? ctx.side;
  if (!ctx.open) return null;

  const bubbleBg = t.colors.osd_bg;
  const bubbleFg = accentForeground(bubbleBg);
  const horizontal = effectiveSide === "left" || effectiveSide === "right";
  const arrowAfter = effectiveSide === "top" || effectiveSide === "left";
  const offset =
    effectiveSide === "top"
      ? { x: 0, y: -sideOffset }
      : effectiveSide === "bottom"
        ? { x: 0, y: sideOffset }
        : effectiveSide === "left"
          ? { x: -sideOffset, y: 0 }
          : { x: sideOffset, y: 0 };

  const arrowSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><rect x="3" y="3" width="6" height="6" rx="1" transform="rotate(45 6 6)" fill="' +
    bubbleBg +
    '"/></svg>';
  const arrowImg = (
    <img
      src={"data:image/svg+xml," + encodeURIComponent(arrowSvg)}
      style={{ width: 12, height: 12, pointerEvents: "none" }}
    />
  );
  return (
    <anchored side={effectiveSide} offset={offset}>
      <div
        style={{
          display: "flex",
          flexDirection: horizontal ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          // Floats over the trigger; must never swallow its events.
          pointerEvents: "none",
        }}
      >
        {arrowAfter ? null : arrowImg}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            paddingLeft: 10,
            paddingRight: 10,
            maxWidth: 240,
            borderRadius: t.radii.button,
            backgroundColor: bubbleBg,
            boxShadow: {
              offsetX: 0,
              offsetY: 2,
              blurRadius: 8,
              spreadRadius: 0,
              color: "rgba(0,0,0,0.35)",
            },
            ...style,
          }}
        >
          {typeof children === "string" ? (
            <T
              size="caption"
              color={bubbleFg}
              align="center"
              style={{ whiteSpace: "normal" }}
            >
              {children}
            </T>
          ) : (
            <>{children}</>
          )}
        </div>
        {arrowAfter ? arrowImg : null}
      </div>
    </anchored>
  );
}
