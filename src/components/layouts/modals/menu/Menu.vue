<template>
  <div class="menu" :class="show ? 'is-active' : ''">
    <!-- Hamburger button -->
    <calcite-button
      class="menu__button menu__button--toggle"
      @click="$emit('toggleShowMenu')"
    >
      <calcite-icon
        icon="hamburger"
        scale="s"
        aria-hidden="true"
      ></calcite-icon>
    </calcite-button>

    <!-- Menu header -->
    <div class="menu__header">
      <calcite-input placeholder="Buscar..." icon="search"></calcite-input>
    </div>

    <!-- Menu content-->
    <div class="menu__content">
      <calcite-button
        @click="goBackHandler"
        appearance="transparent"
        class="menu__button menu__button--back"
        color="red"
      >
        <calcite-icon
          icon="arrow-bold-left"
          scale="s"
          aria-hidden="true"
        ></calcite-icon>
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
        <ViewSISBIC @changeToBuscarMapaView="changeToBuscarMapaView($event)" />
      </div>
      <div v-if="currentView === 'PorMapa'" class="route-content">
        <ViewBuscarPorMapa :data="dataBuscarPorMapa"/>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

import Home from "../../../../views/menu/Home.vue";
import ViewSICON from "../../../../views/menu/ViewSICON.vue";
import ViewSISBIC from "../../../../views/menu/ViewSISBIC.vue";
import ViewBuscarPorMapa from "../../../../views/menu/ViewBuscarPorMapa.vue";


import "@esri/calcite-components/dist/custom-elements/bundles/button";
import "@esri/calcite-components/dist/custom-elements/bundles/icon";
import "@esri/calcite-components/dist/custom-elements/bundles/input";

export default defineComponent({
  name: "Menu",
  components: { ViewSICON, Home, ViewSISBIC, ViewBuscarPorMapa },
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

    const goBackHandler = () => currentView.value = "home";
    const dataBuscarPorMapa = ref();
    const changeToBuscarMapaView = (data) => {
      //Aquí iría igualado a la variable data
      dataBuscarPorMapa.value = {nombre: 'Jesús', apellido: 'Ahumada '}
      console.log(data);
      currentView.value = 'PorMapa';
    }

    return { currentView, routingHandler, goBackHandler, changeToBuscarMapaView, dataBuscarPorMapa };
  },
});
</script>
