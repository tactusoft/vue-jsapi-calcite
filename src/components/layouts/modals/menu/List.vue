<template>
<calcite-pick-list>
    <ListItem title="Rivers" description="Summary lorem ipsum" route="rivers" @routing="routingHandler($event)"/>
    <ListItem title="Mountain" description="Summary lorem ipsum" route="mountain" @routing="routingHandler($event)"/>
    <ListItem title="Lakes" description="Summary lorem ipsum" route="lakes" @routing="routingHandler($event)"/>
    <ListItem title="Plain" description="Summary lorem ipsum" route="plain" @routing="routingHandler($event)"/>
</calcite-pick-list>
</template>

<script>
import { defineComponent } from 'vue'
import ListItem from './ListItem.vue';
import '@esri/calcite-components/dist/custom-elements/bundles/pick-list';

export default defineComponent({
    name: 'List',
    components: { ListItem },
    emits: ['routing'],
    setup (_, {emit}) {
        const routingHandler = (route) => {
            emit('routing', route);
        }

        return { routingHandler }
    }
})
</script>
