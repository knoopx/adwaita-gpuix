import { type ReactNode, useEffect, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { Icon } from "./icons";
import { T } from "./text";

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

const PRIMITIVE_KINDS: Record<string, JsonKind> = {
  string: "string",
  number: "number",
  boolean: "boolean",
  object: "object",
};

function kindOf(v: unknown): JsonKind {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  const kind = typeof v;
  if (kind === "object") return Array.isArray(v) ? "array" : "object";
  return PRIMITIVE_KINDS[kind] ?? "other";
}

function isContainer(v: unknown): boolean {
  const kind = kindOf(v);
  return kind === "object" || kind === "array";
}

function sizeOf(v: unknown): number {
  if (Array.isArray(v)) return v.length;
  if (v && typeof v === "object") return Object.keys(v).length;
  return 0;
}

function initialOpen(src: unknown, collapsed: boolean | number): Set<string> {
  const open = new Set<string>();
  const maxDepth =
    collapsed === true ? 0 : collapsed === false ? Infinity : collapsed;
  const walk = (v: unknown, parts: (string | number)[]) => {
    if (parts.length >= maxDepth) return;
    if (!isContainer(v)) return;
    open.add(parts.length === 0 ? "$" : parts.join("."));
    for (const child of childrenOf(v)) {
      walk(child.value, [...parts, child.key]);
    }
  };
  walk(src, []);
  return open;
}

const SCALAR_COLORS: Partial<Record<JsonKind, (t: AdwaitaTheme) => string>> = {
  string: (t) => t.color.functional.success,
  number: (t) => t.color.accent.base,
  boolean: (t) => t.color.functional.warning,
};

function scalarColor(t: AdwaitaTheme, kind: JsonKind): string {
  const pick = SCALAR_COLORS[kind];
  return pick ? pick(t) : t.color.text.dim;
}

function formatScalar(v: unknown, shorten: number): string {
  if (v instanceof Date) return `"${v.toISOString()}"`;
  if (kindOf(v) !== "string") return String(v);
  const raw = v as string;
  const body =
    shorten > 0 && raw.length > shorten ? `${raw.slice(0, shorten)}…` : raw;
  return `"${body}"`;
}

function typeLabel(v: unknown): string {
  const kind = kindOf(v);
  if (kind === "other") return v instanceof Date ? "date" : "value";
  return kind;
}

function monoStyle(t: AdwaitaTheme): Partial<StyleDesc> {
  return {
    fontFamily: t.type.fontFamilyMono,
    fontSize: t.type.caption,
  };
}

function rowStyle(depth: number, indent: number): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 20,
    paddingLeft: depth > 0 ? indent : 0,
  };
}

function headerStyle(
  depth: number,
  indent: number,
  empty: boolean,
): Partial<StyleDesc> {
  const t = useAdwaita();
  return {
    ...rowStyle(depth, indent),
    cursor: empty ? "default" : "pointer",
    hover: empty ? undefined : { backgroundColor: t.color.accent.tint },
    borderRadius: 4,
  };
}

interface ChildEntry {
  key: string | number;
  value: unknown;
}

function childrenOf(value: unknown): ChildEntry[] {
  if (Array.isArray(value))
    return value.map((child, i) => ({ key: i, value: child }));
  if (value && typeof value === "object")
    return Object.entries(value as Record<string, unknown>).map(
      ([key, child]) => ({ key, value: child }),
    );
  return [];
}

function childPath(path: string, key: string | number): string {
  if (path === "$") return String(key);
  return `${path}.${key}`;
}

function Punctuation({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  return (
    <T color={t.color.text.dim} style={monoStyle(t)}>
      {children}
    </T>
  );
}

function Spacer() {
  return <div style={{ width: 12, flexShrink: 0 }} />;
}

function Chevron({ open }: { open: boolean }) {
  const t = useAdwaita();
  return (
    <Icon
      name={open ? "chevronDown" : "chevronRight"}
      size={12}
      color={t.color.text.dim}
      style={{ flexShrink: 0, pointerEvents: "none" }}
    />
  );
}

function NodeKeyLabel({
  name,
  isRoot,
}: {
  name: string | number | null;
  isRoot: boolean;
}) {
  const t = useAdwaita();
  const mono = monoStyle(t);
  const isIndex = typeof name === "number";
  const quoted = !isRoot && !isIndex && name !== null;
  const label = name === null ? "root" : quoted ? `"${name}"` : String(name);
  return (
    <>
      <T
        color={isIndex ? t.color.accent.base : t.color.text.primary}
        style={mono}
      >
        {label}
      </T>
      {!isRoot && !isIndex && name !== null ? (
        <Punctuation>:</Punctuation>
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

function ScalarRow({
  name,
  isRoot,
  value,
  depth,
  indent,
  shorten,
  showTypes,
}: Omit<NodeRowProps, "path" | "open" | "toggle">) {
  const t = useAdwaita();
  return (
    <div style={rowStyle(depth, indent)}>
      <Spacer />
      <NodeKeyLabel name={name} isRoot={isRoot} />
      <T color={scalarColor(t, kindOf(value))} style={monoStyle(t)}>
        {formatScalar(value, shorten)}
      </T>
      {showTypes ? <Punctuation>{typeLabel(value)}</Punctuation> : null}
    </div>
  );
}

function braceLabel(
  isArray: boolean,
  size: number,
  isOpen: boolean,
  empty: boolean,
): string {
  if (empty) return isArray ? "[]" : "{}";
  if (isOpen) return isArray ? "[" : "{";
  return isArray ? `[… ${size}]` : `{… ${size}}`;
}

function ContainerHeader({
  name,
  isRoot,
  isArray,
  size,
  isOpen,
  path,
  toggle,
  depth,
  indent,
  showTypes,
}: Pick<
  NodeRowProps,
  "name" | "isRoot" | "path" | "toggle" | "depth" | "indent" | "showTypes"
> & {
  isArray: boolean;
  size: number;
  isOpen: boolean;
}) {
  const empty = size === 0;
  return (
    <div
      onClick={empty ? undefined : () => toggle(path)}
      style={headerStyle(depth, indent, empty)}
    >
      {empty ? <Spacer /> : <Chevron open={isOpen} />}
      <NodeKeyLabel name={name} isRoot={isRoot} />
      <Punctuation>{braceLabel(isArray, size, isOpen, empty)}</Punctuation>
      {showTypes && !empty ? (
        <Punctuation>{isArray ? "array" : "object"}</Punctuation>
      ) : null}
    </div>
  );
}

function ContainerRow(props: NodeRowProps) {
  const t = useAdwaita();
  const { value, path, depth, open, toggle, indent, shorten, showTypes } =
    props;
  const isArray = kindOf(value) === "array";
  const size = sizeOf(value);
  const isOpen = open.has(path);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ContainerHeader
        name={props.name}
        isRoot={props.isRoot}
        isArray={isArray}
        size={size}
        isOpen={isOpen}
        path={path}
        toggle={toggle}
        depth={depth}
        indent={indent}
        showTypes={showTypes}
      />
      {isOpen && size > 0
        ? childrenOf(value).map((child) => (
            <NodeRow
              key={child.key}
              name={child.key}
              value={child.value}
              path={childPath(path, child.key)}
              depth={depth + 1}
              isRoot={false}
              open={open}
              toggle={toggle}
              indent={indent}
              shorten={shorten}
              showTypes={showTypes}
            />
          ))
        : null}
      {isOpen && size > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            minHeight: 20,
            paddingLeft: depth > 0 ? indent : 0,
          }}
        >
          <Spacer />
          <Punctuation>{isArray ? "]" : "}"}</Punctuation>
        </div>
      ) : null}
    </div>
  );
}

function NodeRow(props: NodeRowProps) {
  if (!isContainer(props.value)) return <ScalarRow {...props} />;
  return <ContainerRow {...props} />;
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
  const [open, setOpen] = useState<Set<string>>(() =>
    initialOpen(src, collapsed),
  );

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
