import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { RowChevron } from "./RowChevron";

export interface CollapsibleTriggerRowProps {
  icon: ReactNode;
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  trailing?: ReactNode;
  spacer?: boolean;
  chevron?: boolean;
  gap?: number;
  style?: Partial<StyleDesc>;
}

export function CollapsibleTriggerRow({
  icon,
  title,
  open,
  onToggle,
  trailing,
  spacer = false,
  chevron = true,
  gap = 8,
  style,
}: CollapsibleTriggerRowProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap,
        minWidth: 0,
        cursor: "pointer",
        ...style,
      }}
    >
      {icon}
      {title}
      {spacer ? <div style={{ flexGrow: 1 }} /> : null}
      {trailing}
      {chevron ? <RowChevron open={open} /> : null}
    </div>
  );
}
