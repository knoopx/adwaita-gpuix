import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { CollapsibleContent } from "../../components/Collapsible";
import { useAdwaita } from "../../theme/adwaita";

export interface DisclosureBodyProps {
  open?: boolean;
  gap?: number;
  inset?: Partial<StyleDesc>;
  bodyStyle?: Partial<StyleDesc>;
  flush?: boolean;

  indent?: boolean;
  maxHeight?: number;
  style?: Partial<StyleDesc>;
  children?: ReactNode;
}

export function DisclosureBody({
  open,
  gap,
  inset,
  bodyStyle,
  flush,
  indent = false,
  maxHeight,
  style,
  children,
}: DisclosureBodyProps) {
  const t = useAdwaita();
  const insetStyle: Partial<StyleDesc> = indent
    ? { paddingTop: 4, paddingLeft: t.space.md, minWidth: 0 }
    : {};
  const bodyGap = gap ?? (indent ? t.space.sm : undefined);
  return (
    <CollapsibleContent
      open={open}
      style={
        flush
          ? { paddingLeft: 0, paddingRight: 0, paddingBottom: 0, ...style }
          : style
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          ...(bodyGap === undefined ? {} : { gap: bodyGap }),
          ...insetStyle,
          ...inset,
          ...(maxHeight === undefined
            ? {}
            : { maxHeight, overflowY: "scroll" }),
          ...bodyStyle,
        }}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}
