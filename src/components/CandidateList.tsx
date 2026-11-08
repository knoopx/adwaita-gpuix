import { type ReactNode } from "react";
import { useAdwaita } from "../theme/adwaita";
import { candidateListHeight } from "../lib/overlay";
import { T } from "./text";
import { CANDIDATE_ROW_HEIGHT } from "./CandidateRow";

export interface CandidateListProps {
  /** How many candidates are drawn — the windowed slice, not the whole set. */
  visible: number;
  /** What to say when there is nothing to pick, in the user's words. */
  placeholder?: string;
  /** Height of one row; `CANDIDATE_ROW_HEIGHT` unless the rows are taller. */
  rowHeight?: number;
  /** Let the list scroll past `visible` rows instead of windowing them. */
  scroll?: boolean;
  children?: ReactNode;
}

/**
 * The column a picker answers with. Its height is fixed to the rows it shows,
 * so a dialog never jumps while the query filters the set, and an empty set
 * keeps one row of room for the sentence that says so.
 */
export function CandidateList({
  visible,
  placeholder,
  rowHeight = CANDIDATE_ROW_HEIGHT,
  scroll = false,
  children,
}: CandidateListProps) {
  const t = useAdwaita();
  const rows = Math.max(visible, placeholder ? 1 : 0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.xs,
        height: candidateListHeight(rows, rowHeight, t.space.xs),
        ...(scroll ? { overflowY: "scroll" } : {}),
      }}
    >
      {visible > 0 ? (
        children
      ) : placeholder ? (
        <T size="body" color={t.color.text.dim}>
          {placeholder}
        </T>
      ) : null}
    </div>
  );
}
