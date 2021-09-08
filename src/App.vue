<template>
  <calcite-shell>
    <slot name="shell-header">
      <Header @toggleShowMenu="toggleShowMenuHandler"/>
    </slot>
    <div v-if="!loading">
      <button @click="togglePrintHandler" class="button-print esri-widget--button">
        <calcite-icon icon="print" scale="m" aria-hidden="true"></calcite-icon>
      </button>
      <Menu @toggleShowMenu="toggleShowMenuHandler" :show="showMenu"/>
    </div>
    <div v-else>
      <Loader />
    </div>
    <Print :show="showPrint" @closePrint="togglePrintHandler"/>
    <WebMap @finishloading="toggleLoadingHandler" />
  </calcite-shell>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import './assets/styles/styles.scss';
import { commitAssetPath } from '@arcgis/core/widgets/support/componentsUtils';
import Header from './components/layouts/Header.vue';
import Menu from './components/layouts/modals/Menu.vue';
import Loader from './components/layouts/Loader.vue';
import WebMap from './components/WebMap.vue';
import Print from './components/layouts/modals/Print.vue';
import '@esri/calcite-components/dist/custom-elements/bundles/shell';
import '@esri/calcite-components/dist/custom-elements/bundles/icon';

commitAssetPath();

export default defineComponent({
  name: 'App',
  components: {
    WebMap,
    Print,
    Header,
    Loader,
    Menu
  },
  emits: ['closePrint', 'finishLoading', 'toggleShowMenu'],
  setup () {
    const showPrint = ref(false);
    const loading = ref(true);
    const showMenu = ref(false);

    const togglePrintHandler = () => {
      showPrint.value = !showPrint.value;
    }

    const toggleLoadingHandler = () => {
      loading.value = false;
    }

    const toggleShowMenuHandler = () => {
      showMenu.value = !showMenu.value;
    }

    return { showPrint, loading, togglePrintHandler, toggleLoadingHandler, showMenu, toggleShowMenuHandler}
  }
});
</script>
