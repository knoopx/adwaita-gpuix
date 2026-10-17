import { type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon } from "../../components/icons";
import { Spinner } from "../../components/Spinner";
import { ProgressBar } from "../../components/ProgressBar";
import {
  CollapsibleContent,
  useControllableOpen,
} from "../../components/Collapsible";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";

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
  const t = useAdwaita();
  const { colors } = t;
  return (
    <CollapsibleContent open={open} style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          paddingTop: 4,
          paddingLeft: 12,
          borderLeftWidth: 2,
          borderColor: colors.border,
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}

export type TaskStatus = "pending" | "running" | "done";

function TaskIndicator({ status }: { status: TaskStatus }) {
  const t = useAdwaita();
  const { colors } = t;
  if (status === "running") {
    return <Spinner size={16} label={false} style={{ flexShrink: 0 }} />;
  }
  if (status === "done") {
    return (
      <Icon
        name="success"
        size={14}
        color={colors.success}
        style={{ flexShrink: 0 }}
      />
    );
  }
  return (
    <Icon
      name="circle"
      size={14}
      color={colors.dim_fg}
      style={{ flexShrink: 0 }}
    />
  );
}

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
  const { colors } = t;
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
        icon={<TaskIndicator status={status} />}
        title={
          <T
            size="body"
            color={status === "running" ? colors.fg : colors.dim_fg}
            style={{ flexShrink: 1, textOverflow: "ellipsis" }}
          >
            {title}
          </T>
        }
        open={isOpen}
        onToggle={() => setOpen(!isOpen)}
      />
      {description !== undefined ? (
        <T
          size="caption"
          color={colors.dim_fg}
          style={{ marginLeft: 22, flexShrink: 1, textOverflow: "ellipsis" }}
        >
          {description}
        </T>
      ) : null}
      {progress !== undefined ? (
        <div style={{ display: "flex", flexDirection: "row", marginLeft: 22, minWidth: 0 }}>
          <ProgressBar value={progress} height={4} />
        </div>
      ) : null}
      {isOpen ? <TaskContent open={isOpen}>{children}</TaskContent> : null}
    </div>
  );
}
