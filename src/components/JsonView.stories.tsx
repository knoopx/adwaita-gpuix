import { defineMeta } from "storybook";
import { Labeled } from "./common";
import { Panel } from "./.storybook/story-helpers";
import { JsonView } from "./JsonView";

const sample = {
  title: "Quarterly report",
  version: 2,
  published: true,
  author: null,
  pages: [
    { heading: "Summary", words: 1240, draft: true, notes: null },
    { heading: "Charts", words: 480, draft: false, notes: "two figures" },
  ],
  tags: ["finance", "summary", "charts"],
};

export default defineMeta({
  title: "Adwaita/JsonView",
  component: JsonView,
  parameters: { width: 420, height: 560 },
});

export function tree() {
  return (
    <Panel>
      <Labeled
        caption="nested tree, fully expanded (string / number / boolean / null / object / array)"
        style={{ gap: 6 }}
      >
        <JsonView src={sample} collapsed={false} />
      </Labeled>
    </Panel>
  );
}

export function collapsed() {
  return (
    <Panel>
      <Labeled caption="collapsed to depth 1 (… n summaries)" style={{ gap: 6 }}>
        <JsonView src={sample} collapsed={1} />
      </Labeled>
    </Panel>
  );
}

export function empty() {
  return (
    <Panel>
      <Labeled caption="empty object" style={{ gap: 6 }}>
        <JsonView src={{}} name="config" />
      </Labeled>
      <Labeled caption="empty array" style={{ gap: 6 }}>
        <JsonView src={[]} name="items" />
      </Labeled>
    </Panel>
  );
}
