import type { Bookmark } from "./types";


export const IMPLICIT_GIT_REMOTE = "git";


export const BOOKMARKS_TEMPLATE =
  'name ++ "\\t" ++ if(normal_target, normal_target.change_id(), "") ++ "\\t" ++ remote ++ "\\t" ++ ' +
  'if(normal_target, normal_target.description().first_line(), "") ++ "\\t" ++ ' +
  'if(normal_target, normal_target.author().name(), "") ++ "\\n"';


export const BOOKMARK_LIST_ARGS: readonly string[] = [
  "bookmark",
  "list",
  "--all-remotes",
  "--color",
  "never",
  "-T",
  BOOKMARKS_TEMPLATE,
];


export function parseBookmarkList(out: string): Bookmark[] {
  const seen = new Set<string>();
  const bookmarks: Bookmark[] = [];
  for (const line of out.split("\n")) {
    if (line.trim().length === 0) continue;
    const parts = line.split("\t");
    if (parts.length < 3) continue;
    const [name, change_id, remote] = parts;
    if (!name) continue;
    
    
    const tail = parts.slice(3);
    const author = tail.pop() ?? "";
    const description = tail.join("\t");
    if (remote === IMPLICIT_GIT_REMOTE) continue;
    const reference = remote ? `${remote}/${name}` : name;
    if (seen.has(reference)) continue;
    seen.add(reference);
    bookmarks.push({
      name,
      change_id: change_id ?? "",
      description,
      author,
      remote: remote ?? "",
      reference,
    });
  }
  return bookmarks;
}


/**
 * The names offered when a bookmark is written: the ones jj answered with a
 * target change, deduped and sorted. A row without a target is not a bookmark
 * a name can be written to, so it never reaches the picker.
 */
export function bookmarkNames(bookmarks: readonly Bookmark[]): string[] {
  return Array.from(
    new Set(
      bookmarks
        .filter((b) => b.change_id.length > 0 && b.name.length > 0)
        .map((b) => b.name),
    ),
  ).sort();
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
