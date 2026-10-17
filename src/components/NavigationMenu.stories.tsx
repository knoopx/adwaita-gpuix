import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T, Labeled } from "./common";
import { Icon } from "./icons";
import { Row, Column } from "./Box";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuIndicator,
} from "./NavigationMenu";

function NavDemo({
  caption,
  openItem,
  productsContent,
}: {
  caption: string;
  openItem?: string;
  productsContent?: ReactNode;
}) {
  return (
    <Column gap={16} align="start">
      <Labeled caption={caption}>
        <NavigationMenu defaultOpenItem={openItem}>
          <NavigationMenuList>
            <NavigationMenuItem item="products">
              <NavigationMenuTrigger item="products">
                <T>Products</T>
              </NavigationMenuTrigger>
              {productsContent}
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink label="Docs" active />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink label="About" />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Labeled>
    </Column>
  );
}

export default defineMeta({
  title: "Adwaita/NavigationMenu",
  component: NavigationMenu,
  parameters: { width: 528, height: 320 },
});

export const bar = defineStory({
  render: () => <NavDemo caption="bar · links: active + inactive" />,
});

export const openSubmenu = defineStory({
  parameters: { width: 528, height: 340 },
  render: () => (
    <NavDemo
      caption="submenu open · indicator, links: icon, active, disabled"
      openItem="products"
      productsContent={
        <NavigationMenuContent item="products">
          <NavigationMenuLink label="Laptops" icon="layers" />
          <NavigationMenuLink label="Phones" icon="image" active />
          <NavigationMenuLink label="Tablets" icon="table" />
          <NavigationMenuLink label="Accessories" icon="folder" disabled />
        </NavigationMenuContent>
      }
    />
  ),
});

export const withIcons = defineStory({
  parameters: { width: 528, height: 120 },
  render: () => (
    <Column gap={16} align="start">
      <Labeled caption="nav items with leading icons">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem item="home">
              <NavigationMenuTrigger item="home">
                <Icon name="home" size={14} />
                <T>Home</T>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink label="Library" icon="grid" />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink label="Settings" icon="settings" />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink label="Profile" icon="user" active />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Labeled>
    </Column>
  ),
});

export const disabledItems = defineStory({
  render: () => (
    <Column gap={16} align="start">
      <Labeled caption="disabled nav trigger and links">
        <NavigationMenu defaultOpenItem="products">
          <NavigationMenuList>
            <NavigationMenuItem item="products">
              <NavigationMenuTrigger item="products">
                <T>Products</T>
              </NavigationMenuTrigger>
              <NavigationMenuContent item="products">
                <NavigationMenuLink label="Laptops" icon="layers" />
                <NavigationMenuLink label="Phones" icon="image" disabled />
                <NavigationMenuLink label="Tablets" icon="table" />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger item="beta" disabled>
                <T>Beta</T>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink label="About" disabled />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Labeled>
    </Column>
  ),
});

export function popdownIndicator() {
  const t = useAdwaita();
  return (
    <Row gap={16} align="start">
      <Labeled caption="NavigationMenuContent (links: active + inactive)">
        <div
          style={{
            position: "relative",
            width: 240,
            height: 150,
            borderRadius: t.radii.card,
            borderWidth: 1,
            borderColor: t.colors.border,
            backgroundColor: t.colors.view_bg,
            overflow: "hidden",
          }}
        >
          <Row justify="center" style={{ paddingTop: 8 }}>
            <NavigationMenuContent>
              <NavigationMenuLink label="Laptops" />
              <NavigationMenuLink label="Phones" active />
              <NavigationMenuLink label="Tablets" />
            </NavigationMenuContent>
          </Row>
        </div>
      </Labeled>
      <Labeled caption="NavigationMenuIndicator (open underline)">
        <Column gap={4} align="center">
          <T size="body">Products</T>
          <NavigationMenuIndicator />
        </Column>
      </Labeled>
    </Row>
  );
}
