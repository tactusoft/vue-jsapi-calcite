<template>
  <div
    class="flex flex--column flex--align-items-center"
    @click="$emit('routing', route)"
  >
    <calcite-button round :color="color" disabled>
      <calcite-icon :icon="icon" scale="s" aria-hidden="true"></calcite-icon>
    </calcite-button>
    <calcite-link class="mt">{{ text }}</calcite-link>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import "@esri/calcite-components/dist/custom-elements/bundles/button";
import "@esri/calcite-components/dist/custom-elements/bundles/link";

export default defineComponent({
  name: "Categorías",
  emits: ["routing"],
  props: {
    color: {
      type: String,
      default: "blue",
    },
    icon: {
      type: String,
      default: "analysis",
    },
    text: {
      type: String,
      default: "Default text",
    },
    route: {
      type: String,
    },
  },
});
</script>
