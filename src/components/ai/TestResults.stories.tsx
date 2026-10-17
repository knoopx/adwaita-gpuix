import { defineMeta, defineStory } from "storybook";
import { TestResults, type TestSuiteData } from "./TestResults";

const SUITES: TestSuiteData[] = [
  {
    name: "cart.test.ts",
    tests: [
      { name: "validates the cart totals", status: "passed" },
      { name: "applies a coupon", status: "passed" },
      { name: "persists the session", status: "passed" },
    ],
  },
  {
    name: "payment.test.ts",
    tests: [
      { name: "charges the saved card", status: "passed" },
      {
        name: "retries a declined card",
        status: "failed",
        error:
          "Expected 2 charge attempts, received 1\n\n  at Object.<anonymous> (src/payment.test.ts:58:22)",
      },
    ],
  },
];

const ALL_PASS: TestSuiteData[] = [
  {
    name: "cart.test.ts",
    tests: [
      { name: "validates the cart totals", status: "passed" },
      { name: "applies a coupon", status: "passed" },
      { name: "persists the session", status: "passed" },
    ],
  },
];

export default defineMeta({
  title: "Adwaita/TestResults",
  component: TestResults,
  parameters: { width: 528, height: 400 },
});

export const allPass = defineStory({
  parameters: { width: 528, height: 190 },
  render: () => (
    <TestResults suites={ALL_PASS} open onOpenChange={() => {}} />
  ),
});

export const failures = defineStory({
  parameters: { width: 528, height: 340 },
  render: () => (
    <TestResults suites={SUITES} open onOpenChange={() => {}} />
  ),
});

export const singleTest = defineStory({
  parameters: { width: 528, height: 150 },
  render: () => (
    <TestResults
      suites={[
        {
          name: "empty.test.ts",
          tests: [{ name: "handles empty input", status: "passed" }],
        },
      ]}
      open
      onOpenChange={() => {}}
    />
  ),
});

export const withFileLine = defineStory({
  parameters: { width: 528, height: 250 },
  render: () => (
    <TestResults
      suites={[
        {
          name: "parser.test.ts",
          tests: [
            {
              name: "parses numbers",
              status: "passed",
              file: "src/parser.test.ts:12",
            },
            {
              name: "rejects malformed input",
              status: "failed",
              file: "src/parser.test.ts:34",
              error:
                "Expected to throw, did not throw\n\n  at Object.<anonymous> (src/parser.test.ts:34:19)",
            },
          ],
        },
      ]}
      open
      onOpenChange={() => {}}
    />
  ),
});

export const collapsed = defineStory({
  parameters: { width: 528, height: 90 },
  render: () => (
    <TestResults suites={SUITES} open={false} onOpenChange={() => {}} />
  ),
});
