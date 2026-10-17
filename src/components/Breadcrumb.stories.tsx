import { Fragment } from "react";
import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Column } from "./Box";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from "./Breadcrumb";
import type { IconName } from "./icons";

type Crumb = { label: string; icon?: IconName; disabled?: boolean };

function BreadcrumbDemo({
  caption,
  links,
  page,
  ellipsis,
}: {
  caption: string;
  links: Crumb[];
  page: string;
  ellipsis?: boolean;
}) {
  return (
    <Labeled caption={caption}>
      <Breadcrumb>
        <BreadcrumbList>
          {links.map((link) => (
            <Fragment key={link.label}>
              <BreadcrumbItem>
                <BreadcrumbLink icon={link.icon} disabled={link.disabled}>
                  {link.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          ))}
          {ellipsis ? (
            <Fragment>
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          ) : null}
          <BreadcrumbItem>
            <BreadcrumbPage>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Labeled>
  );
}

export default defineMeta({
  title: "Adwaita/Breadcrumb",
  component: Breadcrumb,
  parameters: { width: 528, height: 240 },
});

export const breadcrumb = defineStory({
  render: () => (
    <Column gap={16} padding={16}>
      <BreadcrumbDemo
        caption="3 items (current page bold)"
        links={[{ label: "Home" }, { label: "Projects" }]}
        page="Current"
      />
    </Column>
  ),
});

export const manyItems = defineStory({
  render: () => (
    <Column gap={16} padding={16}>
      <BreadcrumbDemo
        caption="5 items"
        links={[
          { label: "Home" },
          { label: "Projects" },
          { label: "Reports" },
          { label: "Q3" },
        ]}
        page="Summary"
      />
    </Column>
  ),
});

export const withIcons = defineStory({
  render: () => (
    <Column gap={16} padding={16}>
      <BreadcrumbDemo
        caption="links with icons"
        links={[
          { label: "Home", icon: "home" },
          { label: "Documents", icon: "folder" },
          { label: "Report", icon: "fileText" },
        ]}
        page="Q3"
      />
    </Column>
  ),
});

export const longLabels = defineStory({
  render: () => (
    <Column gap={16} padding={16}>
      <BreadcrumbDemo
        caption="collapsed (middle items → ellipsis)"
        links={[{ label: "Home" }]}
        page="Dashboard"
        ellipsis
      />
      <Labeled caption="long label (text ellipsis, 220px)">
        <div style={{ width: 220 }}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    flexShrink: 1,
                    minWidth: 0,
                  }}
                >
                  Configuration Management Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </Labeled>
    </Column>
  ),
});

export const disabled = defineStory({
  render: () => (
    <Column gap={16} padding={16}>
      <BreadcrumbDemo
        caption="disabled link (50% opacity, not clickable)"
        links={[{ label: "Home" }, { label: "Archived", disabled: true }]}
        page="Current"
      />
    </Column>
  ),
});
