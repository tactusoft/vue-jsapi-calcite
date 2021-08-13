<template>
  <calcite-shell>
    <slot name="shell-header">
      <header class="header">
        <calcite-icon icon="beaker" scale="m" aria-hidden="true"></calcite-icon>
        <h2 class="heading">ArcGIS Vue and Calcite</h2>
        <button @click="togglePrintHandler" class="button-print">Print</button>
      </header>
    </slot>
    <Print :show="showPrint"/>
    <WebMap />
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
    }
  },
  methods: {
    togglePrintHandler() {
      this.showPrint = !this.showPrint
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
  background-color: transparent;
  border: 1px solid #fff;
  color : #fff;
  font-weight: 700;
  min-width: 8rem;
  padding: 0.25rem 0.75rem;
}

.heading {
  margin: 0.5rem;
}
</style>
