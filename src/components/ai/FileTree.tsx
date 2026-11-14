import { type ReactNode, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon, type IconName } from "../../components/icons";
import { DiffStats } from "../../components/vcs/DiffStats";
import type { FileRowStats } from "../../components/vcs/FileRowData";
import { isActivateKey } from "../../lib/roving";

const ICON_SIZE = 14;
const CHEVRON_SIZE = 12;

export interface FileTreeNode {
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];

  /** What this path moved, when the tree is a changeset rather than a directory. */
  added?: number;
  removed?: number;
}

/**
 * Two things wear a tree. A *picker* asks the human to choose a path, so every
 * row is a button and its label is quiet until it is taken. A *list* — the files
 * of a change, the shape of a package — is read, not chosen, so its rows are
 * flush, its labels are ink, and only the folders answer to a click.
 */
export type FileTreeVariant = "picker" | "list";

export interface FileTreeProps {
  items: FileTreeNode[];

  expandedPaths?: string[];

  defaultExpandedPaths?: string[];
  onExpandedChange?: (paths: string[]) => void;

  selectedPath?: string;
  onSelect?: (path: string) => void;

  variant?: FileTreeVariant;
  style?: Partial<StyleDesc>;
}

function pathOf(parent: string, name: string): string {
  return parent ? `${parent}/${name}` : name;
}

function rowStyle(
  t: AdwaitaTheme,
  selected: boolean,
  interactive: boolean,
  variant: FileTreeVariant,
): Partial<StyleDesc> {
  const flat = variant === "list";
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.space.sm,
    padding: flat ? t.space.xs : t.space.sm,
    borderRadius: t.radius.sm,
    cursor: interactive ? "pointer" : "default",
    backgroundColor: selected
      ? t.color.accent.tint
      : flat || !interactive
        ? "transparent"
        : t.color.surface.button,
    hover:
      interactive && !selected
        ? {
            backgroundColor: flat
              ? t.color.selection.faint
              : t.color.surface.buttonHover,
          }
        : undefined,
  };
}

function rowLabelStyle(t: AdwaitaTheme, color: string): Partial<StyleDesc> {
  return {
    color,
    fontFamily: t.type.fontFamilyMono,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
}

function FileTreeRowContents({
  icon,
  name,
  selected,
  variant,
}: {
  icon: IconName;
  name: string;
  selected: boolean;
  variant: FileTreeVariant;
}) {
  const t = useAdwaita();
  const flat = variant === "list";
  return (
    <>
      <Icon
        name={icon}
        size={ICON_SIZE}
        color={
          selected
            ? t.color.accent.base
            : flat
              ? t.color.text.secondary
              : t.color.text.dim
        }
      />
      <T
        size={flat ? "list" : "caption"}
        style={rowLabelStyle(
          t,
          selected || flat ? t.color.text.primary : t.color.text.dim,
        )}
      >
        {name}
      </T>
    </>
  );
}

/** The `+24 -6` a changeset's row trails, quiet when the path did not move. */
function FileTreeStats({
  added,
  removed,
  stats,
}: {
  added?: number;
  removed?: number;
  stats?: FileRowStats;
}) {
  if (added === undefined && removed === undefined) return null;
  return (
    <DiffStats
      insertions={added ?? 0}
      deletions={removed ?? 0}
      stats={stats}
      hideZero
    />
  );
}

/**
 * The widest counts anywhere in the tree.
 *
 * A `+41` under a `+128` is only a column if both stand the same distance from
 * the right, so the tree is measured once and every row is drawn against that
 * measure — the same trick the changes panel plays with `fileRowStats`.
 */
export function fileTreeStats(items: readonly FileTreeNode[]): FileRowStats {
  const walk = (nodes: readonly FileTreeNode[], max: FileRowStats): FileRowStats =>
    nodes.reduce((soFar, node) => {
      const next: FileRowStats = {
        insertions: Math.max(soFar.insertions, node.added ?? 0),
        deletions: Math.max(soFar.deletions, node.removed ?? 0),
      };
      return node.children ? walk(node.children, next) : next;
    }, max);
  return walk(items, { insertions: 0, deletions: 0 });
}

export function FileTree({
  items,
  expandedPaths,
  defaultExpandedPaths,
  onExpandedChange,
  selectedPath,
  onSelect,
  variant = "picker",
  style,
}: FileTreeProps) {
  const t = useAdwaita();
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandedPaths ?? []),
  );
  const expanded =
    expandedPaths !== undefined ? new Set(expandedPaths) : internalExpanded;

  const stats = fileTreeStats(items);

  const toggle = (path: string) => {
    const next = new Set(expanded);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    if (expandedPaths === undefined) setInternalExpanded(next);
    onExpandedChange?.(Array.from(next));
  };

  const renderNodes = (nodes: FileTreeNode[], parent: string): ReactNode =>
    nodes.map((node) => {
      const path = pathOf(parent, node.name);
      if (node.type === "folder") {
        const isExpanded = expanded.has(path);
        const contents =
          node.children && node.children.length > 0
            ? renderNodes(node.children, path)
            : null;
        return (
          <FileTreeFolder
            key={path}
            name={node.name}
            expanded={isExpanded}
            onToggle={contents === null ? undefined : () => toggle(path)}
            selected={selectedPath === path}
            added={node.added}
            removed={node.removed}
            stats={stats}
            variant={variant}
          >
            {contents}
          </FileTreeFolder>
        );
      }
      return (
        <FileTreeFile
          key={path}
          name={node.name}
          selected={selectedPath === path}
          added={node.added}
          removed={node.removed}
          stats={stats}
          variant={variant}
          onSelect={onSelect === undefined ? undefined : () => onSelect(path)}
        />
      );
    });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: variant === "list" ? 0 : t.space.sm,
        ...style,
      }}
    >
      {renderNodes(items, "")}
    </div>
  );
}

export interface FileTreeFolderProps {
  name: string;
  expanded: boolean;
  onToggle?: () => void;
  selected?: boolean;

  added?: number;
  removed?: number;

  /** The widest counts in the tree, so a row's figures line up with its siblings'. */
  stats?: FileRowStats;

  variant?: FileTreeVariant;

  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

/** A folder with nothing under it: the gutter stays, the chevron does not. */
function FolderGutter({
  t,
  expanded,
  empty,
}: {
  t: AdwaitaTheme;
  expanded: boolean;
  empty: boolean;
}) {
  if (empty) return <div style={{ width: CHEVRON_SIZE, flexShrink: 0 }} />;
  return (
    <Icon
      name={expanded ? "chevronDown" : "chevronRight"}
      size={CHEVRON_SIZE}
      color={t.color.text.dim}
      style={{ flexShrink: 0 }}
    />
  );
}

export function FileTreeFolder({
  name,
  expanded,
  onToggle,
  selected,
  added,
  removed,
  stats,
  variant = "picker",
  children,
  style,
}: FileTreeFolderProps) {
  const t = useAdwaita();
  const isSelected = selected === true;
  // A folder that names nothing has nothing to open, so it takes no click and
  // prints no chevron: an open mark over a run of rows below it is read as those
  // rows standing inside it, which is the one thing a flat listing must not say.
  const hasContents =
    children !== null && children !== undefined && children !== false;
  const interactive = onToggle !== undefined && hasContents;
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <div
        onClick={interactive ? onToggle : undefined}
        tabIndex={interactive ? 0 : -1}
        onKeyDown={
          interactive
            ? (event) => {
                if (isActivateKey(event.key, { space: true })) onToggle?.();
              }
            : undefined
        }
        style={rowStyle(t, isSelected, interactive, variant)}
      >
        <FolderGutter t={t} expanded={expanded} empty={!hasContents} />
        <FileTreeRowContents
          icon="folder"
          name={name}
          selected={isSelected}
          variant={variant}
        />
        <FileTreeStats added={added} removed={removed} stats={stats} />
      </div>
      {expanded && hasContents ? (
        <div style={{ paddingLeft: t.space.md }}>{children}</div>
      ) : null}
    </div>
  );
}

export interface FileTreeFileProps {
  name: string;
  selected?: boolean;
  onSelect?: () => void;

  added?: number;
  removed?: number;

  /** The widest counts in the tree, so a row's figures line up with its siblings'. */
  stats?: FileRowStats;

  variant?: FileTreeVariant;

  style?: Partial<StyleDesc>;
}

export function FileTreeFile({
  name,
  selected,
  onSelect,
  added,
  removed,
  stats,
  variant = "picker",
  style,
}: FileTreeFileProps) {
  const t = useAdwaita();
  const isSelected = selected === true;
  const interactive = onSelect !== undefined;
  return (
    <div
      onClick={interactive ? onSelect : undefined}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={
        interactive
          ? (event) => {
              if (isActivateKey(event.key, { space: true })) onSelect?.();
            }
          : undefined
      }
      style={{ ...rowStyle(t, isSelected, interactive, variant), ...style }}
    >
      <div style={{ width: CHEVRON_SIZE, flexShrink: 0 }} />
      <FileTreeRowContents
        icon="article"
        name={name}
        selected={isSelected}
        variant={variant}
      />
      <FileTreeStats added={added} removed={removed} stats={stats} />
    </div>
  );
}
