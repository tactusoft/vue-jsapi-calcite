<template>
    <!-- eslint-disable --> 
    <calcite-pick-list-item :label="title" :description="description" value="rivers" @click="routingHandler">
        <calcite-action slot="actions-end" :icon="icon"></calcite-action>
    </calcite-pick-list-item>
</template>

<script>
import { defineComponent } from 'vue'
import {useRoutes} from '@/store/useRoutes.js'
import '@esri/calcite-components/dist/components/calcite-action';
import '@esri/calcite-components/dist/components/calcite-pick-list';

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
        },
        icon:{
            type: String,
            default: 'arrow-bold-right'
        },
        route:{
            type: String,
            required: true,
            default: 'home'
        }
    },
    setup (props) {
        const routes = useRoutes();
        const routingHandler = () => routes.changeRoute(props.route)
        return { routingHandler }
    }
})
</script>
