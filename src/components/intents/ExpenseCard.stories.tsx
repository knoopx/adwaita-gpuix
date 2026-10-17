import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { ExpenseCard } from "./ExpenseCard";

export default defineMeta({
  title: "Adwaita/ExpenseCard",
  component: ExpenseCard,
  parameters: { width: 528, height: 280 },
});

export const amounted = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with amount" style={{ width: "100%" }}>
        <ExpenseCard
          data={{
            amount: 12.4,
            item: "Lunch",
            currency: "€",
            date: "Jul 12",
          }}
        />
      </Labeled>
      <Labeled caption="no amount" style={{ width: "100%" }}>
        <ExpenseCard
          data={{
            amount: null,
            item: "Coffee",
            currency: "€",
            date: "Jul 12",
          }}
        />
      </Labeled>
    </Column>
  ),
});

export const budget = defineStory({
  parameters: { width: 528, height: 300 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="within budget (accent bar)" style={{ width: "100%" }}>
        <ExpenseCard
          data={{
            amount: 3.2,
            item: "Transport",
            currency: "€",
            date: "Jul 12",
            budget: 50,
          }}
        />
      </Labeled>
      <Labeled
        caption="over budget (destructive bar, clamped)"
        style={{ width: "100%" }}
      >
        <ExpenseCard
          data={{
            amount: 86.3,
            item: "Dinner",
            currency: "€",
            date: "Jul 14",
            budget: 60,
          }}
        />
      </Labeled>
    </Column>
  ),
});
