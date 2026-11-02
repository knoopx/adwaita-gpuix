import { type ReactNode, createContext, useContext, useMemo } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon } from "../../components/icons";
import { Collapsible, useControllableOpen } from "../../components/Collapsible";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";
import { DisclosureBody } from "./DisclosureBody";
import { DisclosureTrailing } from "./DisclosureTrailing";
import { RowLabel } from "./RowLabel";

export interface StackTraceFrame {
  raw: string;

  internal?: boolean;
  filePath?: string;
  line?: number;
  column?: number;
}

interface StackTraceContextValue {
  errorType: string;
  message?: string;
  frames: StackTraceFrame[];
  internalCount?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopy?: () => void;
  onFilePathClick?: (filePath: string, line?: number, column?: number) => void;
}

const StackTraceCtx = createContext<StackTraceContextValue | null>(null);

function useStackTrace(): StackTraceContextValue {
  const ctx = useContext(StackTraceCtx);
  if (!ctx)
    throw new Error("StackTrace parts must be used within <StackTrace>");
  return ctx;
}

export interface StackTraceProps {
  errorType: string;
  message?: string;
  frames: StackTraceFrame[];
  internalCount?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  onCopy?: () => void;
  onFilePathClick?: (filePath: string, line?: number, column?: number) => void;
  maxHeight?: number;
  style?: Partial<StyleDesc>;
}

export function StackTrace({
  errorType,
  message,
  frames,
  internalCount,
  open,
  defaultOpen,
  onOpenChange,
  onCopy,
  onFilePathClick,
  maxHeight,
  style,
}: StackTraceProps) {
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  const value = useMemo<StackTraceContextValue>(
    () => ({
      errorType,
      message,
      frames,
      internalCount,
      open: isOpen,
      onOpenChange: setOpen,
      onCopy,
      onFilePathClick,
    }),
    [
      errorType,
      message,
      frames,
      internalCount,
      isOpen,
      onCopy,
      onFilePathClick,
    ],
  );
  return (
    <StackTraceCtx.Provider value={value}>
      <Collapsible open={isOpen} onOpenChange={setOpen} style={style}>
        <StackTraceHeader />
        <StackTraceContent maxHeight={maxHeight} />
      </Collapsible>
    </StackTraceCtx.Provider>
  );
}

export interface StackTraceHeaderProps {
  style?: Partial<StyleDesc>;
}

export function StackTraceHeader({ style }: StackTraceHeaderProps) {
  const t = useAdwaita();
  const { errorType, message, onCopy, open, onOpenChange } = useStackTrace();
  return (
    <CollapsibleTriggerRow
      icon={
        <Icon name="warning" size={16} color={t.color.functional.destructive} />
      }
      title={
        <RowLabel
          color={t.color.functional.destructive}
          style={{ whiteSpace: "nowrap", pointerEvents: "none" }}
        >
          {`Failed: ${errorType}${message ? `: ${message}` : ""}`}
        </RowLabel>
      }
      open={open}
      onToggle={() => onOpenChange(!open)}
      trailing={<DisclosureTrailing onCopy={onCopy} open={open} />}
      chevron={false}
      style={style}
    />
  );
}

export interface StackTraceContentProps {
  maxHeight?: number;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function StackTraceContent({
  maxHeight,
  children,
  style,
}: StackTraceContentProps) {
  const t = useAdwaita();
  const { errorType, message, frames, internalCount, open, onFilePathClick } =
    useStackTrace();
  return (
    <DisclosureBody
      open={open}
      flush
      gap={6}
      inset={{ padding: t.space.md, minWidth: 0 }}
      bodyStyle={{
        borderRadius: t.radius.sm,
        borderLeftWidth: 3,
        borderColor: t.color.functional.destructive,
        backgroundColor: t.color.functional.destructiveTint,
      }}
      maxHeight={maxHeight}
      style={style}
    >
      {children ?? (
        <>
          <T
            size="caption"
            color={t.color.functional.destructive}
            style={{
              flexShrink: 1,
              fontFamily: t.type.fontFamilyMono,
            }}
          >
            {`${errorType}${message ? `: ${message}` : ""}`}
          </T>
          {frames.map((frame, i) => (
            <StackTraceFrameRow
              key={i}
              frame={frame}
              onFilePathClick={onFilePathClick}
            />
          ))}
          {internalCount !== undefined ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
              }}
            >
              <Icon
                name="layers"
                size={14}
                color={t.color.text.dim}
                style={{ flexShrink: 0 }}
              />
              <T
                size="caption"
                color={t.color.text.dim}
                style={{ flexShrink: 1 }}
              >
                {`${internalCount} framework frames`}
              </T>
              <Icon
                name="chevronRight"
                size={12}
                color={t.color.text.dim}
                style={{ flexShrink: 0 }}
              />
            </div>
          ) : null}
          {frames.length === 0 && internalCount === undefined ? (
            <T size="caption" color={t.color.text.dim}>
              No stack frames
            </T>
          ) : null}
        </>
      )}
    </DisclosureBody>
  );
}

function StackTraceFrameRow({
  frame,
  onFilePathClick,
}: {
  frame: StackTraceFrame;
  onFilePathClick?: (filePath: string, line?: number, column?: number) => void;
}) {
  const t = useAdwaita();
  const clickable =
    frame.filePath !== undefined && onFilePathClick !== undefined;
  return (
    <div
      onClick={
        clickable && frame.filePath
          ? () =>
              onFilePathClick(
                frame.filePath as string,
                frame.line,
                frame.column,
              )
          : undefined
      }
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
        cursor: clickable ? "pointer" : "default",
        opacity: frame.internal ? 0.6 : 1,
      }}
    >
      <Icon
        name="article"
        size={14}
        color={t.color.text.dim}
        style={{ flexShrink: 0 }}
      />
      <T
        size="caption"
        color={frame.internal ? t.color.text.dim : t.color.text.primary}
        style={{
          flexShrink: 1,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: t.type.fontFamilyMono,
          pointerEvents: "none",
        }}
      >
        {frame.raw}
      </T>
    </div>
  );
}
