import { defineStore } from 'pinia'
import {categories} from '@/data/menu.js';
export const useCategories = defineStore('categories', {
    state: () => {
        return {
          AllCategories: categories,
        }
    },
})