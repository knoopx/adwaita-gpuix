import { defineMeta, defineStory } from "storybook";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./text";
import { Column, Row } from "./Box";
import {
  activeIconSet,
  Icon,
  iconSetNames,
  ICONS,
  type IconName,
} from "./icons";

function IconGrid({ names }: { names?: IconName[] }) {
  const t = useAdwaita();
  const list = names ?? (Object.keys(ICONS) as IconName[]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        alignContent: "flex-start",
      }}
    >
      {list.map((n) => (
        <div
          key={n}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "center",
          }}
        >
          <T size="caption" color={t.color.text.dim}>
            {n}
          </T>
          <Icon name={n} size={16} />
        </div>
      ))}
    </div>
  );
}

function IconSizes() {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
      }}
    >
      {[12, 16, 20, 24, 32].map((s) => (
        <div
          key={s}
          style={{ display: "flex", flexDirection: "column", gap: 4 }}
        >
          <T size="caption" color={t.color.text.dim}>
            {s}px
          </T>
          <Icon name="settings" size={s} />
        </div>
      ))}
    </div>
  );
}

const TONES: [string, (t: AdwaitaTheme) => string][] = [
  ["fg", (t) => t.color.text.primary],
  ["dim", (t) => t.color.text.dim],
  ["accent", (t) => t.color.accent.base],
  ["destructive", (t) => t.color.functional.destructive],
  ["success", (t) => t.color.functional.success],
  ["warning", (t) => t.color.functional.warning],
];

function IconColors() {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
      }}
    >
      {TONES.map(([label, tone]) => (
        <div
          key={label}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "center",
          }}
        >
          <Icon name="check" size={20} color={tone(t)} />
          <T size="caption" color={t.color.text.dim}>
            {label}
          </T>
        </div>
      ))}
    </div>
  );
}

const SAMPLE: IconName[] = [
  "close",
  "add",
  "expandMore",
  "info",
  "warning",
  "checkCircle",
  "gridView",
  "accountTree",
  "search",
  "settings",
  "home",
  "notifications",
  "schedule",
  "delete",
  "sunny",
  "darkMode",
  "refresh",
  "bolt",
  "science",
  "language",
];

const STYLE_NAMES: IconName[] = [
  "settings",
  "settings-rounded",
  "settings-sharp",
  "star",
  "star-outline",
  "star-half",
];

export default defineMeta({
  title: "Adwaita/icons",
  component: Icon,
  parameters: { width: 528, height: 420 },
});

export const allIcons = defineStory({
  render: () => (
    <Column gap={12}>
      <Labeled
        caption={`${activeIconSet()} · ${Object.keys(ICONS).length} names · sample`}
      >
        <IconGrid names={SAMPLE} />
      </Labeled>
      <Labeled caption="sizes">
        <IconSizes />
      </Labeled>
    </Column>
  ),
});

export function colors() {
  const t = useAdwaita();
  return (
    <Column gap={12}>
      <Labeled caption="explicit colour tokens">
        <IconColors />
      </Labeled>
      <Labeled caption="default (theme foreground)">
        <Row gap={16} align="center">
          <Icon name="settings" size={20} />
          <T size="body" color={t.color.text.dim}>
            colour omitted → t.color.text.primary
          </T>
        </Row>
      </Labeled>
    </Column>
  );
}
colors.parameters = { width: 528, height: 200 };

export function styles() {
  const t = useAdwaita();
  return (
    <Column gap={12}>
      <Labeled caption={`sets: ${iconSetNames().join(", ")}`}>
        <Row gap={16} align="center">
          {STYLE_NAMES.map((name) => (
            <div
              key={name}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                alignItems: "center",
              }}
            >
              <T size="caption" color={t.color.text.dim}>
                {name}
              </T>
              <Icon name={name} size={20} />
            </div>
          ))}
        </Row>
      </Labeled>
    </Column>
  );
}
styles.parameters = { width: 528, height: 140 };
