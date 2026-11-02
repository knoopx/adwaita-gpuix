import { defineMeta } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { Icon } from "./icons";
import { Switch } from "./Switch";
import { Entry } from "./Entry";
import { ToggleGroup } from "./ToggleGroup";
import { type ViewSwitcherItem } from "./chrome/ViewSwitcher";
import { PreferencesGroup, PreferencesPage } from "./PreferencesPage";
import {
  BoxedList,
  BoxedRow,
  ComboRow,
  EntryRow,
  SwitchRow,
} from "./BoxedList";
import {
  ContentHeader,
  PaneBody,
  SETTINGS_NAV_APPEARANCE,
  SettingsWindow,
  WindowShell,
} from "../../.storybook/window-shell";

export default defineMeta({
  title: "Adwaita/PreferencesPage",
  component: PreferencesPage,
  parameters: { width: 900, height: 640 },
});

const noop = () => {};

const KOMIKKU_VIEWS = [
  { id: "general", icon: "settings" as const, label: "General" },
  { id: "library", icon: "gridView" as const, label: "Library" },
  { id: "reader", icon: "license" as const, label: "Reader" },
  { id: "advanced", icon: "autoAwesome" as const, label: "Advanced" },
];

export function appearancePage() {
  return (
    <SettingsWindow
      size={{ width: 900, height: 420 }}
      nav={SETTINGS_NAV_APPEARANCE}
      selected="appearance"
      header={<ContentHeader title="Appearance" trailingIcons={["close"]} />}
    >
      <PaneBody>
        <PreferencesPage>
          <PreferencesGroup title="Style">
            <BoxedRow
              title="Style"
              trailing={
                <ToggleGroup
                  size="lg"
                  value="default"
                  onChange={noop}
                  options={[
                    { id: "default", label: "Default" },
                    { id: "dark", label: "Dark" },
                  ]}
                />
              }
            />
          </PreferencesGroup>
          <PreferencesGroup
            title="Background"
            action={{ label: "Add Picture…", icon: "add", onClick: noop }}
          >
            <BoxedList />
          </PreferencesGroup>
        </PreferencesPage>
      </PaneBody>
    </SettingsWindow>
  );
}
appearancePage.parameters = { width: 900, height: 420 };

export function komikkuGeneral() {
  return (
    <WindowShell size={{ width: 900, height: 700 }}>
      <PaneBody>
        <ContentHeader
          title="Komikku"
          trailingIcons={["menu", "close"]}
          view={KOMIKKU_VIEWS}
          viewValue="general"
          left={
            <Button variant="icon" size="icon" icon="search" onClick={noop} />
          }
        />
        <PreferencesPage>
          <PreferencesGroup title="Appearance">
            <ComboRow
              title="Theme"
              value="Light"
              options={["Light", "Dark"]}
              onChange={noop}
            />
            <SwitchRow
              title="Night Light"
              subtitle="Automatically enable dark theme at night"
              checked={false}
              onChange={noop}
            />
            <SwitchRow
              title="Accent Color"
              subtitle="Use system accent colors"
              checked={false}
              onChange={noop}
            />
            <ComboRow
              title="Progress Bars Theme"
              subtitle="Theme to use for progress bars"
              value="Accent Color"
              options={["Accent Color", "Rainbow"]}
              onChange={noop}
            />
            <ComboRow
              title="Backdrop in Details Page"
              subtitle="Method used to recolor background to match cover"
              value="None"
              options={["None", "Blur", "Solid"]}
              onChange={noop}
            />
          </PreferencesGroup>
          <PreferencesGroup title="Notifications">
            <SwitchRow
              title="Desktop Notifications"
              subtitle="Use desktop notifications for downloads and library updates"
              checked={false}
              onChange={noop}
            />
          </PreferencesGroup>
          <PreferencesGroup title="Tracking">
            <BoxedList />
          </PreferencesGroup>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
komikkuGeneral.parameters = { width: 900, height: 700 };

const NEWSFLASH_VIEWS: ViewSwitcherItem[] = [
  { id: "views", icon: "visibility", label: "Views" },
  { id: "app", icon: "settings", label: "App" },
  { id: "keybindings", icon: "textFormat", label: "Keybindings" },
  { id: "sharing", icon: "share", label: "Sharing" },
];

function NewsFlashHeader({
  selected,
  views = NEWSFLASH_VIEWS,
}: {
  selected: string;
  views?: ViewSwitcherItem[];
}) {
  return (
    <ContentHeader
      title="NewsFlash"
      trailingIcons={["close"]}
      view={views}
      viewValue={selected}
    />
  );
}

export function feedListPage() {
  return (
    <WindowShell size={{ width: 900, height: 470 }}>
      <PaneBody>
        <NewsFlashHeader selected="app" />
        <PreferencesPage>
          <PreferencesGroup title="Feed List">
            <ComboRow
              title="Order"
              value="Manual"
              options={["Manual", "Alphabetical"]}
              onChange={noop}
            />
            <SwitchRow
              title="Only Show Relevant Items"
              subtitle="Hide feeds and categories without unread/unstarred items"
              checked={false}
              onChange={noop}
            />
          </PreferencesGroup>
          <PreferencesGroup title="Article List">
            <ComboRow
              title="Order"
              value="Newest First"
              options={["Newest First", "Oldest First"]}
              onChange={noop}
            />
            <ComboRow
              title="Order by"
              value="Last Updated"
              options={["Last Updated", "Date Published"]}
              onChange={noop}
            />
          </PreferencesGroup>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
feedListPage.parameters = { width: 900, height: 470 };

export function themeTiles() {
  const t = useAdwaita();
  const themes = [
    "Adwaita",
    "Spring",
    "Midnight",
    "Parchment",
    "Gruvbox",
    "Zorin",
  ];
  return (
    <WindowShell size={{ width: 900, height: 300 }}>
      <PaneBody>
        <NewsFlashHeader selected="views" views={NEWSFLASH_VIEWS.slice(0, 2)} />
        <PreferencesPage>
          <PreferencesGroup title="Appearance">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: t.space.md,
                padding: t.space.md,
              }}
            >
              {themes.map((theme) => (
                <div
                  key={theme}
                  onClick={noop}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: t.space.sm,
                    minWidth: t.control.themePreviewWidth / 2,
                    minHeight: t.control.viewSwitcherHeight,
                    paddingLeft: t.space.lg,
                    paddingRight: t.space.lg,
                    borderRadius: t.radius.sm,
                    borderWidth: theme === "Adwaita" ? 2 : 1,
                    borderColor:
                      theme === "Adwaita"
                        ? t.color.accent.base
                        : t.color.border.default,
                    backgroundColor: t.color.surface.input,
                    cursor: "pointer",
                  }}
                >
                  <T size="body" weight={600} color={t.color.text.primary}>
                    {theme}
                  </T>
                  {theme === "Adwaita" ? (
                    <Icon name="check" size={16} color={t.color.accent.base} />
                  ) : null}
                </div>
              ))}
            </div>
          </PreferencesGroup>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
themeTiles.parameters = { width: 900, height: 300 };

export function keyEditorPage() {
  return (
    <WindowShell size={{ width: 900, height: 300 }}>
      <PaneBody>
        <ContentHeader
          title="Icon Theme"
          trailingIcons={["search", "menu", "close"]}
        />
        <PreferencesPage>
          <BoxedList>
            <SwitchRow
              title="Use default value"
              checked={false}
              onChange={noop}
            />
            <EntryRow title="Custom value" value="Adwaita" onChange={noop} />
          </BoxedList>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
keyEditorPage.parameters = { width: 900, height: 300 };

function Button({
  variant,
  size,
  icon,
  onClick,
}: {
  variant: "icon";
  size: "icon";
  icon: Parameters<typeof Icon>[0]["name"];
  onClick: () => void;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: t.control.viewSwitcherHeight,
        height: t.control.viewSwitcherHeight,
        borderRadius: t.radius.sm,
        cursor: "pointer",
        hover: { backgroundColor: t.color.surface.buttonHover },
      }}
    >
      <Icon name={icon} size={16} color={t.color.text.primary} />
    </div>
  );
}
