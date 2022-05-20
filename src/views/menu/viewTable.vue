<template>
    <calcite-button
            @click="$emit('goBack')"
            appearance="transparent"
            class="menu__button menu__button--back"
            color="red"
            >
            <calcite-icon
            icon="arrow-bold-left"
            scale="s"
            aria-hidden="true"
            ></calcite-icon>
    </calcite-button>
    <div class="mt-5">
        <h2>Barrios</h2>
        <ul class="deepE mt-4">
            <li class="deepE__element" :class="selectedItem == feature.FID ? 'selected': ''" v-for="feature in data" :key="feature.FID" @click="selectedItem = feature.FID">
                <p>{{feature.Nombre}}</p>
                <calcite-icon :icon="selectedItem == feature.FID ? 'check-square': 'square'"></calcite-icon>
            </li>
        </ul>
    </div>
</template>
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'viewTable',
    props: ['data'],
    setup(props) {
        const selectedItem = ref();
        console.log(props.data);

        return {selectedItem};
    },
})
</script>

<style lang="scss">
    .deepE{
        padding: 0;
        margin: 0;
        list-style: none;
        &__element{
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            border-bottom: 1px solid #ccc;
            transition: all 0.5s;
            p{
                flex: 1;
            }
            &.selected{
                background-color: #F9B52C;
                border: none;
                font-weight: 700;
            }
        }
    }
</style>
