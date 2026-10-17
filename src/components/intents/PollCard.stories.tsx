import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { PollCard } from "./PollCard";

export default defineMeta({
  title: "Adwaita/PollCard",
  component: PollCard,
  parameters: { width: 528, height: 280 },
});

export const options = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with results" style={{ width: "100%" }}>
        <PollCard
          data={{
            title: "Preferred release channel",
            options: [
              { label: "Stable", votes: 84 },
              { label: "Beta", votes: 32 },
              { label: "Nightly", votes: 12 },
            ],
          }}
        />
      </Labeled>
    </Column>
  ),
});

export const noVotes = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="no votes (empty bars)" style={{ width: "100%" }}>
        <PollCard
          data={{
            title: "Favourite fruit?",
            options: [
              { label: "Apple", votes: 0 },
              { label: "Pear", votes: 0 },
              { label: "Cherry", votes: 0 },
            ],
          }}
        />
      </Labeled>
    </Column>
  ),
});
