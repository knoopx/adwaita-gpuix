import type { StyleDesc } from "@gpuix/react";
import { Globe, FlaskConical, TerminalSquare } from "lucide-static";
import { renderIconSvg } from "../../components/icons";

export type GlyphName = "terminal" | "flask" | "globe";

const GLYPHS: Record<GlyphName, string> = {
  terminal: TerminalSquare,
  flask: FlaskConical,
  globe: Globe,
};

export interface GlyphProps {
  name: GlyphName;
  size?: number;
  color: string;
  style?: Partial<StyleDesc>;
}

export function Glyph({ name, size = 14, color, style }: GlyphProps) {
  return renderIconSvg(GLYPHS[name], color, size, style);
}
