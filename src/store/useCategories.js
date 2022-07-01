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
          return cat.name.toLowerCase().includes(keyword.toLowerCase());
        })
      },
      filterByKeyword1(keyword) {
        this.categoriesFiltered = this.AllCategories
        this.categoriesFiltered = this.AllCategories.filter(category => {
          const arr = category.name.toLowerCase().split(' ');
          return arr.some(y => keyword.toLowerCase().includes(y))
        });
      }
    }
})