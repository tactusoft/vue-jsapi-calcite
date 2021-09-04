<template>
    <div class="menu" :class="showMenu ? 'is-active' : '' ">
      <calcite-button class="menu__button-toggle" @click="showMenuHandler">
        <calcite-icon icon="hamburger" appear ance="outline" scale="s" aria-hidden="true"></calcite-icon>
      </calcite-button>
      <div class="menu__header">
        <calcite-input placeholder="Search for something" icon="search"></calcite-input>
      </div>
      <div class="menu__content">
        <div class="menu__content__category">
          <h2 class="menu__title">Category</h2>
          <div class="flex flex--justify-content-space-around mt">
            <Category color="blue" icon="beaker" text="Danger zone"/>
            <Category color="inverse" icon="check-shield" text="Save zone"/>
            <Category color="blue" icon="analysis" text="Checking zone"/>
          </div>
        </div>
        <div class="menu__content__list">
          <List />
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref} from 'vue'
import Category from './menu/Category.vue';
import List from './menu/List.vue';
import '@esri/calcite-components/dist/custom-elements/bundles/button';
import '@esri/calcite-components/dist/custom-elements/bundles/icon';
import '@esri/calcite-components/dist/custom-elements/bundles/input';


export default defineComponent({
    name: 'Menu',
    components: { Category, List},
    setup (){
        const showMenu = ref(false);

        const showMenuHandler = () => {
            showMenu.value = !showMenu.value;
        };

        return {showMenu, showMenuHandler};
    }
})
</script>
