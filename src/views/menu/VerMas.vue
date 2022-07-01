<template>
    <h2 class="menu__title">Categorías</h2>
        <div v-if="categoryList.length > 0">
            <calcite-accordion scale="l" selection-mode="single" style="margin-top: 25px;">
                <calcite-accordion-item v-for="category in categoryList" :key="category.id"  :icon="category.icon" :item-title="category.name"
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
import { defineComponent, ref } from 'vue'
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
    setup(props) {
        const categories = useCategories();
        const categoryList = ref([]);
        if(props.search) categoryList.value = categories.categoriesFiltered;
        else categoryList.value = categories.AllCategories;
        return {categoryList}
    },
})
</script>
