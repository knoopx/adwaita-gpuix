import { useMemo } from "react";
import { type StyleDesc, useGpuixRequired } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { FILE_HEADER_ROW_HEIGHT, nativeDiffTheme } from "../../theme/vcs";
import { T } from "../text";
import { summarizePatch } from "./DiffPanel";
import { DIFF_METRICS, diffHeightOf } from "./diffRows";

const INLINE_MAX_LINES = 40;

export interface ToolDiffProps {
  patch: string;

  path?: string;

  maxLines?: number;

  wordDiff?: boolean;

  summary?: boolean;

  fileHeader?: boolean;

  style?: Partial<StyleDesc>;
}

function diffStyle(style?: Partial<StyleDesc>): Partial<StyleDesc> {
  return {
    width: "100%",
    minWidth: 0,
    flexShrink: 0,
    borderWidth: 0,
    ...style,
  };
}

function cropStyle(style?: Partial<StyleDesc>): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minWidth: 0,
    flexShrink: 0,
    borderWidth: 0,
    overflow: "hidden",
    ...style,
  };
}

export function ToolDiff({
  patch,
  path,
  maxLines = INLINE_MAX_LINES,
  wordDiff = true,
  summary = false,
  fileHeader = false,
  style,
}: ToolDiffProps) {
  const t = useAdwaita();
  useGpuixRequired();
  const theme = nativeDiffTheme(
    t,
    fileHeader ? undefined : { fileHeaderHeight: FILE_HEADER_ROW_HEIGHT },
  );
  const stats = useMemo(
    () => (summary ? summarizePatch(patch) : null),
    [summary, patch],
  );

  if (!fileHeader) {
    const croppedHeight =
      diffHeightOf(patch, maxLines, {
        ...DIFF_METRICS,
        fileHeaderHeight: FILE_HEADER_ROW_HEIGHT,
      }) - FILE_HEADER_ROW_HEIGHT;

    if (croppedHeight <= 0) {
      return (
        <diff
          patch={patch}
          wordDiff={wordDiff}
          maxLines={maxLines}
          theme={theme}
          style={diffStyle(style)}
        />
      );
    }

    return (
      <div style={{ ...cropStyle(style), height: croppedHeight }}>
        <diff
          patch={patch}
          wordDiff={wordDiff}
          maxLines={maxLines}
          theme={theme}
          style={{ ...diffStyle(), marginTop: -FILE_HEADER_ROW_HEIGHT }}
        />
      </div>
    );
  }

  if (stats === null) {
    return (
      <diff
        patch={patch}
        wordDiff={wordDiff}
        maxLines={maxLines}
        theme={theme}
        style={diffStyle(style)}
      />
    );
  }

  const mono: Partial<StyleDesc> = { fontFamily: t.type.fontFamilyMono };
  const label = path ?? stats.name;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.xs,
        width: "100%",
        minWidth: 0,
        flexShrink: 0,
        borderWidth: 0,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.sm,
          minWidth: 0,
          flexShrink: 0,
        }}
      >
        {label !== "" ? (
          <T
            size="caption"
            color={t.color.text.dim}
            style={{
              ...mono,
              flexGrow: 1,
              flexShrink: 1,
              minWidth: 0,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {label}
          </T>
        ) : null}
        <T
          size="caption"
          weight={t.type.weight.semibold}
          color={t.color.functional.success}
          style={{ ...mono, flexShrink: 0 }}
        >
          {`+${stats.added}`}
        </T>
        <T
          size="caption"
          weight={t.type.weight.semibold}
          color={t.color.functional.destructive}
          style={{ ...mono, flexShrink: 0 }}
        >
          {`-${stats.removed}`}
        </T>
      </div>
      <diff
        patch={patch}
        wordDiff={wordDiff}
        maxLines={maxLines}
        theme={theme}
        style={diffStyle()}
      />
    </div>
  );
}
