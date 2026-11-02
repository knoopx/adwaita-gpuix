import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { DISABLED_OPACITY } from "./disabled.ts";
import { Icon } from "./icons";

export interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  style?: Partial<StyleDesc>;
}

export function pageSequence(
  page: number,
  pages: number,
): (number | "ellipsis")[] {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
  const seq: (number | "ellipsis")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);
  if (start > 2) seq.push("ellipsis");
  for (let i = start; i <= end; i++) seq.push(i);
  if (end < pages - 1) seq.push("ellipsis");
  seq.push(pages);
  return seq;
}

function pageButtonStyle(
  t: AdwaitaTheme,
  active: boolean | undefined,
  disabled: boolean | undefined,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  const selected = active ? t.color.accent.base : t.color.surface.button;
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    borderRadius: t.radius.sm,
    borderWidth: 0,
    backgroundColor: selected,
    opacity: disabled ? DISABLED_OPACITY : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    ...(disabled
      ? {}
      : {
          hover: {
            backgroundColor: active ? selected : t.color.surface.buttonHover,
          },
          active: {
            backgroundColor: active ? selected : t.color.surface.buttonActive,
          },
        }),
    ...style,
  };
}

interface PageButtonProps {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
  children: ReactNode;
}

function PageButton({
  active,
  disabled,
  onClick,
  style,
  children,
}: PageButtonProps) {
  const t = useAdwaita();
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={pageButtonStyle(t, active, disabled, { width: 32, ...style })}
    >
      {children}
    </div>
  );
}

export function Pagination({
  page,
  pages,
  onPageChange,
  style,
}: PaginationProps) {
  const t = useAdwaita();
  const sequence = pageSequence(page, pages);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        ...style,
      }}
    >
      <PageButton
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        <Icon name="chevronLeft" size={16} color={t.color.text.dim} />
      </PageButton>

      {sequence.map((n, i) =>
        n === "ellipsis" ? (
          <PaginationEllipsis key={`e-${i}`} />
        ) : (
          <PageButton
            key={n}
            active={n === page}
            onClick={() => onPageChange(n)}
          >
            <T
              size="body"
              color={n === page ? t.color.text.onAccent : t.color.text.primary}
              style={{ pointerEvents: "none" }}
            >
              {String(n)}
            </T>
          </PageButton>
        ),
      )}

      <PageButton
        disabled={page >= pages}
        onClick={() => onPageChange(Math.min(pages, page + 1))}
      >
        <Icon name="chevronRight" size={16} color={t.color.text.dim} />
      </PageButton>
    </div>
  );
}

export interface PaginationContentProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function PaginationContent({ children, style }: PaginationContentProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface PaginationItemProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function PaginationItem({ children, style }: PaginationItemProps) {
  return <div style={style}>{children}</div>;
}

export interface PaginationLinkProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}

export function PaginationLink({
  children,
  active,
  onClick,
  style,
}: PaginationLinkProps) {
  const t = useAdwaita();
  return (
    <div
      onClick={onClick}
      style={pageButtonStyle(t, active, false, { minWidth: 32, ...style })}
    >
      <T
        size="body"
        color={active ? t.color.text.onAccent : t.color.text.primary}
        style={{ pointerEvents: "none" }}
      >
        {children}
      </T>
    </div>
  );
}

export interface PaginationPreviousProps {
  onClick?: () => void;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function PaginationPrevious({
  onClick,
  disabled,
  style,
}: PaginationPreviousProps) {
  const t = useAdwaita();
  return (
    <PageButton disabled={disabled} onClick={onClick} style={style}>
      <Icon name="chevronLeft" size={16} color={t.color.text.dim} />
    </PageButton>
  );
}

export interface PaginationNextProps {
  onClick?: () => void;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function PaginationNext({
  onClick,
  disabled,
  style,
}: PaginationNextProps) {
  const t = useAdwaita();
  return (
    <PageButton disabled={disabled} onClick={onClick} style={style}>
      <Icon name="chevronRight" size={16} color={t.color.text.dim} />
    </PageButton>
  );
}

export interface PaginationEllipsisProps {
  style?: Partial<StyleDesc>;
}

export function PaginationEllipsis({ style }: PaginationEllipsisProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        ...style,
      }}
    >
      <T size="body" color={t.color.text.dim} style={{ pointerEvents: "none" }}>
        …
      </T>
    </div>
  );
}
