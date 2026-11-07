import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./text";
import { Column } from "./Box";
import { ContributionHeatmap } from "./ContributionHeatmap";
import {
  buildActivityModel,
  WEEKS_SHOWN,
  type ActivityChange,
} from "../lib/activity";

// A fixed "today" keeps the heatmap (and therefore its PNG baseline) stable
// instead of sliding one column per day.
const NOW = new Date(2025, 5, 21);

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Skewed pseudo-random change history over the `days` before NOW. */
function sampleChanges(days: number, seed: number): ActivityChange[] {
  const rand = seeded(seed);
  const authors = ["knoopx", "ada", "grace", "alan"];
  const out: ActivityChange[] = [];
  for (let d = 0; d < days; d++) {
    const day = new Date(NOW.getTime() - d * 86_400_000);
    const stamp = (h: number, m: number): string =>
      `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(
        day.getDate(),
      ).padStart(2, "0")} ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    const burst = rand();
    const count = Math.floor(burst * burst * 9);
    for (let i = 0; i < count; i++) {
      out.push({
        author: authors[Math.floor(rand() * authors.length)],
        timestamp: stamp(8 + Math.floor(rand() * 11), Math.floor(rand() * 60)),
        has_conflicts: rand() > 0.93,
      });
    }
    // Intentionally noisy records the model has to survive: an unparseable
    // timestamp, and a future-dated one (which must not paint a cell).
    if (d === 3) {
      out.push({ author: "alan", timestamp: "?", has_conflicts: false });
    }
    if (d === 0) {
      const tomorrow = new Date(NOW.getTime() + 86_400_000);
      out.push({
        author: "ada",
        timestamp: `${tomorrow.getFullYear()}-${String(
          tomorrow.getMonth() + 1,
        ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")} 09:15`,
        has_conflicts: true,
      });
    }
  }
  return out;
}

const CHANGES = sampleChanges(WEEKS_SHOWN * 7, 20260101);

export default defineMeta({
  title: "Adwaita/ContributionHeatmap",
  component: ContributionHeatmap,
  parameters: { width: 792, height: 560 },
});

export const year = defineStory({
  render: () => {
    const model = buildActivityModel(CHANGES, { now: NOW });
    return (
      <div style={{ width: 760 }}>
        <ContributionHeatmap
          weeks={model.weeks}
          dayLabels={model.dayLabels}
        />
      </div>
    );
  },
});

export const quarter = defineStory({
  render: () => {
    const model = buildActivityModel(CHANGES, { now: NOW, weeksShown: 14 });
    return (
      <Column gap={16}>
        <Labeled caption="14 weeks · same data, narrower window">
          <div style={{ width: 760 }}>
            <ContributionHeatmap
              weeks={model.weeks}
              dayLabels={model.dayLabels}
            />
          </div>
        </Labeled>
        <Labeled caption="dense cells · cell 18, gap 3">
          <div style={{ width: 760 }}>
            <ContributionHeatmap
              weeks={model.weeks}
              dayLabels={model.dayLabels}
              cell={18}
              gap={3}
            />
          </div>
        </Labeled>
      </Column>
    );
  },
});

export const empty = defineStory({
  render: () => {
    const model = buildActivityModel([], { now: NOW, weeksShown: 12 });
    return (
      <div style={{ width: 420 }}>
        <ContributionHeatmap weeks={model.weeks} dayLabels={model.dayLabels} />
      </div>
    );
  },
});
