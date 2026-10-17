import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";

export interface AspectRatioProps {
  
  ratio: number;
  
  width?: number;
  
  height?: number;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}


export function AspectRatio({
  ratio,
  width,
  height,
  children,
  style,
}: AspectRatioProps) {
  let w: number | "100%";
  let h: number | "100%";
  if (width !== undefined && height !== undefined) {
    w = width;
    h = height;
  } else if (width !== undefined) {
    w = width;
    h = Math.round(width / ratio);
  } else if (height !== undefined) {
    w = Math.round(height * ratio);
    h = height;
  } else {
    w = "100%";
    h = "100%";
  }
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
