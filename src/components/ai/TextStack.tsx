import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T, type TextSize } from "../text";

export interface TextStackProps {
  title: ReactNode;
  description?: ReactNode;
  titleSize?: TextSize;
  titleWeight?: string | number;
  descriptionSize?: TextSize;
  descriptionColor?: string;
  gap?: number;

  pointerEvents?: "auto" | "none";
  style?: Partial<StyleDesc>;
}

export function TextStack({
  title,
  description,
  titleSize = "body",
  titleWeight,
  descriptionSize = "caption",
  descriptionColor,
  gap = 4,
  pointerEvents,
  style,
}: TextStackProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        ...(pointerEvents === undefined ? {} : { pointerEvents }),
        ...style,
      }}
    >
      <T size={titleSize} weight={titleWeight} color={t.color.text.primary}>
        {title}
      </T>
      {description ? (
        <T size={descriptionSize} color={descriptionColor ?? t.color.text.dim}>
          {description}
        </T>
      ) : null}
    </div>
  );
}
