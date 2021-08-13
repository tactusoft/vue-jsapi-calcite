<template>
    <div class="print-div" ref="printContainer"></div>
</template>

<script>
export default {
    name: 'Print',
    props: {
        show: Boolean,
        text: String,
    },
    async mounted() {
        const app = await import('../data/map');
        app.initializePrint(this.$el);
    },
    watch:{
        show: function(){
            const printContainer = this.$refs.printContainer
            printContainer.classList.remove('active')
            if(this.show) printContainer.classList.add('active')
        }
    }
};
</script>

<style lang="scss">
.print-div {
    position: absolute;
    right: 0;
    z-index: 999;
    width: 300px;
    height: 450px;
    opacity: 0;
    transition: all 0.4s;
    pointer-events: none;
    transform: translateY(-8px);
    &.active{
        opacity: 1;
        pointer-events: all;
        transform: translateY(8px);
    }
}
</style>