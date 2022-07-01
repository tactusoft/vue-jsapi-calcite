<template>
  <header class="header">
    <div class="flex flex--align-items-center">
      <img src="@/assets/images/logo_scrd.png" width="120"/>
      <h2 class="heading">Secretaría de Cultura, Recreación y Deporte</h2>
    </div>
    <div class="header__menu-button">
      <calcite-button @click="$emit('toggleShowMenu')">
        <calcite-icon
          icon="hamburger"
          appear
          ance="outline"
          scale="s"
          aria-hidden="true"
        ></calcite-icon>
      </calcite-button>
    </div>
  </header>
</template>

<script>
import { defineComponent } from "vue";
import "@esri/calcite-components/dist/components/calcite-icon";

export default defineComponent({
  name: "Header",
});
</script>
