import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../text";
import { Column } from "../Box";
import { FileTree, type FileTreeNode } from "./FileTree";

const STORYBOOK_TREE: FileTreeNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Button.tsx", type: "file" },
          { name: "Badge.tsx", type: "file" },
        ],
      },
      {
        name: "ai",
        type: "folder",
        children: [{ name: "Chat.tsx", type: "file" }],
      },
      { name: "utils.ts", type: "file" },
    ],
  },
];

const DEEP_TREE: FileTreeNode[] = [
  {
    name: "repo",
    type: "folder",
    children: [
      {
        name: "src",
        type: "folder",
        children: [
          {
            name: "components",
            type: "folder",
            children: [
              {
                name: "ai",
                type: "folder",
                children: [
                  { name: "FileTree.tsx", type: "file" },
                  { name: "Chat.tsx", type: "file" },
                ],
              },
              { name: "Button.tsx", type: "file" },
            ],
          },
          { name: "utils.ts", type: "file" },
        ],
      },
      { name: "README.md", type: "file" },
    ],
  },
];

const ALL_EXPANDED_PATHS = ["src", "src/components", "src/ai"];

/** A changeset read as a tree: the paths that moved, with what moved in them. */
const CHANGE_TREE: FileTreeNode[] = [
  {
    name: "packages",
    type: "folder",
    children: [
      {
        name: "core",
        type: "folder",
        children: [
          {
            name: "src",
            type: "folder",
            children: [
              { name: "convertMessages.ts", type: "file", added: 24, removed: 6 },
              { name: "convertMessages.test.ts", type: "file", added: 41 },
            ],
          },
        ],
      },
      {
        name: "ui",
        type: "folder",
        children: [
          { name: "composer.tsx", type: "file", added: 8, removed: 3 },
          { name: "tidy-pans-shave.md", type: "file", added: 5 },
        ],
      },
    ],
  },
];

export default defineMeta({
  title: "Adwaita/FileTree",
  component: FileTree,
  parameters: { width: 528, height: 320 },
});

export const tree = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="src/components open, Button.tsx selected">
        <FileTree
          items={STORYBOOK_TREE}
          defaultExpandedPaths={["src", "src/components"]}
          selectedPath="src/components/Button.tsx"
          onSelect={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const expanded = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="all folders expanded">
        <FileTree
          items={STORYBOOK_TREE}
          defaultExpandedPaths={ALL_EXPANDED_PATHS}
          onSelect={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const collapsed = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="all folders collapsed">
        <FileTree items={STORYBOOK_TREE} onSelect={() => {}} />
      </Labeled>
    </Column>
  ),
});

export const changeset = defineStory({
  parameters: { width: 528, height: 300 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="list variant · read, not picked; a path's counts trail the row">
        <div style={{ width: 460 }}>
          <FileTree
            items={CHANGE_TREE}
            variant="list"
            defaultExpandedPaths={["packages", "packages/core", "packages/core/src", "packages/ui"]}
          />
        </div>
      </Labeled>
    </Column>
  ),
});

/** One level of a folder: the shape a listing answers with, nothing to open. */
const FLAT_LISTING: FileTreeNode[] = [
  { name: "src", type: "folder" },
  { name: "docs", type: "folder" },
  { name: "README.md", type: "file" },
  { name: "package.json", type: "file" },
];

export const flatListing = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="a folder naming nothing: its gutter stays empty, so no row under it reads as its child">
        <div style={{ width: 460 }}>
          <FileTree items={FLAT_LISTING} variant="list" />
        </div>
      </Labeled>
    </Column>
  ),
});

export const deepNesting = defineStory({
  parameters: { width: 528, height: 360 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="five levels deep, repo/src/components/ai/FileTree.tsx selected">
        <FileTree
          items={DEEP_TREE}
          defaultExpandedPaths={[
            "repo",
            "repo/src",
            "repo/src/components",
            "repo/src/components/ai",
          ]}
          selectedPath="repo/src/components/ai/FileTree.tsx"
          onSelect={() => {}}
        />
      </Labeled>
    </Column>
  ),
});
