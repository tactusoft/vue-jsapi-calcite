<template>
<calcite-value-list>
    <ListItem title="Rivers" description="Summary lorem ipsum"/>
    <ListItem title="Mountain" description="Summary lorem ipsum"/>
    <ListItem title="Lakes" description="Summary lorem ipsum"/>
    <ListItem title="Plain" description="Summary lorem ipsum"/>
</calcite-value-list>
</template>

<script>
import { defineComponent } from 'vue'
import ListItem from './ListItem.vue';
import '@esri/calcite-components/dist/custom-elements/bundles/value-list';

export default defineComponent({
    name: 'List',
    components: { ListItem }
})
</script>
