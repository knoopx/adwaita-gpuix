import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { RowChevron } from "./RowChevron";

export interface CollapsibleTriggerRowProps {
  icon: ReactNode;
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  spacer?: boolean;
  style?: Partial<StyleDesc>;
}

export function CollapsibleTriggerRow({
  icon,
  title,
  open,
  onToggle,
  spacer = false,
  style,
}: CollapsibleTriggerRowProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
        cursor: "pointer",
        ...style,
      }}
    >
      {icon}
      {title}
      {spacer ? <div style={{ flexGrow: 1 }} /> : null}
      <RowChevron open={open} />
    </div>
  );
}
