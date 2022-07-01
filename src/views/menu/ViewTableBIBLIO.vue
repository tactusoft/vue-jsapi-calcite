<template>
    <calcite-button @click="$emit('goBack')" appearance="transparent" class="menu__button menu__button--back"
        color="red">
        <calcite-icon icon="arrow-bold-left" scale="s" aria-hidden="true"></calcite-icon>
    </calcite-button>
    <div class="mt-5">
        <h2>Resultados</h2>
        <ul class="deepE mt-4" v-if="data?.length > 0">
            <li class="deepE__element" :class="selectedItem === feature.OBJECTID ? 'selected' : ''"
                v-for="feature in data" :key="feature.OBJECTID" @click="clickItem(feature)">
                <div style="flex: 1;">
                    <p>Nombre <span class="semi-bold">{{ feature.LecNombre }}</span></p>
                    <p>Dirección: {{ feature.LecDirecci }}</p>
                    <p>Localidad: {{ feature.LecNomLoc }}</p>
                </div>
                <calcite-icon :icon="selectedItem == feature.OBJECTID ? 'check-square' : 'square'"></calcite-icon>
            </li>
        </ul>
        <div v-else>
            <h3>No se encontraron resultados</h3>
        </div>
    </div>

</template>
<script>

import { defineComponent, ref } from 'vue'
import "@esri/calcite-components/dist/components/calcite-icon";
import "@esri/calcite-components/dist/components/calcite-button";

export default defineComponent({
    name: 'ViewTable',
    props: ['data'],
    setup() {
        const selectedItem = ref();

        function clickItem(feature) {
            selectedItem.value = feature.OBJECTID
            this.$emit('clickEvent', feature);
        }

        return { selectedItem, clickItem };
    },
})
</script>

<style lang="scss">
.deepE {
    padding: 0;
    margin: 0;
    list-style: none;

    &__element {
        padding: 10px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        cursor: pointer;
        border-top: 1px solid #ccc;
        transition: all 0.5s;

        p {
            flex: 1;
        }

        &.selected {
            background-color: #F9B52C;
            border: none;
            font-weight: 700;
        }
    }
}

.semi-bold {
    font-weight: 600;
}
</style>
