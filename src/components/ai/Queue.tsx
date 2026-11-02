import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon } from "../../components/icons";
import { Collapsible, useControllableOpen } from "../../components/Collapsible";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";
import { DisclosureRow } from "./DisclosureRow";
import { RowLabel } from "./RowLabel";
import { StatusGlyph } from "./StatusGlyph";

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
            name="formatListNumbered"
            size={14}
            color={t.color.text.dim}
            style={{ flexShrink: 0 }}
          />
        }
        title={<RowLabel weight={400}>{text}</RowLabel>}
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
  return (
    <StatusGlyph
      status={completed ? "complete" : "pending"}
      icon={completed ? "success" : "circle"}
      style={style}
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 0,
          }}
        >
          <DisclosureRow
            icon={<QueueItemIndicator completed={completed} />}
            label={title}
          />
          {description !== undefined ? (
            <T
              size="caption"
              color={t.color.text.dim}
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
