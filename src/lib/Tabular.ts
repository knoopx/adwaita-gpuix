export {
  isTabularPath,
  detectDelim,
  parseTable,
  type TabularDelim,
} from "./tabular/csv";
export { patchSides, type PatchSides } from "./tabular/patch";
export {
  alignTables,
  type AlignedCell,
  type AlignedRow,
  type AlignedTable,
} from "./tabular/align";
export { parseTabularSides, type TabularSides } from "./tabular/sides";
