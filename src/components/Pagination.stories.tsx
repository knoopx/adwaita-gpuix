import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Column } from "./Box";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./Pagination";

export default defineMeta({
  title: "Adwaita/Pagination",
  component: Pagination,
  parameters: { width: 528, height: 400 },
});

export const dataDriven = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="first page — prev disabled">
        <Pagination page={1} pages={8} onPageChange={() => {}} />
      </Labeled>
      <Labeled caption="middle — ellipsis both sides">
        <Pagination page={4} pages={8} onPageChange={() => {}} />
      </Labeled>
      <Labeled caption="last page — next disabled">
        <Pagination page={8} pages={8} onPageChange={() => {}} />
      </Labeled>
      <Labeled caption="many pages — windowed numbers">
        <Pagination page={12} pages={24} onPageChange={() => {}} />
      </Labeled>
      <Labeled caption="single page — prev and next disabled">
        <Pagination page={1} pages={1} onPageChange={() => {}} />
      </Labeled>
      <Labeled caption="≤5 pages — no ellipsis">
        <Pagination page={2} pages={4} onPageChange={() => {}} />
      </Labeled>
    </Column>
  ),
});

export const compound = defineStory({
  parameters: { width: 528, height: 160 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="active link + disabled prev">
        <PaginationContent>
          <PaginationPrevious disabled />
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink active>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>5</PaginationLink>
          </PaginationItem>
          <PaginationNext />
        </PaginationContent>
      </Labeled>
      <Labeled caption="single page — prev and next disabled">
        <PaginationContent>
          <PaginationPrevious disabled />
          <PaginationItem>
            <PaginationLink active>1</PaginationLink>
          </PaginationItem>
          <PaginationNext disabled />
        </PaginationContent>
      </Labeled>
    </Column>
  ),
});
