import { Children, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./common";
import { BoxedList } from "./BoxedList";

export interface PreferencesGroupProps {
  title: string;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function PreferencesGroup({
  title,
  children,
  style,
}: PreferencesGroupProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.gap,
        ...style,
      }}
    >
      <T size="title4" weight={600} color={colors.dim_fg}>
        {title}
      </T>
      <BoxedList>{children}</BoxedList>
    </div>
  );
}

export interface PreferencesPageProps {
  children: ReactNode;
  
  scrollable?: boolean;
  
  estimatedItemHeight?: number;
  style?: Partial<StyleDesc>;
}

export function PreferencesPage({
  children,
  scrollable = false,
  estimatedItemHeight,
  style,
}: PreferencesPageProps) {
  const t = useAdwaita();
  const { spacing } = t;
  const items = Children.toArray(children);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.paddingTight,
        padding: spacing.padding,
        ...(scrollable ? { flexGrow: 1, minHeight: 0 } : {}),
        ...style,
      }}
    >
      {scrollable ? (
        <virtual-list
          estimatedItemHeight={estimatedItemHeight ?? spacing.rowHeight}
          style={{ flexGrow: 1, minHeight: 0 }}
        >
          {items.map((child, i) => (
            <div
              key={i}
              style={
                i < items.length - 1
                  ? { marginBottom: spacing.paddingTight }
                  : undefined
              }
            >
              {child}
            </div>
          ))}
        </virtual-list>
      ) : (
        children
      )}
    </div>
  );
}
