import { useEffect, useState, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, type AdwaitaTheme } from "../theme/adwaita";
import { Icon } from "./icons";
import { T } from "./common";

export interface JsonViewProps {
  
  src: unknown;
  
  name?: string;
  
  collapsed?: boolean | number;
  
  indent?: number;
  
  shortenText?: number;
  
  displayDataTypes?: boolean;
  style?: Partial<StyleDesc>;
}

type JsonKind =
  | "object"
  | "array"
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "undefined"
  | "other";

function kindOf(v: unknown): JsonKind {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  const t = typeof v;
  if (t === "string") return "string";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (Array.isArray(v)) return "array";
  if (t === "object") return "object";
  return "other";
}

function isContainer(v: unknown): boolean {
  return kindOf(v) === "object" || kindOf(v) === "array";
}

function sizeOf(v: unknown): number {
  if (Array.isArray(v)) return v.length;
  if (v && typeof v === "object") return Object.keys(v).length;
  return 0;
}

function initialOpen(
  src: unknown,
  collapsed: boolean | number,
): Set<string> {
  const open = new Set<string>();
  const maxDepth =
    collapsed === true ? 0 : collapsed === false ? Infinity : collapsed;
  const walk = (v: unknown, parts: (string | number)[]) => {
    if (parts.length >= maxDepth) return;
    if (!isContainer(v)) return;
    open.add(parts.length === 0 ? "$" : parts.join("."));
    if (Array.isArray(v)) {
      v.forEach((child, i) => walk(child, [...parts, i]));
    } else if (v && typeof v === "object") {
      for (const [k, child] of Object.entries(v)) walk(child, [...parts, k]);
    }
  };
  walk(src, []);
  return open;
}

function formatScalar(v: unknown, shorten: number): string {
  const kind = kindOf(v);
  if (kind === "string") {
    const raw = v as string;
    const body =
      shorten > 0 && raw.length > shorten ? `${raw.slice(0, shorten)}…` : raw;
    return `"${body}"`;
  }
  if (v instanceof Date) return `"${v.toISOString()}"`;
  return String(v);
}

function typeLabel(v: unknown): string {
  const kind = kindOf(v);
  if (kind === "object") return "object";
  if (kind === "array") return "array";
  return kind === "other" ? (v instanceof Date ? "date" : "value") : kind;
}

function monoStyle(t: AdwaitaTheme): Partial<StyleDesc> {
  return {
    fontFamily: t.typography.fontFamilyMono,
    fontSize: t.typography.caption,
  };
}

function NodeKeyLabel({
  name,
  isRoot,
}: {
  name: string | number | null;
  isRoot: boolean;
}) {
  const t = useAdwaita();
  const { colors } = t;
  const mono = monoStyle(t);
  return (
    <>
      {name === null || isRoot ? (
        <T color={colors.fg} style={mono}>
          {name ?? "root"}
        </T>
      ) : typeof name === "number" ? (
        <T color={colors.accent} style={mono}>
          {name}
        </T>
      ) : (
        <T color={colors.fg} style={mono}>
          {`"${name}"`}
        </T>
      )}
      {!isRoot && name !== null && typeof name !== "number" ? (
        <T color={colors.dim_fg} style={mono}>
          :
        </T>
      ) : null}
    </>
  );
}

interface NodeRowProps {
  name: string | number | null;
  value: unknown;
  path: string;
  depth: number;
  isRoot: boolean;
  open: Set<string>;
  toggle: (path: string) => void;
  indent: number;
  shorten: number;
  showTypes: boolean;
}

function NodeRow(props: NodeRowProps) {
  const { name, value, path, depth, isRoot, open, toggle, indent, shorten, showTypes } =
    props;
  const t = useAdwaita();
  const { colors, typography } = t;

  const mono = monoStyle(t);

  
  if (!isContainer(value)) {
    const kind = kindOf(value);
    const valueColor =
      kind === "string"
        ? colors.success
        : kind === "number"
          ? colors.accent
          : kind === "boolean"
            ? colors.warning
            : colors.dim_fg;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          minHeight: 20,
          paddingLeft: depth > 0 ? indent : 0,
        }}
      >
        <div style={{ width: 12, flexShrink: 0 }} />
        <NodeKeyLabel name={name} isRoot={isRoot} />
        <T color={valueColor} style={mono}>
          {formatScalar(value, shorten)}
        </T>
        {showTypes ? (
          <T color={colors.dim_fg} style={mono}>
            {typeLabel(value)}
          </T>
        ) : null}
      </div>
    );
  }

  
  const isArray = kindOf(value) === "array";
  const size = sizeOf(value);
  const isOpen = open.has(path);
  const empty = size === 0;

  const header = (
    <div
      onClick={empty ? undefined : () => toggle(path)}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        minHeight: 20,
        paddingLeft: depth > 0 ? indent : 0,
        cursor: empty ? "default" : "pointer",
        hover: empty ? undefined : { backgroundColor: colors.accentTint },
        borderRadius: 4,
      }}
    >
      {empty ? (
        <div style={{ width: 12, flexShrink: 0 }} />
      ) : (
        <Icon
          name={isOpen ? "chevronDown" : "chevronRight"}
          size={12}
          color={colors.dim_fg}
          style={{ flexShrink: 0, pointerEvents: "none" }}
        />
      )}
      <NodeKeyLabel name={name} isRoot={isRoot} />
      {empty ? (
        <T color={colors.dim_fg} style={mono}>
          {isArray ? "[]" : "{}"}
        </T>
      ) : isOpen ? (
        <T color={colors.dim_fg} style={mono}>
          {isArray ? "[" : "{"}
        </T>
      ) : (
        <T color={colors.dim_fg} style={mono}>
          {isArray ? `[… ${size}]` : `{… ${size}}`}
        </T>
      )}
      {showTypes && !empty ? (
        <T color={colors.dim_fg} style={mono}>
          {isArray ? "array" : "object"}
        </T>
      ) : null}
    </div>
  );

  if (!isOpen || empty) return header;

  const children: ReactNode[] = [];
  if (isArray) {
    const arr = value as unknown[];
    arr.forEach((child, i) => {
      children.push(
        <NodeRow
          key={i}
          name={i}
          value={child}
          path={`${path}.${i}`}
          depth={depth + 1}
          isRoot={false}
          open={open}
          toggle={toggle}
          indent={indent}
          shorten={shorten}
          showTypes={showTypes}
        />,
      );
    });
  } else {
    for (const [k, child] of Object.entries(value as Record<string, unknown>)) {
      children.push(
        <NodeRow
          key={k}
          name={k}
          value={child}
          path={path === "$" ? k : `${path}.${k}`}
          depth={depth + 1}
          isRoot={false}
          open={open}
          toggle={toggle}
          indent={indent}
          shorten={shorten}
          showTypes={showTypes}
        />,
      );
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {header}
      {children}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: 20,
          paddingLeft: depth > 0 ? indent : 0,
        }}
      >
        <div style={{ width: 12, flexShrink: 0 }} />
        <T color={colors.dim_fg} style={mono}>
          {isArray ? "]" : "}"}
        </T>
      </div>
    </div>
  );
}

export function JsonView({
  src,
  name = "root",
  collapsed = 2,
  indent = 16,
  shortenText = 40,
  displayDataTypes = false,
  style,
}: JsonViewProps) {
  const [open, setOpen] = useState<Set<string>>(() => initialOpen(src, collapsed));

  useEffect(() => {
    setOpen(initialOpen(src, collapsed));
  }, [src, collapsed]);

  const toggle = (path: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <NodeRow
        name={name}
        value={src}
        path="$"
        depth={0}
        isRoot
        open={open}
        toggle={toggle}
        indent={indent}
        shorten={shortenText}
        showTypes={displayDataTypes}
      />
    </div>
  );
}
