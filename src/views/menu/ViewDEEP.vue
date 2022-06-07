<template>
  <div v-if="!dataItems">
    <calcite-button @click="$emit('goHome')" appearance="transparent" class="menu__button menu__button--back"
      color="red">
      <calcite-icon icon="arrow-bold-left" scale="s" aria-hidden="true"></calcite-icon>
    </calcite-button>
    <Loader v-if="loading" menu />
    <h2 class="menu__title">DEEP</h2>
    <h3>Búsqueda por Nombre</h3>
    <div class="mt-3">
      <calcite-label>Localidad
        <calcite-select ref="localidadSelected">
          <calcite-option label="Ninguna" selected value="notselected"></calcite-option>
          <calcite-option v-for="item in localidadItems" :key="item.value" :value="item.value" :label="item.label">
          </calcite-option>
        </calcite-select>
      </calcite-label>
    </div>
    <div class="mt-3">
      <calcite-label>Nombre del distrito</calcite-label>
      <calcite-combobox scale="s" id="comboBoxDistrito" placeholder="Seleccione los distritos">
        <calcite-combobox-item v-for="item in distritosCreativosItems" :key="item.value" :value="item.value"
          :text-label="item.label">
        </calcite-combobox-item>
      </calcite-combobox>
    </div>
    <p class="error" v-if="error">{{ error }}</p>
    <div class="mt-5">
      <calcite-button iconStart="search" width="full" @click="searchClick" :loading="loading">Buscar</calcite-button>
    </div>
  </div>
  <div v-else>
    <ViewTable :data="dataItems" @goBack="dataItems = null" />
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

import "@esri/calcite-components/dist/custom-elements/bundles/input";
import "@esri/calcite-components/dist/custom-elements/bundles/select";
import "@esri/calcite-components/dist/custom-elements/bundles/switch";
import "@esri/calcite-components/dist/custom-elements/bundles/button";
import "@esri/calcite-components/dist/custom-elements/bundles/combobox";

import Loader from "@/components/layouts/Loader.vue";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import Graphic from "@arcgis/core/Graphic";
import ViewTable from "./ViewTable.vue";

export default defineComponent({
  name: "ViewDEEP",
  components: { Loader, ViewTable },
  setup() {
    let app;
    let localidadGraphics = [];
    let graphicsLayer;
    let principalLayer;

    // --- Options for Selects --- //
    const error = ref();
    const dataItems = ref();
    let localidadItems = ref([]);
    let distritosCreativosItems = ref([]);
    const localidadSelected = ref();
    let localidadGraphicSelected;
    const comboBoxDistrito = ref([]);

    const loading = ref(false);

    onMounted(async () => {
      app = await import("../../data/map");

      principalLayer = new FeatureLayer({
        url: process.env.VUE_APP_URL_DISTRITOSCREATIVOS,
        popupTemplate: {
          title: "{NOMBRE}",
          actions: [],
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "Intervención",
                  label: "Intervenci",
                },
                {
                  fieldName: "Nombre",
                  label: "Nombre",
                },
              ],
            },
          ],
        },
      });
      app.view.map.add(principalLayer);

      principalLayer
        .when(() => {
          const query = principalLayer.createQuery();
          query.outSpatialReference = app.view.spatialReference;
          return principalLayer.queryExtent(query);
        })
        .then((response) => {
          app.view.goTo(response.extent);
        });

      graphicsLayer = new GraphicsLayer();
      app.view.map.add(graphicsLayer);

      generateQueryLocalidades();
      generateQueryDistritosCreativos();

      localidadSelected.value.addEventListener("calciteSelectChange", () =>
        zoomToLocalidad()
      );

      var comboBox = document.querySelector("#comboBoxDistrito");
      comboBox.addEventListener('calciteLookupChange', (e) => {
        comboBoxDistrito.value = e.detail
      });
    });

    onUnmounted(() => {
      app.view.popup.close();
      //app.view.map.remove(graphicsLayer);
      //app.view.map.remove(principalLayer);
    });

    function generateQueryLocalidades() {
      const queryParamas = new Query({
        outFields: ["*"],
        returnGeometry: true,
        where: "1=1",
      });
      query
        .executeQueryJSON(process.env.VUE_APP_URL_QUERYLOCALITIES, queryParamas)
        .then((results) => {
          for (const feature of results.features) {
            const graphic = new Graphic({
              geometry: feature.geometry,
              attributes: {
                codLocalidad: feature.attributes.LOCCODIGO,
                nombreLocalidad: feature.attributes.LOCNOMBRE,
                count: 0,
              },
            });
            localidadGraphics.push(graphic);

            localidadItems.value.push({
              value: feature.attributes.LOCCODIGO,
              label: feature.attributes.LOCNOMBRE,
            });
          }
        });
    }

    function generateQueryDistritosCreativos() {
      const queryParamas = new Query({
        outFields: ["*"],
        returnGeometry: false,
        where: "1=1",
      });
      query
        .executeQueryJSON(process.env.VUE_APP_URL_DISTRITOSCREATIVOS, queryParamas)
        .then((results) => {
          for (const feature of results.features) {
            distritosCreativosItems.value.push({
              value: feature.attributes.OBJECTID,
              label: feature.attributes.nombre,
            });
          }
        });
    }

    function zoomToLocalidad() {
      localidadGraphicSelected = localidadGraphics.find(
        (graphic) =>
          graphic.attributes.codLocalidad ===
          localidadSelected.value.selectedOption.value
      );
      app.view.goTo(localidadGraphicSelected);
    }

    function queryByLocalidad() {
      const arr = [];
      const symbol = {
        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        color: [51, 51, 204, 0.9],
        style: "solid",
        outline: {  // autocasts as new SimpleLineSymbol()
          color: "white",
          width: 1
        }
      };
      var queryParamas = principalLayer.createQuery();
      queryParamas.geometry = localidadGraphicSelected.geometry;
      principalLayer.queryFeatures(queryParamas)
        .then((results) => {
          for (const feature of results.features) {
            const graphic = new Graphic({
              geometry: feature.geometry,
              attributes: feature.attributes,
              symbol
            });
            arr.push(graphic.attributes);
            graphicsLayer.add(graphic);
          }
          app.view.goTo(graphicsLayer.graphics);
        }).then(() => {
          dataItems.value = arr;
        });
    }

    function searchClick() {
      graphicsLayer.removeAll();
      if (localidadSelected.value.selectedOption.value == 'notselected' && comboBoxDistrito.value.length === 0) {
        error.value = 'Por favor digita una opción válida'
      } else {
        error.value = ''
        app.view.popup.close();
        //loading.value = true;
        if (localidadSelected.value.selectedOption.value) {
          queryByLocalidad();
        }
      }
    }

    function clearClick() {

    }

    return {
      searchClick,
      clearClick,
      localidadGraphics,
      loading,
      localidadItems,
      localidadSelected,
      error,
      dataItems,
      comboBoxDistrito,
      distritosCreativosItems
    };
  },
});
</script>
