<template>
  <div class="menu__content__category">
    <h2 class="menu__title">Categorías</h2>
    <div class="flex flex--justify-content-space-between mt">
      <Category :color="currentMenuName === 'SICON' ? 'blue' : 'inverse'" icon="conference-room" text="SICON"
        menuName="SICON" @routingMenu="menuHandler($event)" />
      <Category :color="currentMenuName === 'SISBIC' ? 'blue' : 'inverse'" icon="analysis" text="IDPC" menuName="SISBIC"
        @routingMenu="menuHandler($event)" />
      <Category :color="currentMenuName === 'DEEP' ? 'blue' : 'inverse'" icon="layer-graphics" text="DEEP"
        menuName="DEEP" @routingMenu="menuHandler($event)" />
    </div>
    <a style="float: right; padding-right: 20px; color: #1f74a7; text-decoration: underline; margin-top: 25px; cursor: pointer;" @click="routes.changeRoute('verMas')">Ver más categorías</a>
  </div>
  <div class="menu__content__list">
    <SubMenu v-if="currentMenuName === 'SICON'" :subMenu="SICONSubMenu" />
    <SubMenu v-if="currentMenuName === 'SISBIC'" :subMenu="SISBICMenu1" />
    <SubMenu v-if="currentMenuName === 'DEEP'" :subMenu="DEEPMenu1" />
  </div>
</template>

<script>
import "@esri/calcite-components/dist/components/calcite-link";
import { defineComponent, ref } from "vue";
import {useRoutes} from '@/store/useRoutes.js';
import Category from "@/components/layouts/modals/menu/Category.vue";
import SubMenu from "@/components/layouts/modals/menu/submenu/SubMenu.vue";

export default defineComponent({
  name: "Home",
  components: { Category, SubMenu },
  emits: ["routingMenu", "routing"],
  setup() {
    const routes = useRoutes();
    const SICONSubMenu = [
      {
        title: "Búsqueda por Propuestas",
        description: "SICON",
        route: "SICON",
      },
    ];

    const SISBICMenu1 = [
      {
        title: "Búsqueda por CHIP",
        description: "IDPC",
        route: "SISBIC1",
      },
    ];

    const DEEPMenu1 = [
      {
        title: "Búsqueda por Localidad y Distrito",
        description: "DEEP",
        route: "DEEP1",
      },
    ];

     const BIBLIOMenu1 = [
      {
        title: "Búsqueda por NOMBRE",
        description: "BIBLIO",
        route: "BIBLIO1",
      },
    ];

    const currentMenuName = ref("SICON");
    const menuHandler = (menu) => (currentMenuName.value = menu);

    return {
      currentMenuName,
      menuHandler,
      SICONSubMenu,
      SISBICMenu1,
      DEEPMenu1,
      BIBLIOMenu1,
      routes
    };
  },
});
</script>
