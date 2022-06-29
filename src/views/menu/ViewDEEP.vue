<template>
  <div v-if="!dataItems">
    <calcite-button @click="$emit('goHome')" appearance="transparent" class="menu__button menu__button--back"
      color="red">
      <calcite-icon icon="arrow-bold-left" scale="s" aria-hidden="true"></calcite-icon>
    </calcite-button>
    <Loader v-if="loading" menu />
    <h2 class="menu__title">DEEP</h2>
    <h3>Búsqueda por Localidad y Distrito</h3>
    <div class="mt-3">
      <calcite-label>Localidad
        <calcite-select ref="localidadSelected">
          <calcite-option label="Ninguna" value="notselected" :selected="localidad ? false : true"></calcite-option>
          <calcite-option v-for="item in localidadItems" :key="item.value" :value="item.value" :label="item.label"
            :selected="localidad == item.value ? true : false">
          </calcite-option>
        </calcite-select>
      </calcite-label>
    </div>
    <div class="mt-3">
      <calcite-label>Nombre del distrito</calcite-label>
      <calcite-combobox scale="s" placeholder="Seleccione los distritos">
        <calcite-combobox-item v-for="item in distritosCreativosItems" :key="item.value" :value="item.value"
          :selected="distritoSelectedValue.includes(item.value) ? true : false" :text-label="item.label">
        </calcite-combobox-item>
      </calcite-combobox>
    </div>
    <p class="error" v-if="error">{{ error }}</p>
    <div class="mt-5">
      <calcite-button iconStart="search" width="full" @click="searchClick" :loading="loading">Buscar</calcite-button>
    </div>
    <div class="mt-3">
      <calcite-button iconStart="reset" color="inverse" width="full" @click="clearClick" :loading="loading">Limpiar
      </calcite-button>
    </div>
  </div>
  <div v-else>
    <ViewTable :data="dataItems" @goBack="dataItems = null" @clickEvent="itemClick" />
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
    let distritosGraphics = [];
    let graphicsLayer;
    let principalLayer;

    // --- Options for Selects --- //
    const error = ref();
    const dataItems = ref();
    let localidadItems = ref([]);
    let distritosCreativosItems = ref([]);
    const localidadSelected = ref();
    const localidad = ref();
    let localidadGraphicSelected;
    const distritoSelectedValue = ref([])

    const loading = ref(false);

    onMounted(async () => {
      app = await import("../../data/map");

      principalLayer = new FeatureLayer({
        url: process.env.VUE_APP_URL_DISTRITOSCREATIVOS,
        popupTemplate: {
          title: "{nombre}",
          actions: [],
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  label: "Acto Jurídico",
                  fieldName: "reconocido",
                },
                {
                  label: "Área",
                  fieldName: "area_m2",
                },
                {
                  label: "Perímetro",
                  fieldName: "perim_m2",
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
    });

    onMounted(() => {
      document.addEventListener('calciteLookupChange', (e) => {
        distritoSelectedValue.value = e.detail.map(item => item.value);
        console.log(distritoSelectedValue.value)
      });
    });

    onUnmounted(() => {
      app.view.popup.close();
      app.view.map.remove(graphicsLayer);
      app.view.map.remove(principalLayer);
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
          loading.value = false;
        }).then(() => {
          dataItems.value = arr;
        });
    }

    function generateByQueryDistritosCreativos() {
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
      queryParamas.outFields = ["*"];
      queryParamas.returnGeometry = true;
      queryParamas.objectIds = distritoSelectedValue.value;
      queryParamas.outSpatialReference = app.view.spatialReference;

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
            distritosGraphics.push(graphic);
          }
          app.view.goTo(graphicsLayer.graphics);
          loading.value = false;
        }).then(() => {
          dataItems.value = arr;
        });
    }

    function searchClick() {
      distritosGraphics = [];
      graphicsLayer.removeAll();
      if (localidadSelected.value.selectedOption.value == 'notselected' && distritoSelectedValue.value.length === 0) {
        error.value = 'Por favor digita una opción válida'
      } else {
        error.value = ''
        app.view.popup.close();
        loading.value = true;
        if (localidadSelected.value.selectedOption.value && localidadSelected.value.selectedOption.value !== 'notselected') {
          localidad.value = localidadSelected.value.selectedOption.value
          queryByLocalidad();
        } else {
          generateByQueryDistritosCreativos();
        }
      }
    }

    function clearClick() {
      graphicsLayer.removeAll();
      distritoSelectedValue.value = [];
      distritosGraphics.value = [];
    }

    function itemClick(feature) {
      let result = null;
      graphicsLayer.graphics.forEach((graphic) => {
        if (graphic.attributes.OBJECTID === feature.OBJECTID) {
          result = graphic;
        }
      });
      app.view.goTo(result);
    }

    return {
      searchClick,
      clearClick,
      itemClick,
      localidadGraphics,
      loading,
      localidadItems,
      localidadSelected,
      error,
      dataItems,
      distritosCreativosItems,
      localidad,
      distritoSelectedValue
    };
  },
});
</script>
