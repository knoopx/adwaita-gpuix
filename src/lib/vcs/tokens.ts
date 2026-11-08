/**
 * The kinds of thing a line of source is made of.
 *
 * The library never parses a language — it has no parser and no opinion about
 * one. An app that reads the text of a row hands back these kinds, and the diff
 * widget answers them with this theme's colours. Keeping the vocabulary this
 * small is what lets a tree-sitter walk, a shell's own rules, or nothing at all
 * stand behind it.
 */
export type DiffTokenKind =
  | "plain"
  | "keyword"
  | "type"
  | "function"
  | "property"
  | "constant"
  | "number"
  | "string"
  | "comment";

/** A run of a row's text that reads as one kind of thing. */
export interface DiffToken {
  text: string;
  kind: DiffTokenKind;
}
