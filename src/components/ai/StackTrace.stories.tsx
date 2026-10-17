import { defineMeta, defineStory } from "storybook";
import { StackTrace, type StackTraceFrame } from "./StackTrace";

export default defineMeta({
  title: "Adwaita/StackTrace",
  component: StackTrace,
  parameters: { width: 528, height: 360 },
});

const FRAMES: StackTraceFrame[] = [
  { raw: "seedUsers in prisma/seed.ts:27" },
  { raw: "main in prisma/seed.ts:51" },
  { raw: "run in scripts/db.ts:9" },
];

const MESSAGE = "Cannot read properties of undefined (reading 'email')";

function longFrames(count: number): StackTraceFrame[] {
  const names = [
    "render",
    "dispatch",
    "reducer",
    "subscribe",
    "emit",
    "notify",
    "flush",
    "schedule",
    "commit",
    "apply",
  ];
  return Array.from({ length: count }, (_, i) => ({
    raw: `${names[i % names.length]} in runtime/frame-${i + 1}.ts:${(i + 1) * 7}`,
  }));
}

export const basic = defineStory({
  parameters: { width: 528, height: 220 },
  render: () => (
    <StackTrace
      errorType="TypeError"
      message={MESSAGE}
      frames={FRAMES}
      internalCount={4}
      open
      onOpenChange={() => {}}
    />
  ),
});

export const collapsed = defineStory({
  parameters: { width: 528, height: 80 },
  render: () => (
    <StackTrace
      errorType="TypeError"
      message={MESSAGE}
      frames={FRAMES}
      open={false}
      onOpenChange={() => {}}
    />
  ),
});

export const singleFrame = defineStory({
  parameters: { width: 528, height: 150 },
  render: () => (
    <StackTrace
      errorType="RangeError"
      message="Maximum call stack size exceeded"
      frames={[{ raw: "recurse in util/deep.ts:14" }]}
      open
      onOpenChange={() => {}}
    />
  ),
});

export const empty = defineStory({
  parameters: { width: 528, height: 150 },
  render: () => (
    <StackTrace
      errorType="Error"
      message="Unknown failure with no frames"
      frames={[]}
      open
      onOpenChange={() => {}}
    />
  ),
});

export const longTrace = defineStory({
  parameters: { width: 528, height: 260 },
  render: () => (
    <StackTrace
      errorType="Error"
      message="Async operation timed out"
      frames={longFrames(24)}
      maxHeight={168}
      open
      onOpenChange={() => {}}
    />
  ),
});

export const withCopyButton = defineStory({
  parameters: { width: 528, height: 220 },
  render: () => (
    <StackTrace
      errorType="TypeError"
      message={MESSAGE}
      frames={FRAMES}
      onCopy={() => {}}
      open
      onOpenChange={() => {}}
    />
  ),
});

export const clickableFrames = defineStory({
  parameters: { width: 528, height: 220 },
  render: () => {
    const frames: StackTraceFrame[] = [
      {
        raw: "seedUsers in prisma/seed.ts:27",
        filePath: "prisma/seed.ts",
        line: 27,
        column: 18,
      },
      {
        raw: "main in prisma/seed.ts:51",
        filePath: "prisma/seed.ts",
        line: 51,
        column: 1,
      },
      {
        raw: "run in scripts/db.ts:9",
        filePath: "scripts/db.ts",
        line: 9,
        column: 3,
        internal: true,
      },
    ];
    return (
      <StackTrace
        errorType="TypeError"
        message={MESSAGE}
        frames={frames}
        onFilePathClick={() => {}}
        open
        onOpenChange={() => {}}
      />
    );
  },
});
