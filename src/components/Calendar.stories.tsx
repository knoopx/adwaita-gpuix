import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import { Calendar, DatePicker } from "./Calendar";

export default defineMeta({
  title: "Adwaita/Calendar",
  component: Calendar,
  parameters: { width: 528, height: 720 },
});

export const selectionModes = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Row gap={16} align="start">
        <Labeled caption="mode=single (selected date)">
          <Calendar
            month={new Date(2025, 5, 1)}
            selected={new Date(2025, 5, 15)}
            onSelect={() => {}}
          />
        </Labeled>
        <Labeled caption="mode=multiple (value: Date[])">
          <Calendar
            mode="multiple"
            month={new Date(2025, 5, 1)}
            value={[
              new Date(2025, 5, 3),
              new Date(2025, 5, 15),
              new Date(2025, 5, 27),
            ]}
            onValueChange={() => {}}
          />
        </Labeled>
      </Row>
      <Labeled caption="mode=range (selected: [start, end])">
        <Calendar
          mode="range"
          month={new Date(2025, 5, 1)}
          selected={[new Date(2025, 5, 10), new Date(2025, 5, 20)]}
          onValueChange={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const triggerStates = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="closed · empty (no value)">
        <DatePicker open={false} onChange={() => {}} />
      </Labeled>
      <Labeled caption="closed · with value">
        <DatePicker
          value={new Date(2025, 5, 15)}
          open={false}
          onChange={() => {}}
        />
      </Labeled>
    </Row>
  ),
});

export const openAnchoredCalendar = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <div style={{ width: 280 }}>
        <DatePicker
          value={new Date(2025, 5, 15)}
          open={true}
          onChange={() => {}}
        />
      </div>
    </Column>
  ),
});

export const todayHighlighted = defineStory({
  render: () => {
    const today = new Date();
    const selected = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 4,
    );
    return (
      <Labeled
        caption="today (accent) · selected day · out-of-month dimmed"
        style={{ alignItems: "center" }}
      >
        <Calendar
          month={today}
          selected={selected}
          onSelect={() => {}}
        />
      </Labeled>
    );
  },
});

export const disabledDays = defineStory({
  render: () => {
    const disabledDates = [2, 3, 10, 17, 24, 25].map(
      (d) => new Date(2025, 5, d),
    );
    return (
      <Labeled
        caption="disabledDates · dimmed, not selectable"
        style={{ alignItems: "center" }}
      >
        <Calendar
          month={new Date(2025, 5, 1)}
          selected={new Date(2025, 5, 15)}
          disabledDates={disabledDates}
          onSelect={() => {}}
        />
      </Labeled>
    );
  },
});
