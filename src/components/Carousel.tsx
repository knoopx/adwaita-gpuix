import {
  Children,
  createContext,
  useCallback,
  useContext,
  isValidElement,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { Icon } from "./icons";

interface CarouselContextValue {
  offset: number;
  setOffset: (offset: number) => void;
  count: number;
  visible: number;
  canPrev: boolean;
  canNext: boolean;
}

const CarouselCtx = createContext<CarouselContextValue | null>(null);

function useCarousel(): CarouselContextValue {
  const ctx = useContext(CarouselCtx);
  if (!ctx) throw new Error("useCarousel() must be used within a <Carousel />");
  return ctx;
}

export interface CarouselProps {
  children: ReactNode;

  
  visible?: number;

  
  defaultOffset?: number;
  style?: Partial<StyleDesc>;
}

export function Carousel({
  children,
  visible = 3,
  defaultOffset = 0,
  style,
}: CarouselProps) {
  const t = useAdwaita();
  const { spacing } = t;
  const [offset, setOffsetRaw] = useState(defaultOffset);

  const all = Children.toArray(children);
  const itemChildren = all.filter(
    (c) => isValidElement(c) && c.type === CarouselItem,
  );
  const controlChildren = all.filter(
    (c) => !(isValidElement(c) && c.type === CarouselItem),
  );
  const dotChildren = controlChildren.filter(
    (c) => isValidElement(c) && c.type === CarouselDots,
  );
  const inlineControls = controlChildren.filter(
    (c) => !(isValidElement(c) && c.type === CarouselDots),
  );
  const count = itemChildren.length;

  const setOffset = useCallback(
    (next: number) => {
      setOffsetRaw(Math.max(0, Math.min(next, Math.max(count - visible, 0))));
    },
    [count, visible],
  );

  const clampedOffset = Math.min(offset, Math.max(count - visible, 0));
  const canPrev = clampedOffset > 0;
  const canNext = clampedOffset + visible < count;

  const windowItems = itemChildren.slice(
    clampedOffset,
    clampedOffset + visible,
  );

  const value = useMemo(
    () => ({
      offset: clampedOffset,
      setOffset,
      count,
      visible,
      canPrev,
      canNext,
    }),
    [clampedOffset, setOffset, count, visible, canPrev, canNext],
  );

  return (
    <CarouselCtx.Provider value={value}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.gap,
          ...style,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.paddingTight,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: spacing.paddingTight,
              flexGrow: 1,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {windowItems}
          </div>
          {inlineControls}
        </div>
        {dotChildren.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {dotChildren}
          </div>
        ) : null}
      </div>
    </CarouselCtx.Provider>
  );
}

interface CarouselNavProps {
  style?: Partial<StyleDesc>;
}

function CarouselNavButton({
  direction,
  style,
}: CarouselNavProps & { direction: "prev" | "next" }) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const { offset, setOffset, visible, canPrev, canNext } = useCarousel();
  const enabled = direction === "prev" ? canPrev : canNext;
  return (
    <div
      onClick={
        enabled
          ? () =>
              setOffset(
                direction === "prev" ? offset - visible : offset + visible,
              )
          : undefined
      }
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        flexShrink: 0,
        borderRadius: radii.pill,
        backgroundColor: colors.button_bg,
        cursor: enabled ? "pointer" : "default",
        opacity: enabled ? 1 : 0.4,
        ...(enabled
          ? {
              hover: { backgroundColor: colors.button_hover },
              active: { backgroundColor: colors.button_active },
            }
          : {}),
        ...style,
      }}
    >
      <Icon
        name={direction === "prev" ? "chevronLeft" : "chevronRight"}
        size={16}
        color={colors.fg}
      />
    </div>
  );
}

export function CarouselPrevious({ style }: CarouselNavProps) {
  return <CarouselNavButton direction="prev" style={style} />;
}

export function CarouselNext({ style }: CarouselNavProps) {
  return <CarouselNavButton direction="next" style={style} />;
}

export interface CarouselDotsProps {
  style?: Partial<StyleDesc>;
}


export function CarouselDots({ style }: CarouselDotsProps) {
  const t = useAdwaita();
  const { colors } = t;
  const { offset, setOffset, count, visible } = useCarousel();
  if (count === 0) return null;
  const pages = Math.max(1, count - visible + 1);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        ...style,
      }}
    >
      {Array.from({ length: pages }, (_, i) => {
        const active = i === offset;
        return (
          <div
            key={i}
            onClick={active ? undefined : () => setOffset(i)}
            style={{
              width: active ? 16 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: active ? colors.accent : colors.border,
              cursor: active ? "default" : "pointer",
              ...(active
                ? {}
                : { hover: { backgroundColor: colors.accentTint } }),
            }}
          />
        );
      })}
    </div>
  );
}

export interface CarouselItemProps {
  children: ReactNode;
  width?: number;
  style?: Partial<StyleDesc>;
}

export function CarouselItem({
  children,
  width = 200,
  style,
}: CarouselItemProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.gap,
        width,
        flexShrink: 0,
        padding: spacing.paddingTight,
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
}
