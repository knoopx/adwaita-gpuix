import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon } from "../../components/icons";
import { Button } from "../../components/Button";
import {
  Collapsible,
  CollapsibleContent,
  useControllableOpen,
} from "../../components/Collapsible";
import { RowChevron } from "./RowChevron";

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
    [errorType, message, frames, internalCount, isOpen, onCopy, onFilePathClick],
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
  const { colors } = t;
  const { errorType, message, onCopy, open, onOpenChange } = useStackTrace();
  return (
    <div
      onClick={() => onOpenChange(!open)}
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
      <Icon name="warning" size={16} color={colors.destructive} />
      <T
        size="body"
        color={colors.destructive}
        style={{
          flexShrink: 1,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {`Failed: ${errorType}${message ? `: ${message}` : ""}`}
      </T>
      {onCopy ? (
        <Button
          variant="secondary"
          size="sm"
          icon="copy"
          label="Copy"
          onClick={onCopy}
          style={{ flexShrink: 0 }}
        />
      ) : null}
      <RowChevron open={open} />
    </div>
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
  const { colors, radii, spacing, typography } = t;
  const { errorType, message, frames, internalCount, open, onFilePathClick } =
    useStackTrace();
  return (
    <CollapsibleContent
      open={open}
      style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0, ...style }}
    >
      {children ?? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: spacing.paddingTight,
            borderRadius: radii.row,
            borderLeftWidth: 3,
            borderColor: colors.destructive,
            backgroundColor: colors.destructiveTint,
            minWidth: 0,
            ...(maxHeight !== undefined
              ? { maxHeight, overflowY: "scroll" }
              : {}),
          }}
        >
          <T
            size="caption"
            color={colors.destructive}
            style={{
              flexShrink: 1,
              fontFamily: typography.fontFamilyMono,
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
                color={colors.dim_fg}
                style={{ flexShrink: 0 }}
              />
              <T size="caption" color={colors.dim_fg} style={{ flexShrink: 1 }}>
                {`${internalCount} framework frames`}
              </T>
              <Icon
                name="chevronRight"
                size={12}
                color={colors.dim_fg}
                style={{ flexShrink: 0 }}
              />
            </div>
          ) : null}
          {frames.length === 0 && internalCount === undefined ? (
            <T size="caption" color={colors.dim_fg}>
              No stack frames
            </T>
          ) : null}
        </div>
      )}
    </CollapsibleContent>
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
  const { colors, typography } = t;
  const clickable = frame.filePath !== undefined && onFilePathClick !== undefined;
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
        name="fileText"
        size={14}
        color={colors.dim_fg}
        style={{ flexShrink: 0 }}
      />
      <T
        size="caption"
        color={frame.internal ? colors.dim_fg : colors.fg}
        style={{
          flexShrink: 1,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: typography.fontFamilyMono,
          pointerEvents: "none",
        }}
      >
        {frame.raw}
      </T>
    </div>
  );
}

