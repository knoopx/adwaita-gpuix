/**
 * The jj records every GPUix vcs surface speaks: a change, a file it touched
 * and a bookmark pointing at it. Apps layer their own view types on top.
 */

/** A jujutsu change as reported by `jj log -T`. */
export interface Change {
  change_id: string;
  commit_id: string;
  description: string;
  author: string;
  timestamp: string;
  immutable: boolean;
  empty: boolean;
  has_conflicts: boolean;
  parents: string[];
}

/** A file touched by a change, with its diff size. */
export interface FileChange {
  status: "A" | "M" | "D";
  path: string;
  insertions: number;
  deletions: number;
}

/** A jj bookmark, qualified by the remote it lives on. */
export interface Bookmark {
  name: string;
  change_id: string;
  description: string;
  author: string;
  remote: string;
  reference: string;
}
