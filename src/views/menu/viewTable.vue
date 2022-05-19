<template>
    <h1 v-if="data">{{data[0]}}</h1>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'viewTable',
    props: ['data'],
    setup(props) {
        console.log(props.data[0])
    },
})
</script>
