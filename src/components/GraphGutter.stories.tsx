import { defineMeta } from "storybook";
import { GraphGutter } from "./GraphGutter";
import { generateGraphData, graphLaneCount } from "../lib/graph";

const COMMITS = [
  { id: "a10", parents: ["b20"] },
  { id: "b20", parents: ["c30", "d40"] },
  { id: "d40", parents: ["c30"] },
  { id: "c30", parents: ["e50"] },
  { id: "e50", parents: [] },
];

const NODES = generateGraphData(COMMITS);
const LANES = graphLaneCount(NODES);

const meta = defineMeta({
  title: "Adwaita/GraphGutter",
  component: GraphGutter,
  parameters: { width: 320, height: 240 },
});

export default meta;

export const graphGutter = {
  name: "GraphGutter",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {NODES.map((node, i) => (
        <GraphGutter
          key={node.id}
          node={node}
          prev={i === 0 ? null : NODES[i - 1]}
          laneCount={LANES}
          selected={i === 1}
        />
      ))}
    </div>
  ),
};
