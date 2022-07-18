import { defineStore } from 'pinia'

export const useSubMenu = defineStore('submenu', {
    state: () => {
        return {
          currentSubMenu: 'SICON',
        }
    },
    actions: {
      changeSubMenu(subMenu) {
        this.currentSubMenu = subMenu
      },
    }
})