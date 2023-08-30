import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import MenuNav from "@components/header/menu-nav/MenuNav.vue";

describe("MenuNav", () => {
  const wrapper = mount(MenuNav, {
    props: {
      menuItems: [
        {
          label: "Start Reading",
          path: "/bits-baeume-moving-forward-moving-together",
        },
        {
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
        },
        {
          label: "to B&B Website",
          path: "https://bits-und-baeume.org",
        },
      ],
    },
  });

  test("Is component visible?", async () => {
    const menuNav = wrapper.find(".c-menu");

    expect(menuNav.exists()).toBe(true);
  });

  test("Has 3 menu items?", async () => {
    const menuItems = wrapper.findAll(".c-menu__item");

    expect(menuItems.length).toBe(3);
  });

  test("Has 1 submenu?", async () => {
    const menuItems = wrapper.findAll(".c-menu__item");

    await menuItems[1].find(".c-menu__link").trigger("click");

    const submenu = menuItems[1].find(".c-submenu");

    expect(submenu.exists()).toBe(true);
  });

  test("Has 3 submenu items?", async () => {
    const wrapper = mount(MenuNav, {
      props: {
        menuItems: [
          {
            label: "Start Reading",
            path: "/bits-baeume-moving-forward-moving-together",
          },
          {
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
          },
          {
            label: "to B&B Website",
            path: "https://bits-und-baeume.org",
          },
        ],
      },
    });

    const menuItems = wrapper.findAll(".c-menu__item");

    await menuItems[1].find(".c-menu__link").trigger("click");

    const submenuItems = menuItems[1].findAll(".c-menu__item");

    expect(submenuItems.length).toBe(3);
  });

  test("Emits a menuItemTargetClicked event", async () => {
    const menuItems = wrapper.findAll(".c-menu__item");

    await menuItems[0].find(".c-menu__link").trigger("click");

    expect(wrapper.emitted()).toHaveProperty("menuItemTargetClicked");
  });

  test("Submenu is closed after clicking on a menu item", async () => {
    const menuItems = wrapper.findAll(".c-menu__item");

    await menuItems[1].find(".c-menu__link").trigger("click");
    await menuItems[0].find(".c-menu__link").trigger("click");

    const submenu = menuItems[1].find(".c-submenu");

    expect(submenu.exists()).toBe(false);
  });
});
