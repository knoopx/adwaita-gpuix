import { Children, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba } from "../theme/adwaita";
import { T, type TextSize } from "./common";

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
  children,
  style,
}: {
  size: TextSize;
  weight?: string | number;
  color: string;
  align?: TableCellAlign;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const pad = t.spacing.gap;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
        minWidth: 0,
        padding: pad,
        ...alignStyle(align),
        ...style,
      }}
    >
      <T size={size} weight={weight} color={color} align={align} style={ELLIPSIS}>
        {children}
      </T>
    </div>
  );
}

export interface TableProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Table({ children, style }: TableProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface TableHeaderProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TableHeader({ children, style }: TableHeaderProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.headerbar_bg,
        borderBottomWidth: 1,
        borderColor: colors.border,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface TableBodyProps {
  children: ReactNode;
  zebra?: boolean;
  style?: Partial<StyleDesc>;
}

export function TableBody({ children, zebra, style }: TableBodyProps) {
  const t = useAdwaita();
  const zebraBg = hexToRgba(t.colors.fg, 0.04);
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
  const { colors } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: hexToRgba(colors.fg, 0.04),
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

export function TableFootCell({
  children,
  align,
  style,
}: TableFootCellProps) {
  const t = useAdwaita();
  return (
    <TableTextCell
      size="body"
      weight={500}
      color={t.colors.fg}
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
  style?: Partial<StyleDesc>;
}

export function TableRow({ children, selected, style }: TableRowProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: colors.border,
        ...(selected ? { backgroundColor: colors.accentTint } : {}),
        hover: { backgroundColor: colors.accentTint },
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface TableHeadProps {
  children: ReactNode;
  align?: TableCellAlign;
  style?: Partial<StyleDesc>;
}

export function TableHead({ children, align, style }: TableHeadProps) {
  const t = useAdwaita();
  return (
    <TableTextCell
      size="caption"
      weight={700}
      color={t.colors.dim_fg}
      align={align}
      style={style}
    >
      {children}
    </TableTextCell>
  );
}

export interface TableCellProps {
  children: ReactNode;
  align?: TableCellAlign;
  style?: Partial<StyleDesc>;
}

export function TableCell({ children, align, style }: TableCellProps) {
  const t = useAdwaita();
  return (
    <TableTextCell
      size="body"
      color={t.colors.fg}
      align={align}
      style={style}
    >
      {children}
    </TableTextCell>
  );
}

export interface TableCaptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function TableCaption({ children, style }: TableCaptionProps) {
  const t = useAdwaita();
  const pad = t.spacing.gap;
  return (
    <div style={{ padding: pad, ...style }}>
      <T size="caption" color={t.colors.dim_fg}>
        {children}
      </T>
    </div>
  );
}
