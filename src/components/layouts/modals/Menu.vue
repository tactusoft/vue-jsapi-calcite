<template>
  <div class="menu" :class="show ? 'is-active' : ''">
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
    <div class="menu__header">
      <calcite-input placeholder="Buscar..." icon="search"></calcite-input>
    </div>
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
      <div v-if="currentView === 'home'" class="route-content">
        <div class="menu__content__category">
          <h2 class="menu__title">Categorías</h2>
          <div class="flex flex--justify-content-space-around mt">
            <Category
              icon="beaker"
              text="SICON"
              route="SICON"
              @routing="routingHandler($event)"
            />
            <Category color="inverse" icon="check-shield" text="Bibliotecas" />
            <Category color="blue" icon="analysis" text="Checking zone" />
          </div>
        </div>
        <div class="menu__content__list">
          <List @routing="routingHandler($event)" />
        </div>
      </div>

      <div v-if="currentView === 'SICON'" class="route-content">
        <ViewSICON />
      </div>
      <div v-if="currentView === 'rivers'" class="route-content">
        <ViewExample1 />
      </div>
      <div v-if="currentView === 'mountain'" class="route-content">
        <ViewExample2 />
      </div>
      <div v-if="currentView === 'lakes'" class="route-content">
        <ViewExample1 />
      </div>
      <div v-if="currentView === 'plain'" class="route-content">
        <ViewExample2 />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Category from "./menu/Category.vue";
import List from "./menu/List.vue";

import ViewSICON from "../../../views/menu/ViewSICON.vue";
import ViewExample1 from "../../../views/menu/ViewExample1.vue";
import ViewExample2 from "../../../views/menu/ViewExample2.vue";

import "@esri/calcite-components/dist/custom-elements/bundles/button";
import "@esri/calcite-components/dist/custom-elements/bundles/icon";
import "@esri/calcite-components/dist/custom-elements/bundles/input";

export default defineComponent({
  name: "Menu",
  components: { Category, List, ViewSICON, ViewExample1, ViewExample2 },
  emits: ["routing"],
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const currentView = ref("home");

    const routingHandler = (route) => {
      currentView.value = route;
    };

    const goBackHandler = () => {
      currentView.value = "home";
    };

    return { currentView, routingHandler, goBackHandler };
  },
});
</script>
