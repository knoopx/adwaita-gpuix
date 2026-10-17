import { defineMeta } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled } from "./common";
import { Row } from "./Box";
import { Frame } from "./Card";
import { ListBox, ListBoxItem } from "./ListBox";

export default defineMeta({
  title: "Adwaita/ListBox",
  component: ListBox,
  parameters: { width: 528, height: 320 },
});

export function selectionModes() {
  return (
    <Row gap={16} align="start">
      <Labeled caption="single (selected b, disabled d)">
        <Frame style={{ width: 240 }}>
          <ListBox value="b" onValueChange={() => {}}>
            <ListBoxItem value="a">First item</ListBoxItem>
            <ListBoxItem value="b">Second item (selected)</ListBoxItem>
            <ListBoxItem value="c">Third item</ListBoxItem>
            <ListBoxItem value="d" disabled>
              Disabled item
            </ListBoxItem>
          </ListBox>
        </Frame>
      </Labeled>
      <Labeled caption="multiple (a + c selected)">
        <Frame style={{ width: 240 }}>
          <ListBox multiple value={["a", "c"]} onValueChange={() => {}}>
            <ListBoxItem value="a">First item (selected)</ListBoxItem>
            <ListBoxItem value="b">Second item</ListBoxItem>
            <ListBoxItem value="c">Third item (selected)</ListBoxItem>
            <ListBoxItem value="d">Fourth item</ListBoxItem>
          </ListBox>
        </Frame>
      </Labeled>
    </Row>
  );
}

export function basic() {
  return (
    <Labeled caption="basic list, no selection">
      <Frame style={{ width: 280 }}>
        <ListBox>
          <ListBoxItem value="a">First item</ListBoxItem>
          <ListBoxItem value="b">Second item</ListBoxItem>
          <ListBoxItem value="c">Third item</ListBoxItem>
          <ListBoxItem value="d">Fourth item</ListBoxItem>
          <ListBoxItem value="e">Fifth item</ListBoxItem>
        </ListBox>
      </Frame>
    </Labeled>
  );
}
basic.parameters = { width: 320, height: 300 };

export function withIcons() {
  return (
    <Labeled caption="rows with icons (b selected)">
      <Frame style={{ width: 280 }}>
        <ListBox value="b">
          <ListBoxItem value="home" icon="home">
            Home
          </ListBoxItem>
          <ListBoxItem value="search" icon="search">
            Search
          </ListBoxItem>
          <ListBoxItem value="settings" icon="settings">
            Settings
          </ListBoxItem>
          <ListBoxItem value="bell" icon="bell">
            Notifications
          </ListBoxItem>
          <ListBoxItem value="user" icon="user">
            Profile
          </ListBoxItem>
        </ListBox>
      </Frame>
    </Labeled>
  );
}
withIcons.parameters = { width: 320, height: 300 };

export function longLabels() {
  return (
    <Labeled caption="long labels truncate with ellipsis">
      <Frame style={{ width: 240 }}>
        <ListBox value="b">
          <ListBoxItem value="a">
            Short label
          </ListBoxItem>
          <ListBoxItem value="b">
            A very long label that keeps going and must truncate
          </ListBoxItem>
          <ListBoxItem value="c">
            Another rather long label that should also truncate cleanly
          </ListBoxItem>
          <ListBoxItem value="d">
            Normal label
          </ListBoxItem>
        </ListBox>
      </Frame>
    </Labeled>
  );
}
longLabels.parameters = { width: 300, height: 280 };

const MANY_ROW_VALUES = Array.from({ length: 40 }, (_, i) => `row-${i}`);

export function manyRows() {
  const t = useAdwaita();
  return (
    <Labeled caption="40 rows in a virtual-list">
      <Frame style={{ width: 280 }}>
        <ListBox value="row-7" style={{ height: 280 }}>
          <virtual-list
            estimatedItemHeight={t.spacing.rowHeight}
            style={{ flexGrow: 1, minHeight: 0 }}
          >
            {MANY_ROW_VALUES.map((value, i) => (
              <div
                key={value}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <ListBoxItem value={value}>Item {i + 1}</ListBoxItem>
              </div>
            ))}
          </virtual-list>
        </ListBox>
      </Frame>
    </Labeled>
  );
}
manyRows.parameters = { width: 320, height: 400 };
