<template>
    <!-- eslint-disable --> 
    <calcite-value-list-item :label="title" :description="description" value="rivers">
        <calcite-action slot="actions-end" icon="plus"></calcite-action>
    </calcite-value-list-item>
</template>

<script>
import { defineComponent } from 'vue'
import '@esri/calcite-components/dist/custom-elements/bundles/action';
import '@esri/calcite-components/dist/custom-elements/bundles/value-list';

export default defineComponent({
    name: 'ListItem',
    props: {
        title:{
        type: String,
        default: 'Default title'
        },
        description:{
        type: String,
        default: 'Default description'
        }  
    }
})
</script>
