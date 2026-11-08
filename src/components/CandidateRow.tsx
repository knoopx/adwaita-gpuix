import { useAdwaita } from "../theme/adwaita";
import { type TextTone, textToneColor } from "../theme/tones";
import { candidateRowStyle } from "../lib/overlay";
import { T } from "./text";
import { Icon, type IconName } from "./icons";

/** One row in a picker's candidate list. */
export const CANDIDATE_ROW_HEIGHT = 24;

/** The glyph that names a candidate. */
const CANDIDATE_GLYPH = 14;

export interface CandidateRowProps {
  /** The candidate itself — a bookmark name, a revset, a path. */
  label: string;
  /** The row the picker's cursor is on. */
  active?: boolean;
  /** The icon naming this kind of candidate. */
  icon?: IconName;
  /** Colour of that icon; an active row is accent by definition. */
  iconTone?: TextTone;
  /** Colour of the label — `warning` for a candidate about to be created. */
  labelTone?: TextTone;
  /** The label is an identifier (revset, path, change id), so it is mono. */
  mono?: boolean;
  /** Secondary text pushed to the trailing edge of the row. */
  trailing?: string;
  /** `trailing` is an identifier too. */
  trailingMono?: boolean;
  onSelect?: () => void;
}

/**
 * One candidate in a picker's list: a glyph, the candidate, and any secondary
 * text pushed to the trailing edge. The row the cursor is on answers with a
 * tint and the accent, so the selection reads without a border anywhere.
 */
export function CandidateRow({
  label,
  active = false,
  icon,
  iconTone,
  labelTone,
  mono = false,
  trailing,
  trailingMono = false,
  onSelect,
}: CandidateRowProps) {
  const t = useAdwaita();
  const monoFamily = t.type.fontFamilyMono;
  return (
    <div onClick={onSelect} style={candidateRowStyle(t, active)}>
      {icon ? (
        <Icon
          name={icon}
          size={CANDIDATE_GLYPH}
          color={textToneColor(t, iconTone ?? (active ? "accent" : "dim"))}
        />
      ) : null}
      <T
        size="body"
        weight={active ? 600 : 400}
        color={textToneColor(t, labelTone ?? (active ? "accent" : "default"))}
        style={{
          minWidth: 0,
          whiteSpace: "nowrap",
          ...(mono ? { fontFamily: monoFamily } : {}),
        }}
      >
        {label}
      </T>
      {trailing ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <T
            size="caption"
            color={t.color.text.dim}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              ...(trailingMono ? { fontFamily: monoFamily } : {}),
            }}
          >
            {trailing}
          </T>
        </div>
      ) : null}
    </div>
  );
}
