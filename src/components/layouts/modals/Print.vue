<template>
  <div class="print-div printDrag" ref="printContainer" style="display: none">
    <calcite-button
      appearance="transparent"
      iconStart="x"
      class="print-div__close"
      @click="$emit('closePrint')"
    ></calcite-button>
  </div>
</template>

<script>
import interact from "interactjs";
import "@esri/calcite-components/dist/components/calcite-button";

export default {
  name: "Print",
  props: {
    show: Boolean,
    text: String,
  },
  async mounted() {
    //const app = await import('../../../data/map');
    //await app.initializePrint(this.$el);
    this.initializeDraggable();
  },
  methods: {
    initializeDraggable() {
      const printDrag = document.querySelector(".printDrag");
      var x = 0;
      var y = 0;

      interact(printDrag)
        .draggable({
          modifiers: [
            interact.modifiers.snap({
              targets: [interact.snappers.grid({ x: 30, y: 30 })],
              range: Infinity,
              relativePoints: [{ x: 0, y: 0 }],
            }),
            interact.modifiers.restrict({
              restriction: printDrag.parentNode,
              elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
              endOnly: true,
            }),
          ],
          inertia: true,
        })
        .on("dragmove", function (event) {
          x += event.dx;
          y += event.dy;

          event.target.style.transform = "translate(" + x + "px, " + y + "px)";
        });
    },
  },
  watch: {
    show: function () {
      const printContainer = this.$refs.printContainer;
      printContainer.classList.remove("active");
      if (this.show) printContainer.classList.add("active");
    },
  },
};
</script>

<style lang="scss">
.print-div {
  position: absolute;
  left: 0;
  top: 20%;
  z-index: 1000;
  width: 300px;
  height: 450px;
  opacity: 0;
  transition: all 0.4s;
  pointer-events: none;
  transform: translateX(-8px);
  &.active {
    opacity: 1;
    pointer-events: all;
    transform: translateX(8px);
  }
  &__close {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>