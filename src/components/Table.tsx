import { Children, type ReactNode, createContext, useContext } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, hexToRgba, useAdwaita } from "../theme/adwaita";
import { T, type TextSize } from "./text";
import { Icon, type IconName } from "./icons";

export type TableCellAlign = "left" | "center" | "right";

function alignStyle(align: TableCellAlign | undefined): Partial<StyleDesc> {
  if (align === "center") return { justifyContent: "center" };
  if (align === "right") return { justifyContent: "flex-end" };
  return {};
}

const ELLIPSIS: Partial<StyleDesc> = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

function TableTextCell({
  size,
  weight,
  color,
  align,
  grow,
  children,
  style,
}: {
  size: TextSize;
  weight?: string | number;
  color: string;
  align?: TableCellAlign;
  grow?: number;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexGrow: 1,
        minWidth: 0,
        ...alignStyle(align),
        ...style,
      }}
    >
      <T
        size={size}
        weight={weight}
        color={color}
        align={align}
        style={ELLIPSIS}
      >
        {children}
      </T>
    </div>
  );
}

export interface TableCtxValue {
  rowHeight: number;
  iconSize: number;
  headerHeight: number;
  insetX: number;
  insetEnd: number;
  headerSize: TextSize;
  valueSize: TextSize;
  rowRadius: number;
  cellPaddingX: number;
  selectionFill: string;
}

const TableCtx = createContext<TableCtxValue | null>(null);

export function useTable(): TableCtxValue | null {
  return useContext(TableCtx);
}

export interface TableProps {
  children: ReactNode;

  density?: "cozy" | "dense" | "compact";

  selection?: "muted" | "accent";
  style?: Partial<StyleDesc>;
}

export function Table({
  children,
  density = "cozy",
  selection = "muted",
  style,
}: TableProps) {
  const t = useAdwaita();
  const c = t.control;
  const accent = selection === "accent";
  const ctxValue: TableCtxValue =
    density === "compact"
      ? {
          rowHeight: c.rowHeight,
          iconSize: c.compactIconSize,
          headerHeight: c.compactHeaderHeight,
          headerSize: "caption",
          valueSize: "body",

          insetX: 0,
          insetEnd: 0,
          rowRadius: 0,
          cellPaddingX: t.space.sm,
          selectionFill: accent
            ? t.color.selection.accent
            : t.color.selection.muted,
        }
      : density === "dense"
        ? {
            rowHeight: c.dataRowHeight,
            iconSize: c.dataIconSize,
            headerHeight: c.dataHeaderHeight,
            insetX: c.dataRowInsetX,
            insetEnd: c.dataRowInsetEnd,
            headerSize: "caption",
            valueSize: "list",
            rowRadius: t.radius.sm,
            cellPaddingX: t.space.xs,
            selectionFill: accent
              ? t.color.selection.accent
              : t.color.selection.faint,
          }
        : {
            rowHeight: c.listRowHeight,
            iconSize: c.listIconSize,
            headerHeight: c.columnHeaderHeight,
            insetX: c.listRowInsetX,
            insetEnd: c.listRowInsetEnd,
            headerSize: "list",
            valueSize: "list",
            rowRadius: t.radius.sm,
            cellPaddingX: t.space.xs,
            selectionFill: accent
              ? t.color.selection.accent
              : t.color.selection.faint,
          };
  return (
    <TableCtx.Provider value={ctxValue}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderWidth: 1,
          borderColor: t.color.border.default,
          overflow: "hidden",
          ...style,
        }}
      >
        {children}
      </div>
    </TableCtx.Provider>
  );
}

interface ResolvedRowFrame {
  height: number;
  insetX: number;
  insetEnd: number;
  cellPaddingX: number;
  rowRadius: number;
  selectionFill: string;
}

function rowGeometry(
  t: AdwaitaTheme,
  ctx: TableCtxValue | null,
): ResolvedRowFrame {
  const c = t.control;
  if (!ctx) {
    return {
      height: c.listRowHeight,
      insetX: c.listRowInsetX,
      insetEnd: c.listRowInsetEnd,
      cellPaddingX: t.space.xs,
      rowRadius: t.radius.sm,
      selectionFill: t.color.selection.faint,
    };
  }
  return {
    height: ctx.rowHeight,
    insetX: ctx.insetX,
    insetEnd: ctx.insetEnd,
    cellPaddingX: ctx.cellPaddingX,
    rowRadius: ctx.rowRadius,
    selectionFill: ctx.selectionFill,
  };
}

function rowFrameStyle(
  t: AdwaitaTheme,
  ctx: TableCtxValue | null,
  selected: boolean | undefined,
  onSelect: (() => void) | undefined,
): Partial<StyleDesc> {
  const g = rowGeometry(t, ctx);
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.control.listRowGap,
    height: g.height,
    marginLeft: g.insetX,
    marginRight: g.insetEnd,
    paddingLeft: g.cellPaddingX,
    paddingRight: g.cellPaddingX,
    borderRadius: g.rowRadius,
    cursor: onSelect ? "pointer" : "default",
    borderBottomWidth: 1,
    borderColor: t.color.border.default,
    backgroundColor: selected ? g.selectionFill : "transparent",
    hover: { backgroundColor: t.color.selection.faint },
  };
}

function headerFrameStyle(
  t: AdwaitaTheme,
  ctx: TableCtxValue | null,
): Partial<StyleDesc> {
  const c = t.control;
  const height = ctx ? ctx.rowHeight : c.columnHeaderHeight;
  const insetX = ctx ? ctx.insetX : c.listRowInsetX;
  const insetEnd = ctx ? ctx.insetEnd : c.listRowInsetEnd;
  const padX = ctx ? ctx.cellPaddingX : t.space.xs;
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: c.listRowGap,
    height,
    marginTop: c.columnHeaderPaddingTop,
    marginLeft: insetX,
    marginRight: insetEnd,
    paddingLeft: padX,
    paddingRight: padX,
  };
}

export interface TableHeaderProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TableHeader({ children, style }: TableHeaderProps) {
  const t = useAdwaita();
  const ctx = useTable();
  return (
    <div style={{ ...headerFrameStyle(t, ctx), ...style }}>{children}</div>
  );
}

export interface TableBodyProps {
  children: ReactNode;
  zebra?: boolean;
  style?: Partial<StyleDesc>;
}

export function TableBody({ children, zebra, style }: TableBodyProps) {
  const t = useAdwaita();
  const zebraBg = hexToRgba(t.color.text.primary, 0.04);
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {zebra
        ? Children.map(children, (child, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                ...(i % 2 === 1 ? { backgroundColor: zebraBg } : {}),
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

export interface TableFooterProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TableFooter({ children, style }: TableFooterProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderTopWidth: 1,
        borderColor: t.color.border.default,
        backgroundColor: hexToRgba(t.color.text.primary, 0.04),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface TableFootCellProps {
  children: ReactNode;
  align?: TableCellAlign;
  style?: Partial<StyleDesc>;
}

export function TableFootCell({ children, align, style }: TableFootCellProps) {
  const t = useAdwaita();
  return (
    <TableTextCell
      size="body"
      weight={500}
      color={t.color.text.primary}
      align={align}
      style={style}
    >
      {children}
    </TableTextCell>
  );
}

export interface TableRowProps {
  children: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  style?: Partial<StyleDesc>;
}

export function TableRow({
  children,
  selected,
  onSelect,
  style,
}: TableRowProps) {
  const t = useAdwaita();
  const ctx = useTable();
  return (
    <div
      onClick={onSelect}
      style={{ ...rowFrameStyle(t, ctx, selected, onSelect), ...style }}
    >
      {children}
    </div>
  );
}

export interface TableHeadProps {
  children: ReactNode;
  align?: TableCellAlign;
  grow?: number;
  style?: Partial<StyleDesc>;
}

export function TableHead({ children, align, grow, style }: TableHeadProps) {
  const t = useAdwaita();
  return (
    <TableTextCell
      size={useTable()?.headerSize ?? "list"}
      color={t.color.text.dim}
      align={align}
      grow={grow}
      style={style}
    >
      {children}
    </TableTextCell>
  );
}

export interface TableCellProps {
  children: ReactNode;
  align?: TableCellAlign;
  muted?: boolean;
  grow?: number;
  style?: Partial<StyleDesc>;
}

export function TableCell({
  children,
  align,
  muted,
  grow,
  style,
}: TableCellProps) {
  const t = useAdwaita();
  return (
    <TableTextCell
      size={useTable()?.valueSize ?? "list"}
      color={muted ? t.color.text.dim : t.color.text.primary}
      align={align}
      grow={grow}
      style={style}
    >
      {children}
    </TableTextCell>
  );
}

export interface TableLeadCellProps {
  icon: IconName;
  iconColor?: string;
  children: ReactNode;
  align?: TableCellAlign;
  grow?: number;
  style?: Partial<StyleDesc>;
}

export function TableLeadCell({
  icon,
  iconColor,
  children,
  align,
  grow,
  style,
}: TableLeadCellProps) {
  const t = useAdwaita();
  const iconSize = useTable()?.iconSize ?? t.control.listIconSize;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.control.listRowGap,
        flexGrow: grow ?? 6.2,
        flexShrink: 0,
        minWidth: 0,
        ...alignStyle(align),
        ...style,
      }}
    >
      <Icon
        name={icon}
        size={iconSize}
        color={iconColor ?? t.color.accent.base}
      />
      <T
        size={useTable()?.valueSize ?? "list"}
        color={t.color.text.primary}
        style={{ ...ELLIPSIS, flexGrow: 0, minWidth: 0 }}
      >
        {children}
      </T>
    </div>
  );
}

export interface TableNodeCellProps {
  children: ReactNode;
  align?: TableCellAlign;
  grow?: number;
  style?: Partial<StyleDesc>;
}

export function TableNodeCell({
  children,
  align,
  grow = 1,
  style,
}: TableNodeCellProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexGrow: grow,
        flexShrink: 0,
        minWidth: 0,
        ...alignStyle(align),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface TableCaptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TableCaption({ children, style }: TableCaptionProps) {
  const t = useAdwaita();
  const pad = t.space.sm;
  return (
    <div style={{ padding: pad, ...style }}>
      <T size="caption" color={t.color.text.dim}>
        {children}
      </T>
    </div>
  );
}
