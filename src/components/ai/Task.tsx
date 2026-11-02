import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { ProgressBar } from "../../components/ProgressBar";
import { useControllableOpen } from "../../components/Collapsible";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";
import { DisclosureBody } from "./DisclosureBody";
import { RowLabel } from "./RowLabel";
import { StatusGlyph } from "./StatusGlyph";

export interface TaskProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Task({ children, style }: TaskProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface TaskContentProps {
  open?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TaskContent({ open, children, style }: TaskContentProps) {
  return (
    <DisclosureBody open={open} indent style={style}>
      {children}
    </DisclosureBody>
  );
}

export type TaskStatus = "pending" | "running" | "done";

export interface TaskItemProps {
  title: ReactNode;
  status?: TaskStatus;
  description?: ReactNode;
  progress?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TaskItem({
  title,
  status = "done",
  description,
  progress,
  open,
  defaultOpen,
  onOpenChange,
  children,
  style,
}: TaskItemProps) {
  const t = useAdwaita();
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 0,
        ...style,
      }}
    >
      <CollapsibleTriggerRow
        icon={<StatusGlyph status={status === "done" ? "complete" : status} />}
        title={<RowLabel>{title}</RowLabel>}
        open={isOpen}
        onToggle={() => setOpen(!isOpen)}
      />
      {description !== undefined ? (
        <T
          size="caption"
          color={t.color.text.dim}
          style={{ marginLeft: 22, flexShrink: 1, textOverflow: "ellipsis" }}
        >
          {description}
        </T>
      ) : null}
      {progress !== undefined ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginLeft: 22,
            minWidth: 0,
          }}
        >
          <ProgressBar value={progress} height={4} />
        </div>
      ) : null}
      {isOpen ? <TaskContent open={isOpen}>{children}</TaskContent> : null}
    </div>
  );
}
