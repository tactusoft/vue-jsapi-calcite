<template>
  <calcite-pick-list>
    <ListItem
      v-for="item in subMenu"
      :key="item.routeName"
      :title="item.title"
      :description="item.description"
      :route="item.route"
      @routing="routingHandler($event)"
    />
  </calcite-pick-list>
</template>

<script>
import { defineComponent } from "vue";
import ListItem from "./ListItem.vue";
import "@esri/calcite-components/dist/custom-elements/bundles/pick-list";

export default defineComponent({
  name: "SubMenu",
  components: { ListItem },
  props: { 
    subMenu: {
        type: Array,
        required: true,
    } 
  },
  emits: ["routing"],
  setup(props, { emit }) {
    console.log(props.subMenu)
    const routingHandler = (route) => {
      emit("routing", route);
    };

    return { routingHandler };
  },
});
</script>
