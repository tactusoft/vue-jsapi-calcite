<template>
  <div class="menu" :class="show ? 'is-active' : ''">
    <!-- Hamburger button -->
    <calcite-button class="menu__button menu__button--toggle" @click="$emit('toggleShowMenu')">
      <calcite-icon icon="hamburger" scale="s" aria-hidden="true"></calcite-icon>
    </calcite-button>

    <!-- Menu header -->
    <div class="menu__header" >
      <calcite-input placeholder="Buscar..." icon="search" v-show="false"></calcite-input>
    </div>

    <!-- Menu content-->
    <div class="menu__content">
      <!-- BACK BUTTON -->
      <calcite-button @click="goBackHandler" appearance="transparent" class="menu__button menu__button--back"
        color="red" v-if="currentView != 'SISBIC1' || currentView != 'DEEP1' || currentView != 'BIBLIO1'">
        <calcite-icon icon="arrow-bold-left" scale="s" aria-hidden="true"></calcite-icon>
      </calcite-button>
      <!-- Home view -->
      <div v-if="currentView === 'home'" class="route-content">
        <Home @routing="routingHandler($event)" />
      </div>
      <!-- Some more views-->
      <div v-if="currentView === 'SICON'" class="route-content">
        <ViewSICON />
      </div>
      <div v-if="currentView === 'SISBIC1'" class="route-content">
        <ViewSISBIC @goHome="goBackHandler" />
      </div>
      <div v-if="currentView === 'DEEP1'" class="route-content">
        <ViewDEEP @goHome="goBackHandler" />
      </div>
      <div v-if="currentView === 'BIBLIO1'" class="route-content">
        <ViewBIBLIO @goHome="goBackHandler" />
      </div>
      <div v-if="currentView === 'verMas'" class="route-content">
        <VerMas @routing="routingHandler($event)" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

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
    const currentView = ref("home");
    const routingHandler = (route) => currentView.value = route;
    const goBackHandler = () => currentView.value = 'home';


    return { currentView, routingHandler, goBackHandler };
  },
});
</script>
