import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";

export interface DisclosureSectionProps {
  title: ReactNode;
  gap?: number;
  titleStyle?: Partial<StyleDesc>;
  style?: Partial<StyleDesc>;
  children?: ReactNode;
}

export function DisclosureSection({
  title,
  gap = 4,
  titleStyle,
  style,
  children,
}: DisclosureSectionProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        minWidth: 0,
        ...style,
      }}
    >
      <T
        size="caption"
        weight={600}
        color={t.color.text.dim}
        style={titleStyle}
      >
        {title}
      </T>
      {children}
    </div>
  );
}
