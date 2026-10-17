import { type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon } from "../../components/icons";
import {
  Collapsible,
  useControllableOpen,
} from "../../components/Collapsible";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";
import { UserBubble } from "./UserBubble";
import { Summary } from "./Summary";
import { ReplayButton } from "./ReplayButton";

export interface QueueProps {
  count?: number;
  title?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Queue({
  count,
  title,
  open,
  defaultOpen,
  onOpenChange,
  children,
  style,
}: QueueProps) {
  const t = useAdwaita();
  const { colors } = t;
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  const text = title ?? (count !== undefined ? `${count} completed` : "Queue");
  return (
    <Collapsible open={isOpen} onOpenChange={setOpen} style={style}>
      <CollapsibleTriggerRow
        icon={
          <Icon
            name="listOrdered"
            size={14}
            color={colors.dim_fg}
            style={{ flexShrink: 0 }}
          />
        }
        title={
          <T
            size="body"
            weight={400}
            color={colors.fg}
            style={{ flexShrink: 1, textOverflow: "ellipsis" }}
          >
            {text}
          </T>
        }
        open={isOpen}
        onToggle={() => setOpen(!isOpen)}
        spacer
      />
      {children}
    </Collapsible>
  );
}

export interface QueueItemIndicatorProps {
  completed?: boolean;
  style?: Partial<StyleDesc>;
}

export function QueueItemIndicator({
  completed = false,
  style,
}: QueueItemIndicatorProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <Icon
      name={completed ? "success" : "circle"}
      size={14}
      color={completed ? colors.success : colors.dim_fg}
      style={{ flexShrink: 0, ...style }}
    />
  );
}

export interface QueueItemProps {
  title?: ReactNode;
  description?: ReactNode;
  completed?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function QueueItem({
  title,
  description,
  completed = false,
  children,
  style,
}: QueueItemProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
        ...style,
      }}
    >
      {children !== undefined ? (
        children
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              minWidth: 0,
            }}
          >
            <QueueItemIndicator completed={completed} />
            <T
              size="body"
              color={completed ? colors.dim_fg : colors.fg}
              style={{ flexShrink: 1, textOverflow: "ellipsis" }}
            >
              {title}
            </T>
          </div>
          {description !== undefined ? (
            <T
              size="caption"
              color={colors.dim_fg}
              style={{ marginLeft: 22, textOverflow: "ellipsis" }}
            >
              {description}
            </T>
          ) : null}
        </div>
      )}
    </div>
  );
}
