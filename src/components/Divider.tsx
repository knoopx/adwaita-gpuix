import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type EventPayload,
  type PublicInstance,
  type StyleDesc,
  useGpuixRequired,
  useWindowSize,
} from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";

export type DividerTone = "faint" | "default" | "strong";
export type DividerOrientation = "horizontal" | "vertical";

interface DividerGroupContextValue {
  orientation: DividerOrientation;

  extent: number | null;
  sizes: number[];
  panelCount: number;
  dragging: boolean;
  registerPanel: (cfg: {
    min: number;
    max: number;
    defaultSize: number;
  }) => number;
  unregisterPanel: (index: number) => void;
  setPanelSize: (index: number, size: number) => void;
  startDrag: (index: number, event: EventPayload) => void;
  endDrag: () => void;
}

const DividerGroupCtx = createContext<DividerGroupContextValue | null>(null);

export function useDividerGroup(): DividerGroupContextValue | null {
  return useContext(DividerGroupCtx);
}

const t_controlMin = 120;
const t_controlMax = 900;

interface DragState {
  index: number;
  startCoord: number;
  startSize: number;
  min: number;
  max: number;
}

export interface DividerGroupProps {
  orientation?: DividerOrientation;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function DividerGroup({
  orientation = "horizontal",
  children,
  style,
}: DividerGroupProps) {
  const vertical = orientation === "vertical";
  const renderer = useGpuixRequired();
  const { width: winW, height: winH } = useWindowSize();
  const containerRef = useRef<PublicInstance>(null);
  const [extent, setExtent] = useState<number | null>(null);

  const measureExtent = (): number | null => {
    const el = containerRef.current;
    if (!el) return null;
    const b = renderer.getElementBounds?.(el.id) ?? null;
    if (!b) return null;
    const px = vertical ? b.height : b.width;
    return px && px > 0 ? px : null;
  };

  useEffect(() => {
    setExtent(measureExtent());
  }, [renderer, winW, winH]);
  const [sizes, setSizes] = useState<number[]>([]);
  const [panelCount, setPanelCount] = useState(0);
  const [drag, setDrag] = useState<DragState | null>(null);
  const panelsRef = useRef<{ min: number; max: number; defaultSize: number }[]>(
    [],
  );

  const registerPanel = (cfg: {
    min: number;
    max: number;
    defaultSize: number;
  }): number => {
    panelsRef.current.push(cfg);
    setPanelCount(panelsRef.current.length);
    return panelsRef.current.length - 1;
  };

  const unregisterPanel = (index: number) => {
    panelsRef.current = panelsRef.current.filter((_, i) => i !== index);
    setPanelCount(panelsRef.current.length);
  };

  const setPanelSize = (index: number, size: number) => {
    setSizes((prev) => {
      const next = [...prev];
      while (next.length <= index) next.push(0);
      next[index] = size;
      return next;
    });
  };

  const startDrag = (index: number, event: EventPayload) => {
    const measured = measureExtent();
    if (measured != null) setExtent(measured);
    const cfg = panelsRef.current[index];
    const panel = cfg ?? {
      min: t_controlMin,
      max: t_controlMax,
      defaultSize: 0,
    };
    setDrag({
      index,
      startCoord: (vertical ? event.y : event.x) ?? 0,
      startSize: sizes[index] || cfg?.defaultSize || 0,
      min: panel.min,
      max: panel.max,
    });
  };

  const endDrag = () => setDrag(null);

  const onMove = (event: EventPayload) => {
    if (drag === null) return;
    const coord = (vertical ? event.y : event.x) ?? drag.startCoord;

    const layout = vertical ? winH : winW;
    const scale = extent && extent > 0 && layout > 0 ? layout / extent : 1;
    const next = Math.max(
      drag.min,
      Math.min(drag.max, drag.startSize + (coord - drag.startCoord) * scale),
    );
    setPanelSize(drag.index, next);
  };

  const ctxValue: DividerGroupContextValue = {
    orientation,
    extent,
    sizes,
    panelCount,
    dragging: drag !== null,
    registerPanel,
    unregisterPanel,
    setPanelSize,
    startDrag,
    endDrag,
  };

  return (
    <DividerGroupCtx.Provider value={ctxValue}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          ...style,
        }}
      >
        {children}
        {drag !== null ? (
          <div
            onMouseMove={onMove}
            onMouseUp={endDrag}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              cursor: vertical ? "row-resize" : "col-resize",
            }}
          />
        ) : null}
      </div>
    </DividerGroupCtx.Provider>
  );
}

export interface DividerPanelProps {
  children?: ReactNode;
  min?: number;
  max?: number;
  defaultSize?: number;
  style?: Partial<StyleDesc>;
}

function paneStyle(args: {
  isLast: boolean;
  vertical: boolean;
  size: number;
  pointerEvents: "none" | undefined;
  style?: Partial<StyleDesc>;
}): Partial<StyleDesc> {
  const { isLast, vertical, size, pointerEvents, style } = args;
  if (isLast)
    return {
      display: "flex",
      flexGrow: 1,
      pointerEvents,
      ...(vertical ? { minHeight: 0 } : { minWidth: 0 }),
      ...style,
    };
  const crossAxis = vertical ? { height: size } : { width: size };
  return {
    display: "flex",
    ...crossAxis,
    flexShrink: 0,
    pointerEvents,
    ...style,
  };
}

export function DividerPanel({
  children,
  min = t_controlMin,
  max = t_controlMax,
  defaultSize = 0,
  style,
}: DividerPanelProps) {
  const ctx = useContext(DividerGroupCtx);
  if (ctx === null)
    throw new Error("DividerPanel must be used inside <DividerGroup>");
  const vertical = ctx.orientation === "vertical";

  const indexRef = useRef(-1);
  const cfgRef = useRef({ min, max, defaultSize });
  cfgRef.current = { min, max, defaultSize };

  useEffect(() => {
    const index = ctx.registerPanel(cfgRef.current);
    indexRef.current = index;
    return () => ctx.unregisterPanel(index);
  }, []);

  const index = indexRef.current;

  return (
    <div
      style={paneStyle({
        isLast: index === ctx.panelCount - 1,
        vertical,
        size: ctx.sizes[index] || defaultSize,
        pointerEvents: ctx.dragging ? "none" : undefined,
        style,
      })}
    >
      {children}
    </div>
  );
}

export interface DividerProps {
  orientation?: DividerOrientation;
  tone?: DividerTone;
  thickness?: number;
  length?: number | "full";
  inset?: number;
  insetStart?: number;
  insetEnd?: number;
  resize?: number;
  style?: Partial<StyleDesc>;
}

const TONE_FILL: Record<DividerTone, (t: AdwaitaTheme) => string> = {
  faint: (t) => t.color.divider.faint,
  default: (t) => t.color.border.default,
  strong: (t) => t.color.divider.strong,
};

interface DividerGeometry {
  vertical: boolean;
  resizable: boolean;
  px: number;
  hit: number;
  full: boolean;
  span: number | undefined;
  start: number;
  end: number;
}

function ruleStyle(g: DividerGeometry): Partial<StyleDesc> {
  const cross = g.resizable ? g.hit : g.px;

  if (g.full)
    return {
      ...(g.vertical ? { width: cross } : { height: cross }),
      alignSelf: "stretch" as const,
      flexGrow: 0,
      flexShrink: 0,
      ...(g.vertical
        ? { marginTop: g.start, marginBottom: g.end }
        : { marginLeft: g.start, marginRight: g.end }),
    };
  if (g.vertical)
    return {
      width: cross,
      height: g.span,
      flexGrow: 0,
      flexShrink: 0,
      marginTop: g.start,
      marginBottom: g.end,
    };
  return {
    width: g.span,
    height: cross,
    flexGrow: 0,
    flexShrink: 0,
    marginLeft: g.start,
    marginRight: g.end,
  };
}

function paintStyle(
  g: DividerGeometry,
  t: AdwaitaTheme,
  dragging: boolean,
  fill: string,
): Partial<StyleDesc> {
  if (!g.resizable) return { backgroundColor: fill };

  return {
    backgroundColor: "transparent",
    hover: { backgroundColor: t.color.selection.faint },
    active: { backgroundColor: t.color.selection.faint },
    cursor: g.vertical ? "col-resize" : "row-resize",
  };
}

function innerRuleStyle(
  g: DividerGeometry,
  t: AdwaitaTheme,
  dragging: boolean,
  fill: string,
): Partial<StyleDesc> {
  const colour = fill;
  const px = g.px;
  const rule = g.vertical
    ? { width: px, height: g.full ? "100%" : g.span }
    : { height: px, width: g.full ? "100%" : g.span };
  return {
    ...rule,
    backgroundColor: colour,
    flexShrink: 0,
    pointerEvents: "none",
  };
}

function hitAreaStyle(g: DividerGeometry): Partial<StyleDesc> {
  if (!g.resizable) return {};
  const centre = {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
  const fill = g.full ? { alignSelf: "stretch" as const } : {};
  return g.vertical
    ? { ...centre, ...fill, flexDirection: "row", width: g.hit }
    : { ...centre, ...fill, flexDirection: "column", height: g.hit };
}

export function Divider({
  orientation = "horizontal",
  tone = "default",
  thickness,
  length = "full",
  inset = 0,
  insetStart,
  insetEnd,
  resize,
  style,
}: DividerProps) {
  const t = useAdwaita();
  const group = useDividerGroup();

  const resizable = resize !== undefined && group !== null;
  const dragging = group !== null && group.dragging;
  const geometry: DividerGeometry = {
    vertical: orientation === "vertical",
    resizable,
    px: thickness ?? t.control.dividerThickness,
    hit: t.control.dividerHandleWidth,
    full: length === "full",
    span: length === "full" ? undefined : length,
    start: insetStart ?? inset,
    end: insetEnd ?? inset,
  };

  return (
    <div
      onMouseDown={
        resizable && group !== null
          ? (e: EventPayload) => group.startDrag(resize!, e)
          : undefined
      }
      style={{
        flexShrink: 0,
        pointerEvents: resizable ? "auto" : "none",
        ...hitAreaStyle(geometry),
        ...paintStyle(geometry, t, dragging, TONE_FILL[tone](t)),
        ...ruleStyle(geometry),
        ...style,
      }}
    >
      {resizable ? (
        <div
          style={innerRuleStyle(geometry, t, dragging, TONE_FILL[tone](t))}
        />
      ) : null}
    </div>
  );
}
