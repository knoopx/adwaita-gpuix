import { type StyleDesc } from "@gpuix/react";
import { iconSvg, renderIconSvg, type IconName } from "../../components/icons";

export type GlyphName = IconName;

export function glyphSvg(name: string): string {
  return iconSvg(name);
}

export interface GlyphProps {
  name: GlyphName;
  size?: number;
  color: string;
  style?: Partial<StyleDesc>;
}

export function Glyph({ name, size = 14, color, style }: GlyphProps) {
  return renderIconSvg(glyphSvg(name), color, size, style);
}
