import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { test, expect, describe } from 'vitest'
import MenuItem from '@components/header/menu-nav/MenuItem.vue'

describe('MenuItem', () => {

  test('Is component visible?', () => {
    const wrapper = mount(MenuItem, {
      props: {
        menuItem: {
          label: 'Home',
          path: '/',
        },
        depth: 0,
        index: 1,
      },
    })

    const menuItem = wrapper.find('.c-menu__item')

    expect(menuItem.exists()).toBe(true)
  })

  test('Emits a submenuSate event', async () => {
    const wrapper = mount(MenuItem, {
      props: {
        menuItem: {
          label: 'B&B Publication 2023',
          path: '/',
          childItems: [
            {
              label: 'Overview',
              path: '#overview'
            },
            {
              label: 'Browse',
              path: '#flipbook'
            },
            {
              label: 'Table of Contents',
              path: '#toc'
            }
          ]
        },
        depth: 0,
        index: 1,
      },
    })


    const menuItem = wrapper.find('.c-menu__item')
    const button = menuItem.find('.c-menu__link.is-menu-title')

    button.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('submenuState')
  })
})
