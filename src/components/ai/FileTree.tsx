import { useState, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import {
  useAdwaita,
  type AdwaitaTheme,
} from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon } from "../../components/icons";

const ICON_SIZE = 14;
const CHEVRON_SIZE = 12;

export interface FileTreeNode {
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
}

export interface FileTreeProps {
  items: FileTreeNode[];

  expandedPaths?: string[];

  defaultExpandedPaths?: string[];
  onExpandedChange?: (paths: string[]) => void;

  selectedPath?: string;
  onSelect?: (path: string) => void;
  style?: Partial<StyleDesc>;
}

function pathOf(parent: string, name: string): string {
  return parent ? `${parent}/${name}` : name;
}

function rowStyle(
  t: AdwaitaTheme,
  selected: boolean,
  interactive: boolean,
): Partial<StyleDesc> {
  const { colors, radii, spacing } = t;
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.gap,
    padding: spacing.gap,
    borderRadius: radii.row,
    cursor: interactive ? "pointer" : "default",
    backgroundColor: selected ? colors.accentTint : colors.button_bg,
    hover:
      interactive && !selected
        ? { backgroundColor: colors.button_hover }
        : undefined,
  };
}

function rowLabelStyle(
  t: AdwaitaTheme,
  color: string,
): Partial<StyleDesc> {
  return {
    color,
    fontFamily: t.typography.fontFamilyMono,
    flexShrink: 1,
    minWidth: 0,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
}

export function FileTree({
  items,
  expandedPaths,
  defaultExpandedPaths,
  onExpandedChange,
  selectedPath,
  onSelect,
  style,
}: FileTreeProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandedPaths ?? []),
  );
  const expanded =
    expandedPaths !== undefined ? new Set(expandedPaths) : internalExpanded;

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
        return (
          <FileTreeFolder
            key={path}
            name={node.name}
            expanded={isExpanded}
            onToggle={() => toggle(path)}
            selected={selectedPath === path}
          >
            {node.children && node.children.length > 0
              ? renderNodes(node.children, path)
              : null}
          </FileTreeFolder>
        );
      }
      return (
        <FileTreeFile
          key={path}
          name={node.name}
          selected={selectedPath === path}
          onSelect={() => onSelect?.(path)}
        />
      );
    });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: spacing.gap,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
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

  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function FileTreeFolder({
  name,
  expanded,
  onToggle,
  selected,
  children,
  style,
}: FileTreeFolderProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  const isSelected = selected === true;
  const interactive = onToggle !== undefined;
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <div
        onClick={interactive ? onToggle : undefined}
        tabIndex={interactive ? 0 : -1}
        onKeyDown={
          interactive
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") onToggle?.();
              }
            : undefined
        }
        style={rowStyle(t, isSelected, interactive)}
      >
        <Icon
          name={expanded ? "chevronDown" : "chevronRight"}
          size={CHEVRON_SIZE}
          color={colors.dim_fg}
          style={{ flexShrink: 0 }}
        />
        <Icon
          name="folder"
          size={ICON_SIZE}
          color={isSelected ? colors.accent : colors.dim_fg}
        />
        <T
          size="caption"
          style={rowLabelStyle(t, isSelected ? colors.fg : colors.dim_fg)}
        >
          {name}
        </T>
      </div>
      {expanded ? (
        <div style={{ paddingLeft: spacing.paddingTight }}>{children}</div>
      ) : null}
    </div>
  );
}

export interface FileTreeFileProps {
  name: string;
  selected?: boolean;
  onSelect?: () => void;
  style?: Partial<StyleDesc>;
}

export function FileTreeFile({
  name,
  selected,
  onSelect,
  style,
}: FileTreeFileProps) {
  const t = useAdwaita();
  const { colors } = t;
  const isSelected = selected === true;
  const interactive = onSelect !== undefined;
  return (
    <div
      onClick={interactive ? onSelect : undefined}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") onSelect?.();
            }
          : undefined
      }
      style={{ ...rowStyle(t, isSelected, interactive), ...style }}
    >
      <div style={{ width: CHEVRON_SIZE, flexShrink: 0 }} />
      <Icon
        name="fileText"
        size={ICON_SIZE}
        color={isSelected ? colors.accent : colors.dim_fg}
      />
      <T
        size="caption"
        style={rowLabelStyle(t, isSelected ? colors.fg : colors.dim_fg)}
      >
        {name}
      </T>
    </div>
  );
}
