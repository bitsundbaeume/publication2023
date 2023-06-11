import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import MenuItem from "@components/header/menu-nav/MenuItem.vue";

describe("MenuItem", () => {
  const menuItemsWithChilds = {
    label: "B&B Publication 2023",
    path: "/",
    childItems: [
      {
        label: "Overview",
        path: "#overview",
      },
      {
        label: "Browse",
        path: "#flipbook",
      },
      {
        label: "Table of Contents",
        path: "#toc",
      },
    ],
  };

  const wrapper = mount(MenuItem, {
    props: {
      menuItem: {
        label: "Home",
        path: "/",
      },
      depth: 0,
      index: 1,
    },
  });

  const wrapperChilds = mount(MenuItem, {
    props: {
      menuItem: menuItemsWithChilds,
      depth: 0,
      index: 1,
    },
  });

  test("Is component visible?", async () => {
    const menuItem = wrapper.find(".c-menu__item");

    expect(menuItem.exists()).toBe(true);
  });

  test("Emits a menuItemTargetClicked event", async () => {
    const button = wrapper.find(".c-menu__link");

    await button.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("menuItemTargetClicked");
  });

  test("Emits a submenuSate event, open the submenu, check if submenu elements are there", async () => {
    const menuItem = wrapperChilds.find(".c-menu__item");
    const button = menuItem.find(".c-menu__link.is-menu-title");

    await button.trigger("click");

    expect(wrapperChilds.emitted()).toHaveProperty("submenuState");
    expect(menuItem.classes()).toContain("has-visible-child");
    expect(menuItem.find(".c-submenu").exists()).toBe(true);
  });

  test("Trigger submenu, click on menu item, close submenu", async () => {
    const wrapper = mount(MenuItem, {
      props: {
        menuItem: menuItemsWithChilds,
        depth: 0,
        index: 1,
      },
    });

    const menuItem = wrapper.find(".c-menu__item");
    const button = menuItem.find(".c-menu__link.is-menu-title");

    // Open submenu
    await button.trigger("click");

    // Click on submenu item and close it
    await button.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("submenuState");
    expect(menuItem.classes()).not.toContain("has-visible-child");
    expect(menuItem.find(".c-submenu").exists()).toBe(false);
  });
});
