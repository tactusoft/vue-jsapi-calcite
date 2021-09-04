<template>
    <header class="header">
        <calcite-icon icon="beaker" scale="m" aria-hidden="true"></calcite-icon>
        <h2 class="heading">ArcGIS Vue and Calcite</h2>
      </header>
</template>

<script>
import { defineComponent } from 'vue'
import '@esri/calcite-components/dist/custom-elements/bundles/icon';

export default defineComponent({
    name: 'Header',
})
</script>
