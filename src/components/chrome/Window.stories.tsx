import { type ReactNode, useState } from "react";
import { defineMeta, defineStory } from "storybook";
import { shade, useAdwaita } from "../../theme/adwaita";
import { CloseButton } from "../overlay";
import { T } from "../text";
import { Icon } from "../icons";
import { Button } from "../Button";
import { Entry } from "../Entry";
import { Slider } from "../Slider";
import { Tabs } from "../Tabs";
import { ToggleGroup } from "../ToggleGroup";
import { ProgressBar } from "../ProgressBar";
import { Chart, type ChartData, type ChartDataPoint } from "../Chart";
import { BoxedList, BoxedRow, SwitchRow } from "../BoxedList";
import { MediaTile } from "../MediaTile";
import { Empty, EmptyMedia, EmptyTitle } from "../Empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLeadCell,
  TableNodeCell,
  TableRow,
} from "../Table";
import {
  DestructiveAction,
  EDITOR_DOCS,
  FILES_ROWS,
  FILES_WINDOW,
  FilesColumnHeader,
  FilesHeaderBar,
  FilesNarrowWindow,
  FilesSidebar,
  HeaderActions,
  MONITOR_ROWS,
  MONITOR_VIEWS,
  NOW_PLAYING,
  PODCAST_SHOWS,
  PaneColumn,
  PaneRow,
  PaneTitle,
  README_LINES,
  RESOURCES_APPS,
  ResourcesSidebar,
  SETTINGS_NAV_APPEARANCE,
  SETTINGS_NAV_INPUT,
  SectionHeading,
  SettingsSidebar,
  Transport,
  WEATHER_HOURLY,
  WEATHER_VIEWS,
  WINDOWS,
  WindowFrame,
  filesMetrics,
} from "../../../.storybook/app-helpers";
import { HeaderBar } from "./HeaderBar";
import { LocationEntry } from "./LocationEntry";
import { StatusBar } from "./StatusBar";
import { ViewSwitcher, type ViewSwitcherItem } from "./ViewSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "./Sidebar";

const meta = defineMeta({
  title: "Adwaita/Window",
  parameters: {
    frame: false,
    width: WINDOWS.wide.width,
    height: WINDOWS.wide.height,
  },
});

export default meta;

const noop = () => {};

const MOUSE_VIEWS: ViewSwitcherItem[] = [
  { id: "mouse", icon: "monitoring", label: "Mouse" },
  { id: "touchpad", icon: "desktopWindows", label: "Touchpad" },
];

const PODCAST_VIEWS: ViewSwitcherItem[] = [
  { id: "new", icon: "schedule", label: "New" },
  { id: "shows", icon: "graphicEq", label: "Shows" },
];

function FilesWindowShell({
  size,
  header,
  children,
}: {
  size: { width: number; height: number };
  header: ReactNode;
  children: ReactNode;
}) {
  const [selected, setSelected] = useState("home");

  return (
    <WindowFrame size={size}>
      <PaneRow
        sidebar={<FilesSidebar selected={selected} onSelect={setSelected} />}
      >
        {header}
        {children}
      </PaneRow>
    </WindowFrame>
  );
}

function FilesListWindow({
  size,
}: {
  size: { width: number; height: number };
}) {
  const t = useAdwaita();
  const grow = filesMetrics(t).columnGrow;
  const [row, setRow] = useState("Documents");

  return (
    <FilesWindowShell
      size={size}
      header={<FilesHeaderBar viewIcon="gridView" />}
    >
      <Table>
        <FilesColumnHeader />
        <TableBody>
          {FILES_ROWS.map((file) => (
            <TableRow
              key={file.name}
              selected={file.name === row}
              onSelect={() => setRow(file.name)}
            >
              <TableLeadCell icon="folder" grow={grow.name}>
                {file.name}
              </TableLeadCell>
              <TableCell align="right" muted grow={grow.size}>
                {file.items}
              </TableCell>
              <TableCell align="right" muted grow={grow.modified}>
                {file.modified}
              </TableCell>
              <TableNodeCell grow={grow.action} align="right">
                {}
                <Button variant="icon" size="icon" onClick={noop}>
                  <Icon
                    name="star"
                    size={t.control.rowActionIconSize}
                    color={t.color.text.dim}
                  />
                </Button>
              </TableNodeCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FilesWindowShell>
  );
}

function FilesGridWindow({
  size,
}: {
  size: { width: number; height: number };
}) {
  const t = useAdwaita();
  const tile = filesMetrics(t).tile;
  const cols = 5;
  const tileW = Math.floor(
    (size.width -
      t.control.sidebarWidth -
      2 * tile.paddingX -
      (cols - 1) * tile.gap -
      t.space.xs) /
      cols,
  );

  return (
    <FilesWindowShell size={size} header={<FilesHeaderBar viewIcon="list" />}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignContent: "flex-start",
          gap: tile.gap,
          paddingLeft: tile.paddingX,
          paddingRight: tile.paddingX,
          paddingTop: tile.paddingY,
          paddingBottom: tile.paddingY,
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        {FILES_ROWS.map((file) => (
          <div
            key={file.name}
            onClick={noop}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: t.space.sm,
              width: tileW,
              flexShrink: 0,
              paddingTop: t.space.sm,
              paddingBottom: t.space.sm,
              borderRadius: t.radius.sm,
              cursor: "pointer",
              hover: { backgroundColor: t.color.selection.faint },
            }}
          >
            <Icon name="folder" size={tile.icon} color={t.color.accent.base} />
            <T size="list" color={t.color.text.primary}>
              {file.name}
            </T>
          </div>
        ))}
      </div>
    </FilesWindowShell>
  );
}

const RESOURCES_GROW = { name: 7.1, memory: 1.3, cpu: 1.3, gpu: 1 };

function ResourcesWindow({
  size,
}: {
  size: { width: number; height: number };
}) {
  const t = useAdwaita();
  const [selected, setSelected] = useState("apps");
  const [row, setRow] = useState("Resources");

  return (
    <WindowFrame size={size}>
      <PaneRow sidebar={<ResourcesSidebar selected={selected} />}>
        <HeaderBar
          left={
            <Button variant="icon" size="icon" icon="search" onClick={noop} />
          }
          center={<PaneTitle title="Apps" />}
          centerStyle={{ justifyContent: "center" }}
          right={
            <>
              <Button variant="icon" size="icon" icon="info" onClick={noop} />
              <DestructiveAction
                label="End App"
                trailingIcon="expandMore"
                onClick={noop}
              />
              <Button
                variant="secondary"
                size="icon"
                icon="close"
                onClick={noop}
              />
            </>
          }
        />
        <Table density="dense" selection="accent">
          <TableHeader>
            <TableNodeCell grow={RESOURCES_GROW.name}>
              <T size="caption" color={t.color.text.dim}>
                App
              </T>
              <Icon
                name="expandLess"
                size={t.control.caretIconSize}
                color={t.color.text.dim}
              />
            </TableNodeCell>
            <TableHead align="right" grow={RESOURCES_GROW.memory}>
              Memory
            </TableHead>
            <TableHead align="right" grow={RESOURCES_GROW.cpu}>
              Processor
            </TableHead>
            <TableHead align="right" grow={RESOURCES_GROW.gpu}>
              GPU
            </TableHead>
          </TableHeader>
          <TableBody>
            {RESOURCES_APPS.map((app) => (
              <TableRow
                key={app.name}
                selected={app.name === row}
                onSelect={() => setRow(app.name)}
              >
                <TableLeadCell icon={app.icon} grow={RESOURCES_GROW.name}>
                  {app.name}
                </TableLeadCell>
                <TableCell
                  align="right"
                  grow={RESOURCES_GROW.memory}
                  style={{ fontFamily: t.type.fontFamilyMono }}
                >
                  {app.memory}
                </TableCell>
                <TableCell
                  align="right"
                  grow={RESOURCES_GROW.cpu}
                  style={{ fontFamily: t.type.fontFamilyMono }}
                >
                  {app.cpu}
                </TableCell>
                <TableCell
                  align="right"
                  grow={RESOURCES_GROW.gpu}
                  style={{ fontFamily: t.type.fontFamilyMono }}
                >
                  {app.gpu}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PaneRow>
    </WindowFrame>
  );
}

function StyleTiles() {
  const t = useAdwaita();
  const tiles: { id: string; label: string; fill: string }[] = [
    { id: "default", label: "Default", fill: t.color.surface.view },
    { id: "dark", label: "Dark", fill: t.color.surface.osd },
  ];
  const [style, setStyle] = useState("default");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: t.space.lg,
        padding: t.space.lg,
      }}
    >
      {tiles.map((tile) => {
        const selected = tile.id === style;
        return (
          <div
            key={tile.id}
            onClick={() => setStyle(tile.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: t.space.sm,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: t.control.themePreviewWidth,
                height: t.control.themePreviewHeight,
                borderRadius: t.radius.sm,
                backgroundColor: t.color.surface.button,
                borderWidth: selected ? t.control.dividerThicknessStrong : 0,
                borderColor: t.color.accent.base,
              }}
            >
              <div
                style={{
                  width: t.control.themePreviewInnerWidth,
                  height: t.control.themePreviewInnerHeight,
                  borderRadius: t.radius.sm,
                  backgroundColor: tile.fill,
                }}
              />
            </div>
            <T size="body" color={t.color.text.primary}>
              {tile.label}
            </T>
          </div>
        );
      })}
    </div>
  );
}

function SettingsPaneWindow({
  size,
  selected,
  groups,
  center,
  children,
}: {
  size: { width: number; height: number };
  selected: string;
  groups: typeof SETTINGS_NAV_APPEARANCE;
  center: ReactNode;
  children: ReactNode;
}) {
  const t = useAdwaita();

  return (
    <WindowFrame size={size}>
      <PaneRow
        sidebar={<SettingsSidebar selected={selected} groups={groups} />}
      >
        <HeaderBar
          center={center}
          centerStyle={{ justifyContent: "center" }}
          right={
            <Button
              variant="secondary"
              size="icon"
              icon="close"
              onClick={noop}
            />
          }
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.space.md,
            flexGrow: 1,
            minHeight: 0,
            paddingLeft: t.space.xl,
            paddingRight: t.space.xl,
            paddingBottom: t.space.xl,
          }}
        >
          {children}
        </div>
      </PaneRow>
    </WindowFrame>
  );
}

function SettingsAppearanceWindow({
  size,
}: {
  size: { width: number; height: number };
}) {
  const t = useAdwaita();
  return (
    <SettingsPaneWindow
      size={size}
      selected="appearance"
      groups={SETTINGS_NAV_APPEARANCE}
      center={<PaneTitle title="Appearance" />}
    >
      <SectionHeading>Style</SectionHeading>
      <BoxedList>
        <StyleTiles />
      </BoxedList>
      <SectionHeading
        trailing={
          <Button
            variant="text"
            size="sm"
            icon="add"
            label="Add Picture…"
            onClick={noop}
          />
        }
      >
        Background
      </SectionHeading>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: t.control.mediaTileGap,
          width: t.control.mediaTileGroupWidth,
          paddingLeft: t.control.mediaTilePadding,
          paddingRight: t.control.mediaTilePadding,
          alignSelf: "center",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <MediaTile
            key={i}
            width={t.control.mediaTileWidth}
            height={t.control.mediaTileHeight}
            label={`${i + 1}`}
            tintIndex={i % t.color.chart.series.length}
            selected={i === 0}
            badge={i === 0}
            onSelect={noop}
          />
        ))}
      </div>
    </SettingsPaneWindow>
  );
}

function SettingsMouseWindow({
  size,
}: {
  size: { width: number; height: number };
}) {
  const t = useAdwaita();
  const [primary, setPrimary] = useState("left");
  const [speed, setSpeed] = useState<number>(70);
  const [acceleration, setAcceleration] = useState(true);
  const [scroll, setScroll] = useState("traditional");
  const sliderWidth = t.control.rowSliderWidth;

  return (
    <SettingsPaneWindow
      size={size}
      selected="mouse"
      groups={SETTINGS_NAV_INPUT}
      center={
        <ViewSwitcher items={MOUSE_VIEWS} value="mouse" onChange={noop} />
      }
    >
      <SectionHeading>General</SectionHeading>
      <BoxedList>
        <BoxedRow
          title="Primary Button"
          subtitle="Order of physical buttons on mice and touchpads"
          trailing={
            <ToggleGroup
              options={[
                { id: "left", label: "Left" },
                { id: "right", label: "Right" },
              ]}
              value={primary}
              onChange={setPrimary}
            />
          }
        />
      </BoxedList>
      <SectionHeading>Mouse</SectionHeading>
      <BoxedList>
        <BoxedRow
          title="Pointer Speed"
          trailing={
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: t.space.sm,
              }}
            >
              <T size="caption" color={t.color.text.dim}>
                Slow
              </T>
              <Slider
                value={speed}
                min={0}
                max={100}
                onValueChange={(value) =>
                  setSpeed(Array.isArray(value) ? value[0] : value)
                }
                width={sliderWidth}
              />
              <T size="caption" color={t.color.text.dim}>
                Fast
              </T>
            </div>
          }
        />
        <SwitchRow
          title="Mouse Acceleration"
          subtitle="Recommended for most users and applications"
          checked={acceleration}
          onChange={setAcceleration}
        />
        <BoxedRow
          title="Scroll Direction"
          caption={
            scroll === "traditional"
              ? "Scrolling moves the view"
              : "Scrolling moves the content"
          }
          trailing={
            <ToggleGroup
              options={[
                { id: "traditional", label: "Traditional" },
                { id: "natural", label: "Natural" },
              ]}
              value={scroll}
              onChange={setScroll}
            />
          }
        />
      </BoxedList>
    </SettingsPaneWindow>
  );
}

function WeatherWindow({ size }: { size: { width: number; height: number } }) {
  const t = useAdwaita();
  const [view, setView] = useState("hourly");

  const lineHeight = 1.4;
  const cellWidth = t.control.weatherCellWidth;
  const stripWidth = size.width - t.control.weatherStripInsetX;
  const headBand =
    t.space.md + t.type.body * lineHeight + t.space.sm + t.control.navIconSize;
  const topBlock = t.space.lg + t.control.weatherGlyphSize + t.space.md;
  const footerBand =
    t.space.md +
    t.space.xs +
    t.type.body * lineHeight +
    t.type.caption * lineHeight +
    t.space.lg;
  const curveHeight = Math.max(
    t.control.hourlyCurveHeight,
    size.height - t.control.headerBarHeight - topBlock - headBand - footerBand,
  );
  const curve: ChartData = WEATHER_HOURLY.map((hour) => ({
    label: "",
    value: hour.temp,
  }));

  return (
    <WindowFrame size={size}>
      <HeaderBar
        left={
          <Button variant="icon" size="icon" icon="refresh" onClick={noop} />
        }
        center={
          <ViewSwitcher items={WEATHER_VIEWS} value={view} onChange={setView} />
        }
        centerStyle={{ justifyContent: "center" }}
        right={<HeaderActions icons={["menu"]} onClick={noop} />}
      />
      <PaneColumn bg={t.color.surface.view} grow={1}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: t.control.weatherHeadGap,
            paddingLeft: t.control.weatherHeadInsetX,
            paddingTop: t.space.lg,
          }}
        >
          <Icon
            name="sunny"
            size={t.control.weatherGlyphSize}
            color={t.color.functional.warning}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: t.space.xs,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: t.space.xs,
              }}
            >
              <T size="title4" weight={600}>
                Budapest, Hungary
              </T>
              <Icon
                name="expandMore"
                size={t.control.caretIconSize}
                color={t.color.text.primary}
              />
            </div>
            <T size="display" weight={700}>
              24°
            </T>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
            position: "relative",
            marginTop: t.space.md,
            paddingLeft: t.control.weatherStripInsetX,
          }}
        >
          {WEATHER_HOURLY.slice(0, -1).map((hour, i) => (
            <div
              key={`rule-${hour.time}`}
              style={{
                position: "absolute",
                left: (i + 1) * cellWidth,
                top: 0,
                height: headBand,
                width: t.control.dividerThickness,
                backgroundColor: t.color.divider.faint,
                pointerEvents: "none",
              }}
            />
          ))}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              paddingTop: t.space.md,
            }}
          >
            {WEATHER_HOURLY.map((hour) => (
              <div
                key={hour.time}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: t.space.sm,
                  width: cellWidth,
                  flexShrink: 0,
                  minWidth: 0,
                }}
              >
                <T size="body" color={t.color.text.dim}>
                  {hour.time}
                </T>
                <Icon
                  name={hour.icon}
                  size={t.control.navIconSize}
                  color={t.color.functional.warning}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              minHeight: 0,
              position: "relative",
            }}
          >
            <Chart
              type="line"
              data={curve}
              fill
              width={stripWidth}
              height={curveHeight}
              color={t.color.chart.sun.line}
              fillTop={t.color.chart.sun.fillTop}
              fillBottom={t.color.chart.sun.fillBottom}
              grid={false}
              markers={false}
              labels={false}
              hideZeroLabels
              style={{ pointerEvents: "none" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                position: "absolute",
                left: 0,
                right: 0,
                bottom: t.space.lg,
                pointerEvents: "none",
              }}
            >
              {WEATHER_HOURLY.map((hour) => (
                <div
                  key={hour.time}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    width: cellWidth,
                    flexShrink: 0,
                    minWidth: 0,
                  }}
                >
                  <T
                    size="body"
                    weight={600}
                    color={t.color.functional.warning}
                  >
                    {`${hour.temp}°`}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              right: t.control.weatherPagerInset,
              top: 0,
              bottom: 0,
            }}
          >
            <Button
              variant="icon"
              size="icon"
              onClick={noop}
              style={{
                width: t.control.weatherPagerSize,
                height: t.control.weatherPagerSize,
                borderRadius: t.radius.full,
                backgroundColor: t.color.surface.osd,
                hover: { backgroundColor: shade(t.color.surface.osd, 0.12) },
                active: { backgroundColor: shade(t.color.surface.osd, -0.15) },
              }}
            >
              <Icon
                name="chevronRight"
                size={t.control.navIconSize}
                color={t.color.text.onOsd}
              />
            </Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.space.xs,
            paddingLeft: t.control.weatherHeadInsetX,
            paddingRight: t.space.lg,
            paddingTop: t.space.md,
            paddingBottom: t.space.lg,
          }}
        >
          <T size="body" color={t.color.text.dim}>
            Updated just now.
          </T>
          <T size="caption" color={t.color.text.dim}>
            Weather data from the Norwegian Meteorological Institute.
          </T>
        </div>
      </PaneColumn>
    </WindowFrame>
  );
}

function EditorWindow({ size }: { size: { width: number; height: number } }) {
  const t = useAdwaita();
  const [doc, setDoc] = useState("readme");

  return (
    <WindowFrame size={size}>
      <HeaderBar
        left={
          <>
            <Button
              variant="icon"
              label="Open"
              trailingIcon="expandMore"
              onClick={noop}
            />
            <Button variant="icon" size="icon" icon="add" onClick={noop} />
          </>
        }
        center={<PaneTitle title="README.md" caption="~/Downloads" />}
        centerStyle={{ justifyContent: "center" }}
        right={<HeaderActions icons={["search", "menu"]} onClick={noop} />}
      />
      <Tabs
        variant="strip"
        items={EDITOR_DOCS}
        value={doc}
        onSelect={setDoc}
        onClose={noop}
      />
      <PaneColumn bg={t.color.surface.view} grow={1}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.space.xs,
            flexGrow: 1,
            minHeight: 0,
            padding: t.space.lg,
          }}
        >
          {README_LINES.map((line, i) => (
            <T
              key={i}
              size="body"
              color={line.dim ? t.color.text.dim : t.color.text.primary}
              style={{ fontFamily: t.type.fontFamilyMono }}
            >
              {line.text === "" ? " " : line.text}
            </T>
          ))}
        </div>
      </PaneColumn>
    </WindowFrame>
  );
}

function waveform(played: number, rest: number): ChartData {
  const peaks = [
    18, 30, 46, 38, 52, 60, 44, 66, 58, 70, 50, 62, 74, 40, 56, 68, 82, 60, 48,
    72, 64, 88, 54, 76, 42, 66, 90, 58, 70, 50, 84, 62, 46, 74, 56, 68, 38, 52,
    64, 44,
  ];
  const bars: ChartDataPoint[] = [];

  const stride = 5;
  for (let i = 0; i < played; i += 1) {
    bars.push({ label: "", value: peaks[(i * stride) % peaks.length] });
  }
  for (let i = 0; i < rest; i += 1) {
    bars.push({
      label: "",
      value: peaks[(i * stride + 11) % peaks.length] * 0.7,
    });
  }
  return bars;
}

const PLAYER_TIME = { elapsed: "02:18", total: "03:21" };
const PLAYER_FRACTION = (2 * 60 + 18) / (3 * 60 + 21);

function PlayerWindow({ size }: { size: { width: number; height: number } }) {
  const t = useAdwaita();
  const playedCount = Math.round(t.control.waveformBars * PLAYER_FRACTION);
  const restCount = t.control.waveformBars - playedCount;

  return (
    <WindowFrame size={size}>
      <HeaderBar
        left={<Button variant="icon" size="icon" icon="menu" onClick={noop} />}
        center={<PaneTitle title="Take Frequent Breaks" caption="Jimmac" />}
        centerStyle={{ justifyContent: "center" }}
        right={
          <Button variant="secondary" size="icon" icon="close" onClick={noop} />
        }
      />
      <PaneColumn bg={t.color.surface.view} grow={1}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: t.space.xs,
            flexGrow: 1,
            minHeight: 0,
            alignItems: "center",
            paddingLeft: t.space.lg,
            paddingRight: t.space.lg,
          }}
        >
          <Chart
            type="bar"
            data={waveform(playedCount, 0)}
            height={t.control.waveformHeight}
            color={t.color.accent.base}
            gap={t.control.waveformBarGap}
            barWidth={t.control.waveformBarWidth}
            grid={false}
            labels={false}
            hideZeroLabels
            style={{
              flexGrow: playedCount,
              flexBasis: 0,
              minWidth: 0,
              overflow: "hidden",
            }}
          />
          <Chart
            type="bar"
            data={waveform(0, restCount)}
            height={t.control.waveformHeight}
            color={t.color.text.dim}
            gap={t.control.waveformBarGap}
            barWidth={t.control.waveformBarWidth}
            grid={false}
            labels={false}
            hideZeroLabels
            style={{
              flexGrow: restCount,
              flexBasis: 0,
              minWidth: 0,
              overflow: "hidden",
            }}
          />
        </div>
      </PaneColumn>
      <StatusBar message={PLAYER_TIME.elapsed} trailing={PLAYER_TIME.total} />
      <Transport />
    </WindowFrame>
  );
}

const MONITOR_GROW = {
  name: 2.4,
  cpu: 0.8,
  id: 0.8,
  memory: 1,
  diskReadTotal: 1.1,
  diskWriteTotal: 1.1,
  diskRead: 0.9,
  diskWrite: 0.9,
  priority: 0.9,
};

function ProcessWindow({ size }: { size: { width: number; height: number } }) {
  const t = useAdwaita();
  const [view, setView] = useState("processes");
  const [row, setRow] = useState("gnome-shell");

  return (
    <WindowFrame size={size}>
      <HeaderBar
        center={
          <ViewSwitcher items={MONITOR_VIEWS} value={view} onChange={setView} />
        }
        centerStyle={{ justifyContent: "center" }}
        right={
          <HeaderActions
            icons={["search", "menu"]}
            trailing={<DestructiveAction label="End Process" onClick={noop} />}
            onClick={noop}
          />
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          padding: t.space.md,
        }}
      >
        <Entry
          value="gnome"
          onChange={noop}
          leading={
            <Icon
              name="search"
              size={t.control.navIconSize}
              color={t.color.text.dim}
            />
          }
          trailing={<CloseButton onClick={noop} />}
          focused
          style={{ width: t.control.filterEntryWidth }}
        />
      </div>
      <PaneColumn bg={t.color.surface.view} grow={1}>
        <Table density="compact" selection="accent">
          <TableHeader>
            <TableNodeCell grow={MONITOR_GROW.name}>
              <T size="caption" color={t.color.text.dim}>
                Process Name
              </T>
            </TableNodeCell>
            <TableNodeCell align="right" grow={MONITOR_GROW.cpu}>
              <T size="caption" color={t.color.text.dim}>
                % CPU
              </T>
              <Icon
                name="expandMore"
                size={t.control.caretIconSize}
                color={t.color.text.dim}
              />
            </TableNodeCell>
            <TableHead align="right" grow={MONITOR_GROW.id}>
              ID
            </TableHead>
            <TableHead align="right" grow={MONITOR_GROW.memory}>
              Memory
            </TableHead>
            <TableHead align="right" grow={MONITOR_GROW.diskReadTotal}>
              Disk read total
            </TableHead>
            <TableHead align="right" grow={MONITOR_GROW.diskWriteTotal}>
              Disk write total
            </TableHead>
            <TableHead align="right" grow={MONITOR_GROW.diskRead}>
              Disk read
            </TableHead>
            <TableHead align="right" grow={MONITOR_GROW.diskWrite}>
              Disk write
            </TableHead>
            <TableHead align="right" grow={MONITOR_GROW.priority}>
              Priority
            </TableHead>
          </TableHeader>
          <TableBody>
            {MONITOR_ROWS.map((proc) => (
              <TableRow
                key={proc.id}
                selected={proc.name === row}
                onSelect={() => setRow(proc.name)}
              >
                <TableLeadCell icon="desktopWindows" grow={MONITOR_GROW.name}>
                  {proc.name}
                </TableLeadCell>
                <TableCell
                  align="right"
                  grow={MONITOR_GROW.cpu}
                  style={{ fontFamily: t.type.fontFamilyMono }}
                >
                  {proc.cpu}
                </TableCell>
                <TableCell
                  align="right"
                  muted
                  grow={MONITOR_GROW.id}
                  style={{ fontFamily: t.type.fontFamilyMono }}
                >
                  {proc.id}
                </TableCell>
                <TableCell
                  align="right"
                  grow={MONITOR_GROW.memory}
                  style={{ fontFamily: t.type.fontFamilyMono }}
                >
                  {proc.memory}
                </TableCell>
                <TableCell
                  align="right"
                  grow={MONITOR_GROW.diskReadTotal}
                  style={{ fontFamily: t.type.fontFamilyMono }}
                >
                  {proc.diskRead}
                </TableCell>
                <TableCell
                  align="right"
                  grow={MONITOR_GROW.diskWriteTotal}
                  style={{ fontFamily: t.type.fontFamilyMono }}
                >
                  {proc.diskWrite}
                </TableCell>
                <TableCell
                  align="right"
                  grow={MONITOR_GROW.diskRead}
                  style={{ fontFamily: t.type.fontFamilyMono }}
                >
                  {proc.diskRead}
                </TableCell>
                <TableCell
                  align="right"
                  grow={MONITOR_GROW.diskWrite}
                  style={{ fontFamily: t.type.fontFamilyMono }}
                >
                  {proc.diskWrite}
                </TableCell>
                <TableCell align="right" muted grow={MONITOR_GROW.priority}>
                  {proc.priority}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PaneColumn>
    </WindowFrame>
  );
}

function ContactsWindow({ size }: { size: { width: number; height: number } }) {
  const t = useAdwaita();
  return (
    <WindowFrame size={size}>
      <HeaderBar
        left={<Button variant="icon" size="icon" icon="add" onClick={noop} />}
        center={<PaneTitle title="Contacts" />}
        centerStyle={{ justifyContent: "center" }}
        right={<HeaderActions icons={["check", "menu"]} onClick={noop} />}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          minHeight: 0,
          minWidth: 0,
          backgroundColor: t.color.surface.view,
        }}
      >
        <Sidebar>
          <SidebarHeader>
            {}
            <Entry
              placeholder="Type to search"
              surface="control"
              onChange={noop}
              leading={
                <Icon
                  name="search"
                  size={t.control.navIconSize}
                  color={t.color.text.dim}
                />
              }
              style={{ flexGrow: 1, minWidth: 0 }}
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup />
          </SidebarContent>
        </Sidebar>
        <PaneColumn bg={t.color.surface.view} grow={1}>
          <Empty
            style={{ flexGrow: 1, minHeight: 0, justifyContent: "center" }}
          >
            <EmptyMedia icon="accountCircle" />
            <EmptyTitle>Select a Contact</EmptyTitle>
          </Empty>
        </PaneColumn>
      </div>
    </WindowFrame>
  );
}

function PodcastsWindow({ size }: { size: { width: number; height: number } }) {
  const t = useAdwaita();
  const [view, setView] = useState("shows");

  const inset = t.control.podcastTileInset;
  const gap = t.control.podcastTileGap;
  const seriesCount = t.color.chart.series.length;
  const tile = Math.floor((size.width - 2 * inset - 4 * gap) / 5);

  return (
    <WindowFrame size={size}>
      <HeaderBar
        left={<Button variant="icon" size="icon" icon="add" onClick={noop} />}
        center={
          <ViewSwitcher items={PODCAST_VIEWS} value={view} onChange={setView} />
        }
        centerStyle={{ justifyContent: "center" }}
        right={<HeaderActions icons={["menu"]} onClick={noop} />}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap,
          flexGrow: 1,
          minHeight: 0,
          alignContent: "flex-start",
          paddingLeft: inset,
          paddingRight: inset,
          paddingTop: inset,
        }}
      >
        {PODCAST_SHOWS.map((show, i) => (
          <MediaTile
            key={show}
            width={tile}
            label={show}
            tintIndex={i % seriesCount}
            onSelect={noop}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.md,
          paddingLeft: t.space.md,
          paddingRight: t.space.md,
          paddingTop: t.space.sm,
          paddingBottom: t.space.sm,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: t.space.sm,
          }}
        >
          <Button variant="icon" size="icon" icon="rotateLeft" onClick={noop} />
          <Button variant="icon" size="icon" icon="pause" onClick={noop} />
          <Button
            variant="icon"
            size="icon"
            icon="rotateRight"
            onClick={noop}
          />
        </div>
        <MediaTile width={t.control.transportArtSize} label="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <T size="body" color={t.color.text.primary}>
            {NOW_PLAYING.show}
          </T>
          <T
            size="body"
            weight={600}
            color={t.color.text.primary}
            clamp={1}
            style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
          >
            {NOW_PLAYING.episode}
          </T>
        </div>
        <ProgressBar
          value={38}
          height={4}
          style={{ width: t.control.seekRailWidth, flexShrink: 0 }}
        />
        <T size="body" color={t.color.text.primary}>
          {`${NOW_PLAYING.elapsed} / ${NOW_PLAYING.total}`}
        </T>
        <T size="body" color={t.color.text.primary}>
          {NOW_PLAYING.speed}
        </T>
      </div>
    </WindowFrame>
  );
}

export const filesList = defineStory({
  parameters: { width: FILES_WINDOW.width, height: FILES_WINDOW.height },
  render: () => <FilesListWindow size={FILES_WINDOW} />,
});

export const filesGrid = defineStory({
  parameters: { width: FILES_WINDOW.width, height: FILES_WINDOW.height },
  render: () => <FilesGridWindow size={FILES_WINDOW} />,
});

export const resourcesApps = defineStory({
  parameters: { width: WINDOWS.wide.width, height: 620 },
  render: () => (
    <ResourcesWindow size={{ width: WINDOWS.wide.width, height: 620 }} />
  ),
});

export const settingsAppearance = defineStory({
  parameters: { width: WINDOWS.wide.width, height: 620 },
  render: () => (
    <SettingsAppearanceWindow
      size={{ width: WINDOWS.wide.width, height: 620 }}
    />
  ),
});

export const settingsMouse = defineStory({
  parameters: { width: WINDOWS.wide.width, height: 620 },
  render: () => (
    <SettingsMouseWindow size={{ width: WINDOWS.wide.width, height: 620 }} />
  ),
});

export const weatherHourly = defineStory({
  parameters: { width: 758, height: 612 },
  render: () => <WeatherWindow size={{ width: 758, height: 612 }} />,
});

export const editorTabs = defineStory({
  parameters: { width: 900, height: 560 },
  render: () => <EditorWindow size={{ width: 900, height: 560 }} />,
});

export const playerTransport = defineStory({
  parameters: { width: 900, height: 520 },
  render: () => <PlayerWindow size={{ width: 900, height: 520 }} />,
});

export const processFilter = defineStory({
  parameters: { width: 940, height: 520 },
  render: () => <ProcessWindow size={{ width: 940, height: 520 }} />,
});

export const contactsEmpty = defineStory({
  parameters: { width: 820, height: 560 },
  render: () => <ContactsWindow size={{ width: 820, height: 560 }} />,
});

export const podcastsLibrary = defineStory({
  parameters: { width: 900, height: 660 },
  render: () => <PodcastsWindow size={{ width: 900, height: 660 }} />,
});

export const filesNarrow = defineStory({
  parameters: { width: 420, height: 560 },
  render: () => <FilesNarrowWindow size={{ width: 420, height: 560 }} />,
});
