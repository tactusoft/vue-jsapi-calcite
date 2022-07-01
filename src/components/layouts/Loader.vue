<template>
    <div class="loader" :class="menu && 'loader--menu'">
        <calcite-loader active></calcite-loader>
      </div>
</template>

<script>
import { defineComponent } from 'vue'
import '@esri/calcite-components/dist/components/calcite-loader';

export default defineComponent({
    name: 'Loader',
    props: {
        menu:{
            type: Boolean
        }
    }
})
</script>
