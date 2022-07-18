<template>
    <h2 class="menu__title">Categorías</h2>
        <div v-if="filteredCategories.length > 0">
            <calcite-accordion scale="l" selection-mode="single" style="margin-top: 25px;">
                <calcite-accordion-item v-for="category in filteredCategories" :key="category.id"  :icon="category.icon" :item-title="category.name"
                    :item-subtitle="category.description">
                        <calcite-pick-list style="padding-top: 20px; padding-bottom: 20px">
                        <ListItem v-for="subMenu in category.subMenus" :key="subMenu.route" :title="subMenu.title" :description="subMenu.description" :route="subMenu.route"/>
                        </calcite-pick-list>
                </calcite-accordion-item>
            </calcite-accordion>
        </div>
        <div v-else>
            <p>Woops... parece que no hay coincidencias</p>
        </div>
</template>
<script>
import { defineComponent, watch, ref } from 'vue'
import {useRoute} from 'vue-router';
import ListItem from "@/components/layouts/modals/menu/submenu/ListItem.vue";
import {useCategories} from '@/store/useCategories.js';

export default defineComponent({
    name: "VerMas",
    components: {ListItem},
    props: {
        search:{
            required: false,
            type: Boolean,
            default: false,
        }
    },
    setup() {
        const categories = useCategories();
        const route = useRoute();
        const filteredCategories = ref(categories.AllCategories);
        watch(() => route.query.q, () => {
            if(route.query.q){
                filteredCategories.value = categories.AllCategories.filter(category => {
                    return category.name.toLowerCase().includes(route.query.q.toLowerCase());
                })
            } else {
                filteredCategories.value = categories.AllCategories;
            }
            
        });
        return {filteredCategories}
    },
})
</script>
