import { nextTick } from "vue";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { test, expect, describe, vi, beforeEach, afterEach } from "vitest";
import MainNav from "@components/header/MainNav.vue";
import MenuNav from "@components/header/menu-nav/MenuNav.vue";

describe("MainNav", () => {
  enableAutoUnmount(afterEach);

  const ResizeObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
  }));

  vi.stubGlobal("ResizeObserver", ResizeObserverMock);

  const menuItems = [
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
  ];

  test("Is component visible?", async () => {
    const wrapper = mount(MainNav, {
      props: {
        menuItems,
      },
    });

    const mainNav = wrapper.find(".c-main-nav");

    expect(mainNav.exists()).toBe(true);
  });

  test("Is mobile menu visible? Teleport working? Scrolling disabled?", async () => {
    beforeEach(() => {
      // create teleport target
      const el = document.createElement("div");
      el.id = "mobileNav";
      document.body.appendChild(el);
    });

    afterEach(() => {
      // clean up
      document.body.outerHTML = "";
    });

    const wrapper = mount(MainNav, {
      props: {
        menuItems,
      },
    });

    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));

    const mobileMenu = wrapper.find(".c-main-nav__toggle");

    expect(mobileMenu.exists()).toBe(true);

    await mobileMenu.trigger("click");

    const flyout = wrapper.find(".c-main-nav__flyout");

    expect(flyout.exists()).toBe(true);
    expect(global.document.body.style.overflow).toBe("hidden");
  });

  // TODO: fix this test
  test("Does desktop and mobile menu toggle on resize work?", async () => {
    beforeEach(() => {
      // create teleport target
      const el = document.createElement("div");
      el.id = "mobileNav";
      document.body.appendChild(el);
    });

    afterEach(() => {
      // clean up
      document.body.outerHTML = "";
    });

    const wrapper = mount(MainNav, {
      props: {
        menuItems,
      },
    });

    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));

    const mobileMenu = wrapper.find(".c-main-nav__toggle");
    expect(mobileMenu.exists()).toBe(true);

    await mobileMenu.trigger("click");

    const flyout = wrapper.getComponent(MenuNav);

    expect(flyout.classes()).toContain("is-open");
    expect(global.document.body.style.overflow).toBe("hidden");

    global.innerWidth = 1000;
    global.dispatchEvent(new Event("resize"));
    await nextTick();

    // await mobileMenu.trigger('click')
    console.log(wrapper.html());

    // expect(flyout).toBe(false)
    // expect(global.document.body.style.overflow).toBe('visible')
  });
});
