import {
  type ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { type StyleDesc } from "@gpuix/react";
import {
  type AdwaitaTheme,
  accentForeground,
  useAdwaita,
} from "../theme/adwaita";
import { T } from "./text";

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

type TooltipSide = "top" | "right" | "bottom" | "left";

const SIDE_OFFSET: Record<
  TooltipSide,
  (offset: number) => { x: number; y: number }
> = {
  top: (offset) => ({ x: 0, y: -offset }),
  bottom: (offset) => ({ x: 0, y: offset }),
  left: (offset) => ({ x: -offset, y: 0 }),
  right: (offset) => ({ x: offset, y: 0 }),
};

const SIDE_ARROW_AFTER: Record<TooltipSide, boolean> = {
  top: true,
  left: true,
  bottom: false,
  right: false,
};

const SIDE_FLEX_DIRECTION: Record<TooltipSide, "row" | "column"> = {
  top: "column",
  bottom: "column",
  left: "row",
  right: "row",
};

const TOOLTIP_ARROW_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><rect x="3" y="3" width="6" height="6" rx="1" transform="rotate(45 6 6)" fill="';
const TOOLTIP_ARROW_SVG_END = '"/></svg>';

function tooltipArrowImg(bubbleBg: string) {
  return (
    <img
      src={
        "data:image/svg+xml," +
        encodeURIComponent(TOOLTIP_ARROW_SVG + bubbleBg + TOOLTIP_ARROW_SVG_END)
      }
      style={{ width: 12, height: 12, pointerEvents: "none" }}
    />
  );
}

function tooltipBubbleStyle(t: AdwaitaTheme): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 4,
    paddingLeft: 10,
    paddingRight: 10,
    maxWidth: 240,
    borderRadius: t.radius.sm,
    backgroundColor: t.color.surface.osd,
    boxShadow: {
      offsetX: 0,
      offsetY: 2,
      blurRadius: 8,
      spreadRadius: 0,
      color: "rgba(0,0,0,0.35)",
    },
  };
}

function TooltipBubbleContent({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  if (typeof children !== "string") return <>{children}</>;
  return (
    <T
      size="caption"
      color={color}
      align="center"
      style={{ whiteSpace: "normal" }}
    >
      {children}
    </T>
  );
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

  const bubbleFg = accentForeground(t.color.surface.osd);
  const arrowImg = tooltipArrowImg(t.color.surface.osd);
  const arrowAfter = SIDE_ARROW_AFTER[effectiveSide];
  return (
    <anchored
      side={effectiveSide}
      offset={SIDE_OFFSET[effectiveSide](sideOffset)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: SIDE_FLEX_DIRECTION[effectiveSide],
          alignItems: "center",
          justifyContent: "center",
          gap: 2,

          pointerEvents: "none",
        }}
      >
        {arrowAfter ? null : arrowImg}
        <div style={{ ...tooltipBubbleStyle(t), ...style }}>
          <TooltipBubbleContent color={bubbleFg}>
            {children}
          </TooltipBubbleContent>
        </div>
        {arrowAfter ? arrowImg : null}
      </div>
    </anchored>
  );
}
