import { defineStore } from 'pinia'
import {categories} from '@/data/menu.js';
export const useCategories = defineStore('categories', {
    state: () => {
        return {
          AllCategories: categories,
          categoriesFiltered: categories,
        }
    },
    actions: {
      filterByKeyword (keyword) {
        this.categoriesFiltered = this.AllCategories
        this.categoriesFiltered = this.AllCategories.filter((cat) => {
          return cat.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        })
      }
    }
})