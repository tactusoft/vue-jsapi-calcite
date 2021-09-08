<template>
    <header class="header">
        <div class="flex flex--align-items-center">
            <calcite-icon icon="beaker" scale="m" aria-hidden="true"></calcite-icon>
            <h2 class="heading">ArcGIS Vue and Calcite</h2> 
        </div>
        <div class="header__menu-button">
            <calcite-button  @click="$emit('toggleShowMenu')">
                <calcite-icon icon="hamburger" appear ance="outline" scale="s" aria-hidden="true"></calcite-icon>
            </calcite-button>
        </div>
      </header>
</template>

<script>
import { defineComponent } from 'vue'
import '@esri/calcite-components/dist/custom-elements/bundles/icon';

export default defineComponent({
    name: 'Header',
})
</script>
