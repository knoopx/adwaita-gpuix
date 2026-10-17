import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./common";

export interface DescriptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Description({ children, style }: DescriptionProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <T size="body" color={colors.dim_fg} style={style}>
      {children}
    </T>
  );
}


