import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";

export interface DescriptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Description({ children, style }: DescriptionProps) {
  const t = useAdwaita();
  return (
    <T size="body" color={t.color.text.dim} style={style}>
      {children}
    </T>
  );
}
