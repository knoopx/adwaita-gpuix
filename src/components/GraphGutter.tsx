import { useMemo } from "react";
import {
  graphGutterWidth,
  graphXStep,
  renderRowSvg,
  type GraphNode,
} from "../lib/graph";

export function GraphGutter({
  node,
  prev,
  laneCount,
  selected,
  dotStroke,
  selectedStroke,
}: {
  node: GraphNode;
  prev: GraphNode | null;
  laneCount: number;
  selected: boolean;
  dotStroke?: string;
  selectedStroke?: string;
}) {
  const xs = graphXStep(laneCount);
  const src = useMemo(() => {
    const svg = renderRowSvg(node, prev, laneCount, xs, {
      selected,
      dotStroke,
      selectedStroke,
    });
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [node, prev, laneCount, xs, selected, dotStroke, selectedStroke]);
  return (
    <img
      src={src}
      style={{ width: graphGutterWidth(laneCount), height: 24, flexShrink: 0 }}
    />
  );
}
