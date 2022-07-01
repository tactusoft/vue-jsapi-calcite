<template>
  <calcite-shell>
    <slot name="shell-header">
      <Header @toggleShowMenu="toggleShowMenuHandler" />
    </slot>
    <div v-if="!loading">
      <button @click="togglePrintHandler" class="button-print esri-widget--button" style="display: none">
        <calcite-icon icon="print" scale="m" aria-hidden="true"></calcite-icon>
      </button>
      <Menu @toggleShowMenu="toggleShowMenuHandler" :show="showMenu" />
    </div>
    <div v-else>
      <Loader />
    </div>
    <Print :show="showPrint" @closePrint="togglePrintHandler" />
    <WebMap @finishloading="toggleLoadingHandler" />
  </calcite-shell>
</template>

<script>
import { defineComponent, ref } from "vue";
import "./assets/styles/styles.scss";
import Header from "./components/layouts/Header.vue";
import Menu from "./components/layouts/modals/menu/Menu.vue";
import Loader from "./components/layouts/Loader.vue";
import WebMap from "./components/WebMap.vue";
import Print from "./components/layouts/modals/Print.vue";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-icon";

import {
  applyPolyfills,
  defineCustomElements
} from '@esri/calcite-components/dist/loader';

applyPolyfills().then(() => {
  defineCustomElements(window);
});

export default defineComponent({
  name: "App",
  components: {
    WebMap,
    Print,
    Header,
    Loader,
    Menu,
  },
  emits: ["closePrint", "finishLoading", "toggleShowMenu"],
  setup() {
    const showPrint = ref(false);
    const loading = ref(true);
    const showMenu = ref(false);

    const togglePrintHandler = () => {
      showPrint.value = !showPrint.value;
    };

    const toggleLoadingHandler = () => {
      loading.value = false;
    };

    const toggleShowMenuHandler = () => {
      showMenu.value = !showMenu.value;
    };

    return {
      showPrint,
      loading,
      togglePrintHandler,
      toggleLoadingHandler,
      showMenu,
      toggleShowMenuHandler,
    };
  },
});
</script>
<style>
:root {
  --calcite-ui-brand: #f9b52c;
  --calcite-ui-brand-hover: #f9b52c;
  --calcite-ui-brand-press: #f9b52c;
}
</style>
<style src="@esri/calcite-components/dist/calcite/calcite.css"></style>