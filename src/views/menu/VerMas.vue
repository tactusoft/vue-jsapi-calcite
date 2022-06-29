<template>
    <h2 class="menu__title">Categorías</h2>
    <calcite-accordion scale="l" selection-mode="single">
          <calcite-accordion-item v-for="category in categories" :key="category.id"  :icon="category.icon" :item-title="category.name"
              :item-subtitle="category.description">
                <calcite-pick-list style="padding-top: 20px; padding-bottom: 20px">
                  <ListItem v-for="subMenu in category.subMenus" :key="subMenu.route" :title="subMenu.title" :description="subMenu.description" :route="subMenu.route" @routing="$emit('routing', $event)"/>
                </calcite-pick-list>
          </calcite-accordion-item>
    </calcite-accordion>
</template>
<script>
import { defineComponent } from 'vue'
import ListItem from "@/components/layouts/modals/menu/submenu/ListItem.vue";
import {categories} from '@/data/menu.js';

export default defineComponent({
    name: "VerMas",
    emits: ["routing"],
    components: {ListItem},
    setup() {
        return {categories}
    },
})
</script>
