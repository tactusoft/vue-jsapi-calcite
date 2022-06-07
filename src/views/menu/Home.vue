<template>
  <div class="menu__content__category">
    <h2 class="menu__title">Categorías</h2>
    <div class="flex flex--justify-content-space-around mt">
      <Category :color="currentMenuName === 'SICON' ? 'blue' : 'inverse'" icon="conference-room" text="SICON"
        menuName="SICON" @routingMenu="menuHandler($event)" />
      <Category :color="currentMenuName === 'SISBIC' ? 'blue' : 'inverse'" icon="analysis" text="IDPC" menuName="SISBIC"
        @routingMenu="menuHandler($event)" />
      <Category :color="currentMenuName === 'DEEP' ? 'blue' : 'inverse'" icon="layer-graphics" text="DEEP"
        menuName="DEEP" @routingMenu="menuHandler($event)" />
      <Category :color="currentMenuName === 'DEEP' ? 'blue' : 'inverse'" icon="layer-graphics" text="Bibliotecas"
        menuName="DEEP" @routingMenu="menuHandler($event)" />
    </div>
  </div>
  <div class="menu__content__list">
    <SubMenu @routing="routingHandler($event)" v-if="currentMenuName === 'SICON'" :subMenu="SICONSubMenu" />
    <SubMenu @routing="routingHandler($event)" v-if="currentMenuName === 'SISBIC'" :subMenu="SISBICMenu1" />
    <SubMenu @routing="routingHandler($event)" v-if="currentMenuName === 'DEEP'" :subMenu="DEEPMenu1" />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Category from "@/components/layouts/modals/menu/Category.vue";
import SubMenu from "@/components/layouts/modals/menu/submenu/SubMenu.vue";

export default defineComponent({
  name: "Home",
  components: { Category, SubMenu },
  emits: ["routingMenu", "routing"],
  setup(_, { emit }) {
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
        title: "Búsqueda por NOMBRE",
        description: "DEEP",
        route: "DEEP1",
      },
    ];

    const currentMenuName = ref("SICON");

    const routingHandler = (route) => emit("routing", route);

    const menuHandler = (menu) => (currentMenuName.value = menu);

    return {
      routingHandler,
      currentMenuName,
      menuHandler,
      SICONSubMenu,
      SISBICMenu1,
      DEEPMenu1,
    };
  },
});
</script>
