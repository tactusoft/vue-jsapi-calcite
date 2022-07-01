<template>
  <div class="menu" :class="show ? 'is-active' : ''">
    <!-- Hamburger button -->
    <calcite-button class="menu__button menu__button--toggle" @click="$emit('toggleShowMenu')">
      <calcite-icon icon="hamburger" scale="s" aria-hidden="true"></calcite-icon>
    </calcite-button>

    <!-- Menu header -->
    <div class="menu__header" >
      <calcite-input placeholder="Buscar..." icon="search" ref="searchInput" :disabled="routes.currentRoute != 'home' && routes.currentRoute != 'verMas' && routes.currentRoute != 'verMasSearch'"></calcite-input>
    </div>

    <!-- Menu content-->
    <div class="menu__content">
      <!-- BACK BUTTON -->
      <calcite-button @click="goBackHandler" appearance="transparent" class="menu__button menu__button--back"
        color="red" v-if="routes.currentRoute != 'SISBIC1' || routes.currentRoute != 'DEEP1' || routes.currentRoute != 'BIBLIO1'">
        <calcite-icon icon="arrow-bold-left" scale="s" aria-hidden="true"></calcite-icon>
      </calcite-button>
      <!-- Home view -->
      <div v-if="routes.currentRoute === 'home'" class="route-content">
        <Home @routing="routingHandler($event)" />
      </div>
      <!-- Some more views-->
      <div v-if="routes.currentRoute === 'SICON'" class="route-content">
        <ViewSICON />
      </div>
      <div v-if="routes.currentRoute === 'SISBIC1'" class="route-content">
        <ViewSISBIC @goHome="goBackHandler" />
      </div>
      <div v-if="routes.currentRoute === 'DEEP1'" class="route-content">
        <ViewDEEP @goHome="goBackHandler" />
      </div>
      <div v-if="routes.currentRoute === 'BIBLIO1'" class="route-content">
        <ViewBIBLIO @goHome="goBackHandler" />
      </div>
      <div v-if="routes.currentRoute === 'verMas'" class="route-content">
        <VerMas />
      </div>
      <div v-if="routes.currentRoute === 'verMasSearch'" class="route-content">
        <VerMas :search="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import {useRoutes} from '@/store/useRoutes.js';
import {useCategories} from '@/store/useCategories.js'


import Home from "../../../../views/menu/Home.vue";
import ViewSICON from "../../../../views/menu/ViewSICON.vue";
import ViewSISBIC from "../../../../views/menu/ViewSISBIC.vue";
import ViewDEEP from "../../../../views/menu/ViewDEEP.vue";
import ViewBIBLIO from "../../../../views/menu/ViewBIBLIO.vue";
import VerMas from "../../../../views/menu/VerMas.vue";


import "@esri/calcite-components/dist/custom-elements/bundles/button";
import "@esri/calcite-components/dist/custom-elements/bundles/icon";
import "@esri/calcite-components/dist/custom-elements/bundles/input";
import "@esri/calcite-components/dist/custom-elements/bundles/accordion";
import '@esri/calcite-components/dist/custom-elements/bundles/action';
import '@esri/calcite-components/dist/custom-elements/bundles/pick-list';

export default defineComponent({
  name: "Menu",
  components: { ViewSICON, Home, ViewSISBIC, ViewDEEP, ViewBIBLIO, VerMas },
  emits: ["routing"],
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const searchInput = ref();
    const routes = useRoutes();
    const categories = useCategories();
    const routingHandler = (route) => routes.changeRoute(route)
    const goBackHandler = () => routes.changeRoute('home')


    onMounted( () => {

      searchInput.value.addEventListener( 'calciteInputInput', (e) => {
        if (e.target.value.trim() === '') routes.currentRoute = 'verMas';
        else {
          routes.changeRoute('verMasSearch');
          categories.filterByKeyword(e.target.value)
        } 
      })
    });

    return { routingHandler, goBackHandler, searchInput, routes };
  },
});
</script>
