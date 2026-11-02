import { createContext, useContext, useMemo, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon } from "../../components/icons";
import { Collapsible } from "../../components/Collapsible";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";
import { DisclosureBody } from "./DisclosureBody";
import { DisclosureTrailing } from "./DisclosureTrailing";
import { RowLabel } from "./RowLabel";
import { StatusGlyph } from "./StatusGlyph";

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
  const { title, isStreaming, open, onOpenChange, onCopy } = useTerminal();
  return (
    <CollapsibleTriggerRow
      icon={<Icon name="terminal" size={16} color={t.color.text.primary} />}
      title={
        <RowLabel
          weight={400}
          style={{
            fontFamily: t.type.fontFamilyMono,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {title ?? "Terminal"}
        </RowLabel>
      }
      open={open}
      onToggle={() => onOpenChange(!open)}
      spacer
      trailing={
        <>
          {isStreaming ? <StatusGlyph status="running" /> : null}
          <DisclosureTrailing onCopy={onCopy} open={open} />
        </>
      }
      chevron={false}
      style={{ padding: t.space.sm, ...style }}
    />
  );
}

export interface TerminalContentProps {
  maxHeight?: number;
  style?: Partial<StyleDesc>;
}

export function TerminalContent({ maxHeight, style }: TerminalContentProps) {
  const t = useAdwaita();
  const { command, output, error, open } = useTerminal();
  const outputLines = output.length > 0 ? output.split("\n") : [];
  const errorLines = error && error.length > 0 ? error.split("\n") : [];
  const isEmpty =
    !command && outputLines.length === 0 && errorLines.length === 0;
  const monoLine: Partial<StyleDesc> = {
    flexShrink: 1,
    fontFamily: t.type.fontFamilyMono,
  };
  return (
    <DisclosureBody
      open={open}
      flush
      gap={2}
      inset={{ padding: t.space.sm, minWidth: 0 }}
      maxHeight={maxHeight}
      style={style}
    >
      {command ? (
        <T size="caption" color={t.color.text.primary} style={monoLine}>
          {command}
        </T>
      ) : null}
      {outputLines.map((line, i) => (
        <T
          key={`output-${i}`}
          size="caption"
          color={t.color.text.dim}
          style={monoLine}
        >
          {line.length > 0 ? line : " "}
        </T>
      ))}
      {errorLines.map((line, i) => (
        <T
          key={`error-${i}`}
          size="caption"
          color={t.color.functional.destructive}
          style={monoLine}
        >
          {line.length > 0 ? line : " "}
        </T>
      ))}
      {isEmpty ? (
        <T size="caption" color={t.color.text.dim} style={monoLine}>
          No output
        </T>
      ) : null}
    </DisclosureBody>
  );
}
