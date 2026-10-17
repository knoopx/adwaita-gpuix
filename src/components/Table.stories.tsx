import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Column } from "./Box";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableFootCell,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./Table";

const USER_ROWS: string[][] = [
  ["Ada", "ada@example.com", "Admin"],
  ["Grace", "grace@example.com", "Editor"],
  ["Alan", "alan@example.com", "Viewer"],
];
const USER_ROWS_ZEBRA: string[][] = [
  ...USER_ROWS,
  ["Eve", "eve@example.com", "Viewer"],
];

function UserHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
      </TableRow>
    </TableHeader>
  );
}

function UserBody({
  rows = USER_ROWS,
  zebra,
  selectedIndex,
}: {
  rows?: string[][];
  zebra?: boolean;
  selectedIndex?: number;
}) {
  return (
    <TableBody zebra={zebra}>
      {rows.map((row, i) => (
        <TableRow key={i} selected={i === selectedIndex}>
          {row.map((cell, j) => (
            <TableCell key={j}>{cell}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

export default defineMeta({
  title: "Adwaita/Table",
  component: Table,
  parameters: { width: 528, height: 320 },
});

export const headerBodyFooter = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="full table — header, body, footer" />
      <Table>
        <UserHeader />
        <UserBody />
        <TableFooter>
          <TableRow>
            <TableFootCell>Total</TableFootCell>
            <TableFootCell>—</TableFootCell>
            <TableFootCell>3 users</TableFootCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Column>
  ),
});

export const caption = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="caption below the table" />
      <Column gap={0}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Theme</TableCell>
              <TableCell>Dark</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <TableCaption>Settings summary — 1 row.</TableCaption>
      </Column>
    </Column>
  ),
});

export const selectedRow = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="selected row (accent tint)" />
      <Table>
        <UserHeader />
        <UserBody selectedIndex={1} />
      </Table>
    </Column>
  ),
});

export const zebraRows = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="zebra striping on the body" />
      <Table>
        <UserHeader />
        <UserBody zebra rows={USER_ROWS_ZEBRA} />
      </Table>
    </Column>
  ),
});

export const columnAlignment = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="column alignment — left / center / right" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead align="center">Qty</TableHead>
            <TableHead align="right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Espresso</TableCell>
            <TableCell align="center">2</TableCell>
            <TableCell align="right">3.40</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Latte</TableCell>
            <TableCell align="center">1</TableCell>
            <TableCell align="right">4.20</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cocoa</TableCell>
            <TableCell align="center">3</TableCell>
            <TableCell align="right">5.10</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableFootCell>Total</TableFootCell>
            <TableFootCell align="center">6</TableFootCell>
            <TableFootCell align="right">12.70</TableFootCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Column>
  ),
});

export function empty() {
  const t = useAdwaita();
  return (
    <Column gap={16} align="center">
      <Labeled caption="empty state — header with no rows" />
      <Table>
        <UserHeader />
        <TableBody>
          <TableRow>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                padding: t.spacing.gap,
              }}
            >
              <T size="body" color={t.colors.dim_fg}>
                No items
              </T>
            </div>
          </TableRow>
        </TableBody>
      </Table>
    </Column>
  );
}

const SCROLL_ROWS = [
  ["Ada", "ada@example.com", "Admin"],
  ["Grace", "grace@example.com", "Editor"],
  ["Alan", "alan@example.com", "Viewer"],
  ["Eve", "eve@example.com", "Viewer"],
  ["Linus", "linus@example.com", "Editor"],
  ["Margaret", "margaret@example.com", "Admin"],
  ["Tim", "tim@example.com", "Viewer"],
  ["Katherine", "katherine@example.com", "Editor"],
  ["Donald", "donald@example.com", "Viewer"],
  ["Barbara", "barbara@example.com", "Editor"],
  ["Radia", "radia@example.com", "Admin"],
  ["Andrew", "andrew@example.com", "Viewer"],
  ["Frances", "frances@example.com", "Editor"],
  ["Guido", "guido@example.com", "Viewer"],
  ["Bjarne", "bjarne@example.com", "Editor"],
  ["Anika", "anika@example.com", "Viewer"],
  ["Rasmus", "rasmus@example.com", "Editor"],
  ["Linda", "linda@example.com", "Viewer"],
  ["Brendan", "brendan@example.com", "Editor"],
  ["Dennis", "dennis@example.com", "Viewer"],
  ["Margaret", "hamilton@example.com", "Editor"],
  ["Tony", "tony@example.com", "Viewer"],
  ["Bjarke", "bjarke@example.com", "Editor"],
  ["Yuki", "yuki@example.com", "Viewer"],
  ["Anders", "anders@example.com", "Viewer"],
  ["Erik", "erik@example.com", "Viewer"],
  ["Nancy", "nancy@example.com", "Viewer"],
  ["Leslie", "leslie@example.com", "Viewer"],
  ["Bjarndis", "bjarndis@example.com", "Editor"],
  ["Renee", "renee@example.com", "Viewer"],
];

export function scrolling() {
  const t = useAdwaita();
  return (
    <Column gap={16} align="center">
      <Labeled caption="fixed height — body scrolls (virtual-list)" />
      <Table style={{ height: 180 }}>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <virtual-list
            estimatedItemHeight={t.spacing.rowHeight}
            style={{ flexGrow: 1, minHeight: 0 }}
          >
            {SCROLL_ROWS.map((row, i) => (
              <div key={i}>
                <TableRow>
                  <TableCell>{row[0]}</TableCell>
                  <TableCell>{row[1]}</TableCell>
                  <TableCell>{row[2]}</TableCell>
                </TableRow>
              </div>
            ))}
          </virtual-list>
        </TableBody>
      </Table>
    </Column>
  );
}
