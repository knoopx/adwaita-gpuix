import type { Bookmark } from "./types";

/**
 * The remote jj synthesises for its git view. Bookmarks on it are duplicates
 * of the local ones, so the parsers drop them.
 */
export const IMPLICIT_GIT_REMOTE = "git";

/**
 * `jj bookmark list -T` template: name, target change id, remote, description
 * and author, tab separated.
 */
export const BOOKMARKS_TEMPLATE =
  'name ++ "\\t" ++ if(normal_target, normal_target.change_id(), "") ++ "\\t" ++ remote ++ "\\t" ++ ' +
  'if(normal_target, normal_target.description(), "") ++ "\\t" ++ ' +
  'if(normal_target, normal_target.author().name(), "") ++ "\\n"';

/** The args for `jj bookmark list` that match BOOKMARKS_TEMPLATE. */
export const BOOKMARK_LIST_ARGS: readonly string[] = [
  "bookmark",
  "list",
  "--all-remotes",
  "--color",
  "never",
  "-T",
  BOOKMARKS_TEMPLATE,
];

/**
 * Parse tab-separated bookmark rows, skipping the implicit `git` remote and
 * any reference seen twice.
 */
export function parseBookmarkList(out: string): Bookmark[] {
  const seen = new Set<string>();
  const bookmarks: Bookmark[] = [];
  for (const line of out.split("\n")) {
    if (line.trim().length === 0) continue;
    const [name, change_id, remote, description, author] = line.split("\t");
    if (!name) continue;
    if (remote === IMPLICIT_GIT_REMOTE) continue;
    const reference = remote ? `${remote}/${name}` : name;
    if (seen.has(reference)) continue;
    seen.add(reference);
    bookmarks.push({
      name,
      change_id: change_id ?? "",
      description: description ?? "",
      author: author ?? "",
      remote: remote ?? "",
      reference,
    });
  }
  return bookmarks;
}

/**
 * Bookmark names grouped by the change they point at. A bookmark on a remote
 * is named by its qualified reference so it cannot be confused with a local
 * bookmark of the same name.
 */
export function bookmarksByChange(
  bookmarks: readonly Bookmark[],
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const b of bookmarks) {
    if (!b.change_id) continue;
    const names = map.get(b.change_id) ?? [];
    names.push(b.remote ? b.reference : b.name);
    map.set(b.change_id, names);
  }
  return map;
}
