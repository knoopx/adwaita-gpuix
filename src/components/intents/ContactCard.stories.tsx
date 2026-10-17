import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { ContactCard } from "./ContactCard";

export default defineMeta({
  title: "Adwaita/ContactCard",
  component: ContactCard,
  parameters: { width: 528, height: 280 },
});

export const full = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with phone + email">
        <ContactCard
          data={{
            name: "Ada Lovelace",
            phone: "+44 20 7946 0000",
            email: "ada@example.com",
            initials: "AL",
          }}
        />
      </Labeled>
      <Labeled caption="name only (initials derived)">
        <ContactCard
          data={{ name: "Grace Hopper", phone: null, email: null, initials: "" }}
        />
      </Labeled>
    </Column>
  ),
});
