<template>
  <div class="menu__content__category">
    <h2 class="menu__title">Categorías</h2>
    <div class="flex flex--justify-content-space-between mt">
      <Category v-for="index in 3" :key="index" :color="subMenu.currentSubMenu === categories.AllCategories[index-1].name ? 'blue' : 'inverse'" :icon="categories.AllCategories[index-1].icon" :text="categories.AllCategories[index-1].name"
        :menuName="categories.AllCategories[index-1].name" @routingMenu="menuHandler($event)" />
    </div>
    <a style="float: right; padding-right: 20px; color: #1f74a7; text-decoration: underline; margin-top: 25px; cursor: pointer;"
      @click="router.push('/vermas')">Ver más categorías</a>
  </div>
  <div class="menu__content__list">
    <div v-for="index in 3" :key="index">
      <SubMenu v-if="subMenu.currentSubMenu === categories.AllCategories[index-1].name" :subMenu="categories.AllCategories[index-1].subMenus" />
    </div>
  </div>
</template>

<script>
import "@esri/calcite-components/dist/components/calcite-link";
import { defineComponent } from "vue";
import { useRouter } from 'vue-router'
import { useSubMenu } from '@/store/useSubMenu.js';
import {useCategories} from '@/store/useCategories.js';
import Category from "@/components/layouts/modals/menu/Category.vue";
import SubMenu from "@/components/layouts/modals/menu/submenu/SubMenu.vue";

export default defineComponent({
  name: "Home",
  components: { Category, SubMenu },
  emits: ["routingMenu", "routing"],
  setup() {
    const router = useRouter();
    const SICONSubMenu = [
      {
        title: "Búsqueda por Propuestas",
        description: "SICON",
        route: "/sicon",
      },
    ];

    const SISBICMenu1 = [
      {
        title: "Búsqueda por CHIP",
        description: "IDPC",
        route: "/sisbic",
      },
    ];

    const DEEPMenu1 = [
      {
        title: "Búsqueda por Localidad y Distrito",
        description: "DEEP",
        route: "/deep",
      },
      {
        title: "Búsqueda de Bibliotecas por Distritos",
        description: "DEEP",
        route: "/deepbiblio",
      },
    ];

    const BIBLIOMenu1 = [
      {
        title: "Búsqueda por NOMBRE",
        description: "BIBLIO",
        route: "BIBLIO1",
      },
    ];
    const categories = useCategories(); 
    const subMenu = useSubMenu();
    const menuHandler = (menu) => (subMenu.changeSubMenu(menu));

    return {
      subMenu,
      menuHandler,
      SICONSubMenu,
      SISBICMenu1,
      DEEPMenu1,
      BIBLIOMenu1,
      router,
      categories
    };
  },
});
</script>
