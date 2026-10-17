import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon } from "../../components/icons";
import { Button } from "../../components/Button";
import { Spinner } from "../../components/Spinner";
import {
  Collapsible,
  CollapsibleContent,
} from "../../components/Collapsible";
import { RowChevron } from "./RowChevron";

interface TerminalContextValue {
  title?: string;
  command?: string;
  output: string;
  error?: string;
  isStreaming: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopy?: () => void;
}

const TerminalCtx = createContext<TerminalContextValue | null>(null);

function useTerminal(): TerminalContextValue {
  const ctx = useContext(TerminalCtx);
  if (!ctx)
    throw new Error("Terminal components must be used within <Terminal>");
  return ctx;
}

export interface TerminalProps {
  title?: string;
  command?: string;
  output?: string;
  error?: string;
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCopy?: () => void;
  maxHeight?: number;
  style?: Partial<StyleDesc>;
}

export function Terminal({
  title,
  command,
  output,
  error,
  isStreaming = false,
  open,
  defaultOpen,
  onOpenChange,
  onCopy,
  maxHeight,
  style,
}: TerminalProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const [internal, setInternal] = useState(
    defaultOpen ?? (isStreaming ? true : false),
  );
  const isOpen = open ?? internal;
  const handleOpenChange = (next: boolean) => {
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  const value = useMemo<TerminalContextValue>(
    () => ({
      title,
      command,
      output: output ?? "",
      error,
      isStreaming,
      open: isOpen,
      onOpenChange: handleOpenChange,
      onCopy,
    }),
    [title, command, output, error, isStreaming, isOpen, onCopy],
  );
  return (
    <TerminalCtx.Provider value={value}>
      <Collapsible
        open={isOpen}
        onOpenChange={handleOpenChange}
        style={{
          backgroundColor: colors.view_bg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.card,
          overflow: "hidden",
          ...style,
        }}
      >
        <TerminalHeader />
        <TerminalContent maxHeight={maxHeight} />
      </Collapsible>
    </TerminalCtx.Provider>
  );
}

export interface TerminalHeaderProps {
  style?: Partial<StyleDesc>;
}

export function TerminalHeader({ style }: TerminalHeaderProps) {
  const t = useAdwaita();
  const { colors, typography, spacing } = t;
  const { title, isStreaming, open, onOpenChange, onCopy } = useTerminal();
  return (
    <div
      onClick={() => onOpenChange(!open)}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.gap,
        padding: spacing.gap,
        minWidth: 0,
        cursor: "pointer",
        ...style,
      }}
    >
      <Icon name="terminal" size={16} color={colors.fg} />
      <T
        size="body"
        weight={400}
        color={colors.fg}
        style={{
          flexShrink: 1,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: typography.fontFamilyMono,
          pointerEvents: "none",
        }}
      >
        {title ?? "Terminal"}
      </T>
      <div style={{ flexGrow: 1 }} />
      {isStreaming ? (
        <div style={{ flexShrink: 0 }}>
          <Spinner size={16} label={false} />
        </div>
      ) : null}
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

export interface TerminalContentProps {
  maxHeight?: number;
  style?: Partial<StyleDesc>;
}

export function TerminalContent({
  maxHeight,
  style,
}: TerminalContentProps) {
  const t = useAdwaita();
  const { colors, typography, spacing } = t;
  const { command, output, error, open } = useTerminal();
  const outputLines = output.length > 0 ? output.split("\n") : [];
  const errorLines = error && error.length > 0 ? error.split("\n") : [];
  const isEmpty =
    !command && outputLines.length === 0 && errorLines.length === 0;
  const monoLine: Partial<StyleDesc> = {
    flexShrink: 1,
    fontFamily: typography.fontFamilyMono,
  };
  return (
    <CollapsibleContent
      open={open}
      style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0, ...style }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: spacing.gap,
          borderTopWidth: 1,
          borderColor: colors.border,
          minWidth: 0,
          ...(maxHeight !== undefined
            ? { maxHeight, overflowY: "scroll" }
            : {}),
        }}
      >
        {command ? (
          <T size="caption" color={colors.fg} style={monoLine}>
            {command}
          </T>
        ) : null}
        {outputLines.map((line, i) => (
          <T
            key={`output-${i}`}
            size="caption"
            color={colors.dim_fg}
            style={monoLine}
          >
            {line.length > 0 ? line : " "}
          </T>
        ))}
        {errorLines.map((line, i) => (
          <T
            key={`error-${i}`}
            size="caption"
            color={colors.destructive}
            style={monoLine}
          >
            {line.length > 0 ? line : " "}
          </T>
        ))}
        {isEmpty ? (
          <T size="caption" color={colors.dim_fg} style={monoLine}>
            No output
          </T>
        ) : null}
      </div>
    </CollapsibleContent>
  );
}
