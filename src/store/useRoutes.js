import { defineStore } from 'pinia'

export const useRoutes = defineStore('routes', {
    state: () => {
        return {
          currentRoute: 'home',
        }
    },
    actions: {
      changeRoute(route) {
        this.currentRoute = route
      },
    }
})