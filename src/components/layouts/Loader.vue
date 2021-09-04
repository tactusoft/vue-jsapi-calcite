<template>
    <div class="loader">
        <calcite-loader active></calcite-loader>
      </div>
</template>

<script>
import { defineComponent } from 'vue'
import '@esri/calcite-components/dist/custom-elements/bundles/loader';

export default defineComponent({
    name: 'Loader'
})
</script>
