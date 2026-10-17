import { defineMeta, defineStory } from "storybook";
import { Column } from "../Box";
import {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanContent,
  PlanStep,
} from "./Plan";

type PlanStepSpec = { title: string; status: "done" | "running" | "pending" };

const MIGRATE_STEPS: PlanStepSpec[] = [
  { title: "Install @base-ui/react", status: "done" },
  { title: "Replace the Radix imports", status: "running" },
  { title: "Rename asChild to render", status: "pending" },
  { title: "Run the type checker", status: "pending" },
];

function PlanFrame({
  open,
  title,
  description,
  steps,
}: {
  open?: boolean;
  title: string;
  description: string;
  steps: PlanStepSpec[];
}) {
  return (
    <Column gap={16} align="center">
      <Column style={{ width: "100%", minWidth: 0 }}>
        <Plan open={open} onOpenChange={() => {}}>
          <PlanHeader>
            <PlanTitle>{title}</PlanTitle>
            <PlanDescription>{description}</PlanDescription>
          </PlanHeader>
          <PlanContent>
            {steps.map((s) => (
              <PlanStep key={s.title} title={s.title} status={s.status} />
            ))}
          </PlanContent>
        </Plan>
      </Column>
    </Column>
  );
}

export default defineMeta({
  title: "Adwaita/Plan",
  component: Plan,
  parameters: { width: 528, height: 400 },
});

export const inProgress = defineStory({
  parameters: { width: 480, height: 200 },
  render: () => (
    <PlanFrame
      open
      title="Plan: migrate to Base UI"
      description="1 of 4 done"
      steps={MIGRATE_STEPS}
    />
  ),
});

export const singleRunning = defineStory({
  parameters: { width: 480, height: 110 },
  render: () => (
    <PlanFrame
      open
      title="Plan: scaffold the workspace"
      description="in progress"
      steps={[{ title: "Scaffold the project", status: "running" }]}
    />
  ),
});

export const collapsed = defineStory({
  parameters: { width: 480, height: 90 },
  render: () => (
    <PlanFrame
      title="Plan: migrate to Base UI"
      description="1 of 4 done"
      steps={MIGRATE_STEPS}
    />
  ),
});
