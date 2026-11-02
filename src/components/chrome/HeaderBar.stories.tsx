import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { CloseButton } from "../overlay";
import { Labeled } from "../text";
import { Button } from "../Button";
import { Entry } from "../Entry";
import { Icon } from "../icons";
import { HeaderBar } from "./HeaderBar";
import { LocationEntry } from "./LocationEntry";
import { ViewSwitcher } from "./ViewSwitcher";
import {
  FILES_VIEWS,
  FilesHeaderBar,
  HeaderActions,
  PaneTitle,
  Stack,
  WEATHER_VIEWS,
} from "../../../.storybook/app-helpers";

function SearchEntry() {
  const t = useAdwaita();
  return (
    <Entry
      value="ta"
      onChange={() => {}}
      leading={
        <Icon name="search" size={t.type.body} color={t.color.text.dim} />
      }
      trailing={<CloseButton onClick={() => {}} />}
      style={{
        flexGrow: 1,
        minWidth: 0,
        minHeight: t.control.viewSwitcherHeight,
        borderRadius: t.radius.full,
        backgroundColor: t.color.surface.button,
      }}
    />
  );
}

function WeatherHeader() {
  return (
    <HeaderBar
      left={
        <Button variant="icon" size="icon" icon="refresh" onClick={() => {}} />
      }
      center={
        <ViewSwitcher
          items={WEATHER_VIEWS}
          value="hourly"
          onChange={() => {}}
        />
      }
      right={<HeaderActions icons={["menu"]} />}
    />
  );
}

function EditorHeader() {
  return (
    <HeaderBar
      left={
        <>
          <Button
            variant="icon"
            label="Open"
            trailingIcon="expandMore"
            onClick={() => {}}
          />
          <Button variant="icon" size="icon" icon="add" onClick={() => {}} />
        </>
      }
      center={<PaneTitle title="README.md" caption="~/Downloads" />}
      right={<HeaderActions icons={["search", "menu"]} />}
    />
  );
}

export default defineMeta({
  title: "Adwaita/HeaderBar",
  component: HeaderBar,
  parameters: { width: 900, height: 130 },
});

export const slots = defineStory({
  render: () => (
    <Stack>
      <Labeled caption="Files (Nautilus-2): leading verbs, trailing verbs, no centre">
        <HeaderBar
          left={
            <Button
              variant="icon"
              size="icon"
              icon="search"
              onClick={() => {}}
            />
          }
          right={<HeaderActions icons={["menu"]} />}
        />
      </Labeled>
      <Labeled caption="bare (no slots)">
        <HeaderBar />
      </Labeled>
    </Stack>
  ),
});

export const viewSwitch = defineStory({
  parameters: { width: 900, height: 210 },
  render: () => (
    <Stack>
      <Labeled caption="Weather (Weather-1): Hourly | Daily centred, refresh leading, menu + close trailing">
        <WeatherHeader />
      </Labeled>
      <Labeled caption="Files (Nautilus-2): grid / list view switch in the trailing region">
        <HeaderBar
          left={
            <Button
              variant="icon"
              size="icon"
              icon="chevronLeft"
              onClick={() => {}}
            />
          }
          center={
            <LocationEntry icon="home" label="Home" trailingIcon="moreVert" />
          }
          right={
            <>
              <ViewSwitcher
                items={FILES_VIEWS}
                value="list"
                onChange={() => {}}
              />
              <HeaderActions icons={["expandMore"]} />
            </>
          }
        />
      </Labeled>
    </Stack>
  ),
});

export const centreField = defineStory({
  parameters: { width: 900, height: 290 },
  render: () => (
    <Stack>
      <Labeled caption="Files (Nautilus-2): the location entry, back / forward on its leading edge">
        <HeaderBar
          left={
            <Button
              variant="icon"
              size="icon"
              icon="search"
              onClick={() => {}}
            />
          }
          center={
            <>
              <Button
                variant="icon"
                size="icon"
                icon="chevronLeft"
                onClick={() => {}}
              />
              <Button
                variant="icon"
                size="icon"
                icon="chevronRight"
                onClick={() => {}}
              />
              <LocationEntry icon="home" label="Home" trailingIcon="moreVert" />
            </>
          }
          right={
            <Button
              variant="secondary"
              size="icon"
              icon="close"
              onClick={() => {}}
            />
          }
        />
      </Labeled>
      <Labeled caption="Files search (Nautilus-3): the same entry holds the search string">
        <HeaderBar
          left={
            <Button
              variant="icon"
              size="icon"
              icon="search"
              onClick={() => {}}
            />
          }
          center={<SearchEntry />}
          right={
            <Button
              variant="secondary"
              size="icon"
              icon="close"
              onClick={() => {}}
            />
          }
        />
      </Labeled>
      <Labeled caption="Text Editor (TextEditor-1): the open document, title + path">
        <HeaderBar
          center={<PaneTitle title="README.md" caption="~/Downloads" />}
        />
      </Labeled>
    </Stack>
  ),
});

export const labelledActions = defineStory({
  parameters: { width: 900, height: 130 },
  render: () => (
    <Stack>
      <Labeled caption="Text Editor (TextEditor-1): Open with a caret, one verb to add a document">
        <EditorHeader />
      </Labeled>
      <Labeled caption="Files (Nautilus-2): trailing verbs, view switch then close">
        <HeaderBar
          right={<HeaderActions icons={["gridView", "expandMore"]} />}
        />
      </Labeled>
    </Stack>
  ),
});

export const filesLocation = defineStory({
  render: () => (
    <Labeled caption="the Files window header bar (Nautilus-2)">
      <FilesHeaderBar viewIcon="gridView" />
    </Labeled>
  ),
});

export const weatherViewSwitch = defineStory({
  render: () => (
    <Labeled caption="the Weather window header bar (Weather-1)">
      <WeatherHeader />
    </Labeled>
  ),
});

export const documentTitle = defineStory({
  render: () => (
    <Labeled caption="the Text Editor window header bar (TextEditor-1)">
      <EditorHeader />
    </Labeled>
  ),
});
