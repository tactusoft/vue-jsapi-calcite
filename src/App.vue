<template>
  <calcite-shell>
    <slot name="shell-header">
      <header class="header">
        <calcite-icon icon="beaker" scale="m" aria-hidden="true"></calcite-icon>
        <h2 class="heading">ArcGIS Vue and Calcite</h2>
        
      </header>
    </slot>
    <div v-if="!loading">
      <button @click="togglePrintHandler" class="button-print esri-widget--button">
        <calcite-icon icon="print" scale="m" aria-hidden="true"></calcite-icon>
      </button>
    </div>
    <Print :show="showPrint"/>
    <WebMap @finishloading="toggleLoadingHandler" />
  </calcite-shell>
</template>

<script>

import WebMap from './components/WebMap.vue';
import Print from './components/Print.vue';
import '@esri/calcite-components/dist/custom-elements/bundles/shell';
import '@esri/calcite-components/dist/custom-elements/bundles/icon';

import { commitAssetPath } from '@arcgis/core/widgets/support/componentsUtils';

commitAssetPath();

export default {
  name: 'App',
  components: {
    WebMap,
    Print
  },
  data: function () {
    return {
      showPrint: false,
      loading: true,
    }
  },
  methods: {
    togglePrintHandler() {
      this.showPrint = !this.showPrint
    },
    toggleLoadingHandler() {
      console.log('hello')
      this.loading = false
    }
  }

}
</script>
<style lang="scss">
@import "~@esri/calcite-colors/dist/colors"; // calcite colors
html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  letter-spacing: 0em;
  font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  font-feature-settings: "liga" 1, "calt" 0;
}

#app{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  color: #fff;
  background: $h-bb-060;
  padding: 0.5rem;
}

.button-print{
  position: absolute;
  bottom: 90px;
  left: 15px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heading {
  margin: 0.5rem;
}
</style>
