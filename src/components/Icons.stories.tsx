import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T, Labeled } from "./common";
import { Row, Column } from "./Box";
import { ICONS, Icon, type IconName } from "./icons";

function IconGrid({ names }: { names?: IconName[] }) {
  const { colors } = useAdwaita();
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
          <T size="caption" color={colors.dim_fg}>
            {n}
          </T>
          <Icon name={n} size={16} />
        </div>
      ))}
    </div>
  );
}

function IconSizes() {
  const { colors } = useAdwaita();
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
          <T size="caption" color={colors.dim_fg}>
            {s}px
          </T>
          <Icon name="settings" size={s} />
        </div>
      ))}
    </div>
  );
}

const TONES = [
  ["fg", "fg"],
  ["dim", "dim_fg"],
  ["accent", "accent"],
  ["destructive", "destructive"],
  ["success", "success"],
  ["warning", "warning"],
] as const;

function IconColors() {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
      }}
    >
      {TONES.map(([label, key]) => (
        <div
          key={label}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "center",
          }}
        >
          <Icon name="check" size={20} color={colors[key]} />
          <T size="caption" color={colors.dim_fg}>
            {label}
          </T>
        </div>
      ))}
    </div>
  );
}

const SAMPLE: IconName[] = [
  "close",
  "plus",
  "chevronDown",
  "info",
  "warning",
  "success",
  "settings",
  "user",
  "search",
  "home",
  "bell",
  "clock",
  "trash",
  "sun",
  "moon",
  "refresh",
];

export default defineMeta({
  title: "Adwaita/icons",
  component: Icon,
  parameters: { width: 528, height: 420 },
});

export const allIcons = defineStory({
  render: () => (
    <Column gap={12}>
      <Labeled caption={`All ${Object.keys(ICONS).length} icons`}>
        <IconGrid />
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
          <T size="body" color={t.colors.dim_fg}>
            colour omitted → t.colors.fg
          </T>
        </Row>
      </Labeled>
    </Column>
  );
}
colors.parameters = { width: 528, height: 200 };
