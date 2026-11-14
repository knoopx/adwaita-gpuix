import { type ReactNode, createContext, useContext, useMemo } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon, type IconName } from "../../components/icons";
import { type TextTone, textToneColor } from "../../theme/tones";
import { Collapsible, useControllableOpen } from "../../components/Collapsible";
import { DisclosureBody } from "./DisclosureBody";
import { Glyph, type GlyphName } from "./Glyph";
import { OutputBox } from "./OutputBox";
import { StatusGlyph } from "./StatusGlyph";

export type ToolState =
  "running" | "output-available" | "output-error" | "output-denied";

const GUTTER_GLYPH = 16;
const GUTTER_GAP = 8;
const GUTTER_GLYPH_HANG = GUTTER_GLYPH + GUTTER_GAP;

const TOOL_STATE_PREFIX: Record<ToolState, string> = {
  running: "Running",
  "output-available": "Ran",
  "output-error": "Failed to run",
  "output-denied": "Denied",
};

const TOOL_STATUS_TONE: Record<ToolState, TextTone> = {
  running: "dim",
  "output-available": "success",
  "output-error": "destructive",
  "output-denied": "dim",
};

const TOOL_GLYPH_TONE: Record<ToolState, TextTone> = {
  running: "dim",
  "output-available": "dim",
  "output-error": "destructive",
  "output-denied": "dim",
};

const TOOL_STATUS_ICON: Record<ToolState, IconName> = {
  running: "check",
  "output-available": "check",
  "output-error": "close",
  "output-denied": "close",
};

interface ToolContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ToolCtx = createContext<ToolContextValue | null>(null);

function useToolContext(): ToolContextValue | null {
  return useContext(ToolCtx);
}

interface ToolOpenState {
  isOpen: boolean;
  toggle?: (open: boolean) => void;
}

function useToolOpenState(
  open?: boolean,
  onOpenChange?: (open: boolean) => void,
): ToolOpenState {
  const ctx = useToolContext();
  return {
    isOpen: open ?? ctx?.open ?? false,
    toggle: onOpenChange ?? ctx?.onOpenChange,
  };
}

function toolHeaderText(
  children: ReactNode,
  toolName: string | undefined,
  prefix: string,
): ReactNode {
  if (children != null) return children;
  return toolName ? `${prefix} ${toolName}` : prefix;
}

function ToolHeaderTitle({
  title,
  argsText,
}: {
  title: string;
  argsText: string;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
        flexGrow: 1,
        minWidth: 0,
        pointerEvents: "none",
      }}
    >
      <T
        size="body"
        weight={t.type.weight.bold}
        color={t.color.text.primary}
        style={{
          flexShrink: 0,
          maxWidth: "100%",
          minWidth: 0,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {title}
      </T>
      {argsText !== "" ? (
        <T
          size="caption"
          color={t.color.text.dim}
          style={{
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 0,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            fontFamily: t.type.fontFamilyMono,
          }}
        >
          {argsText}
        </T>
      ) : null}
    </div>
  );
}

function ToolStatusIndicator({
  state,
  spinnerSlot,
}: {
  state: ToolState;
  spinnerSlot?: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <StatusGlyph
      status={state === "running" ? "running" : "complete"}
      icon={TOOL_STATUS_ICON[state]}
      color={textToneColor(t, TOOL_STATUS_TONE[state])}
      spinnerSlot={spinnerSlot}
    />
  );
}

export interface ToolProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Tool({
  open,
  defaultOpen,
  onOpenChange,
  children,
  style,
}: ToolProps) {
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  const value = useMemo<ToolContextValue>(
    () => ({ open: isOpen, onOpenChange: setOpen }),
    [isOpen],
  );
  return (
    <ToolCtx.Provider value={value}>
      <Collapsible
        open={isOpen}
        onOpenChange={setOpen}
        style={{
          overflow: "visible",
          width: "100%",
          minWidth: 0,

          borderWidth: 0,
          ...style,
        }}
      >
        {children}
      </Collapsible>
    </ToolCtx.Provider>
  );
}

export interface ToolHeaderProps {
  state: ToolState;

  title?: string;

  args?: string;

  icon?: GlyphName;

  iconTone?: TextTone;

  /** The mark this header wears while the tool runs, in place of the spinner. */
  spinnerSlot?: ReactNode;

  /**
   * What the call ran with, riding the right end of the header line beside its
   * status mark: the title and args text give way when the row runs out of room,
   * these do not. They stand at the end because a chip is read against the next
   * row's chip, not against the name of this one — a column of figures only lines
   * up when it ends in one place.
   */
  chipsSlot?: ReactNode;
  toolName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ToolHeader({
  state,
  title,
  args,
  icon = "terminal",
  iconTone,
  spinnerSlot,
  chipsSlot,
  toolName,
  open,
  onOpenChange,
  children,
  style,
}: ToolHeaderProps) {
  const t = useAdwaita();
  const { isOpen, toggle } = useToolOpenState(open, onOpenChange);
  const argsText = args?.trim() ?? "";
  const glyphTone = iconTone ?? TOOL_GLYPH_TONE[state];
  return (
    <div
      onClick={toggle ? () => toggle(!isOpen) : undefined}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: GUTTER_GAP,
        paddingTop: t.space.sm,
        paddingRight: t.space.sm,
        paddingBottom: t.space.sm,
        paddingLeft: 0,
        minWidth: 0,
        cursor: "pointer",
        ...style,
      }}
    >
      <Glyph
        name={icon}
        size={GUTTER_GLYPH}
        color={textToneColor(t, glyphTone)}
        style={{ marginLeft: -GUTTER_GLYPH_HANG }}
      />
      {title !== undefined ? (
        <ToolHeaderTitle title={title} argsText={argsText} />
      ) : (
        <T
          size="body"
          color={t.color.text.primary}
          style={{
            flexShrink: 1,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {toolHeaderText(children, toolName, TOOL_STATE_PREFIX[state])}
        </T>
      )}
      <div style={{ flexGrow: 1, minWidth: t.space.sm }} />
      {chipsSlot}
      <ToolStatusIndicator state={state} spinnerSlot={spinnerSlot} />
    </div>
  );
}

function formatValue(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function ToolInputBlock({ input }: { input?: unknown }) {
  const t = useAdwaita();
  if (input === undefined) return null;
  const inputLines = formatValue(input).split("\n");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
      }}
    >
      {inputLines.map((line, i) => (
        <T
          key={i}
          size="caption"
          color={t.color.text.primary}
          style={{
            flexShrink: 1,
            fontFamily: t.type.fontFamilyMono,
          }}
        >
          {line.length > 0 ? line : " "}
        </T>
      ))}
    </div>
  );
}

function ToolOutputBlock({
  output,
  errorText,
}: {
  output?: unknown;
  errorText?: string;
}) {
  if (output === undefined && errorText === undefined) return null;
  return (
    <OutputBox
      text={errorText ?? formatValue(output)}
      tone={errorText ? "error" : "default"}
    />
  );
}

export interface ToolContentProps {
  open?: boolean;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ToolContent({
  open,
  input,
  output,
  errorText,
  children,
  style,
}: ToolContentProps) {
  const t = useAdwaita();
  const { isOpen } = useToolOpenState(open);
  return (
    <DisclosureBody
      open={isOpen}
      gap={t.space.sm}
      inset={{ paddingLeft: 0, minWidth: 0 }}
      style={{ paddingLeft: 0, paddingRight: 0, ...style }}
    >
      <ToolInputBlock input={input} />
      {children}
      <ToolOutputBlock output={output} errorText={errorText} />
    </DisclosureBody>
  );
}
