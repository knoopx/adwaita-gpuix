import { type ReactNode, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon, type IconName } from "../../components/icons";
import { isActivateKey } from "../../lib/roving";

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
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.space.sm,
    padding: t.space.sm,
    borderRadius: t.radius.sm,
    cursor: interactive ? "pointer" : "default",
    backgroundColor: selected ? t.color.accent.tint : t.color.surface.button,
    hover:
      interactive && !selected
        ? { backgroundColor: t.color.surface.buttonHover }
        : undefined,
  };
}

function rowLabelStyle(t: AdwaitaTheme, color: string): Partial<StyleDesc> {
  return {
    color,
    fontFamily: t.type.fontFamilyMono,
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
}: {
  icon: IconName;
  name: string;
  selected: boolean;
}) {
  const t = useAdwaita();
  return (
    <>
      <Icon
        name={icon}
        size={ICON_SIZE}
        color={selected ? t.color.accent.base : t.color.text.dim}
      />
      <T
        size="caption"
        style={rowLabelStyle(
          t,
          selected ? t.color.text.primary : t.color.text.dim,
        )}
      >
        {name}
      </T>
    </>
  );
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
        padding: t.space.sm,
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
                if (isActivateKey(event.key, { space: true })) onToggle?.();
              }
            : undefined
        }
        style={rowStyle(t, isSelected, interactive)}
      >
        <Icon
          name={expanded ? "chevronDown" : "chevronRight"}
          size={CHEVRON_SIZE}
          color={t.color.text.dim}
          style={{ flexShrink: 0 }}
        />
        <FileTreeRowContents icon="folder" name={name} selected={isSelected} />
      </div>
      {expanded ? (
        <div style={{ paddingLeft: t.space.md }}>{children}</div>
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
      style={{ ...rowStyle(t, isSelected, interactive), ...style }}
    >
      <div style={{ width: CHEVRON_SIZE, flexShrink: 0 }} />
      <FileTreeRowContents icon="article" name={name} selected={isSelected} />
    </div>
  );
}
