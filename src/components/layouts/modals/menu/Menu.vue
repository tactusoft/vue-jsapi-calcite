<template>
  <div class="menu" :class="show ? 'is-active' : ''">
    <!-- Hamburger button -->
    <calcite-button class="menu__button menu__button--toggle" @click="$emit('toggleShowMenu')">
      <calcite-icon icon="hamburger" scale="s" aria-hidden="true"></calcite-icon>
    </calcite-button>

    <!-- Menu header -->
    <div class="menu__header" >
      <calcite-input placeholder="Buscar..." :disabled="route.path != '/' && route.name != 'verMas'" clearable icon="search" ref="searchInput"></calcite-input>
    </div>

    <!-- Menu content-->
    <div class="menu__content">
      <!-- BACK BUTTON -->
      <calcite-button @click="goBackHandler" appearance="transparent" class="menu__button menu__button--back"
        color="red" v-if="route.path != '/sisbic' || route.path != '/deep' || route.path != '/biblio' || route.path != '/deepbiblio'">
        <calcite-icon icon="arrow-bold-left" scale="s" aria-hidden="true"></calcite-icon>
      </calcite-button>
      <!-- ROUTING VIEW -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'

import "@esri/calcite-components/dist/components/calcite-button";
import "@esri/calcite-components/dist/components/calcite-icon";
import "@esri/calcite-components/dist/components/calcite-input";
import "@esri/calcite-components/dist/components/calcite-accordion";
import '@esri/calcite-components/dist/components/calcite-action';
import '@esri/calcite-components/dist/components/calcite-pick-list';

export default defineComponent({
  name: "Menu",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const goBackHandler = () => router.go(-1);
    const searchInput = ref();
    onMounted( () => {
      searchInput.value.addEventListener( 'calciteInputInput', (e) => {
          if (e.target.value.trim() === '') router.push('/');
          else {
            router.push({path: 'vermas', query: {q: e.target.value}});
          } 
      })
    });
    return {searchInput, goBackHandler, route };
  },
});
</script>
