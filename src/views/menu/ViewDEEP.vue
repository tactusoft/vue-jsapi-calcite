<template>
  <div>
    <Loader v-if="loading" menu />
    <h2 class="menu__title">DEEP</h2>
    <h3>Búsqueda por Nombre</h3>
    <div class="mt-3">
      <calcite-label>Digite el Nombre *
        <calcite-input></calcite-input>
      </calcite-label>
    </div>
    <div class="mt-3">
      <calcite-label>Localidad
        <calcite-select ref="localidadSelected">
          <calcite-option label="Ninguna" selected value="notselected"></calcite-option>
          <calcite-option v-for="item in localidadItems" :key="item.value" :value="item.value" :label="item.label">
          </calcite-option>
        </calcite-select>
      </calcite-label>
    </div>
    <p class="error" v-if="error">{{error}}</p>
    <div class="mt-5">
      <calcite-button iconStart="search" width="full" @click="searchClick" :loading="loading">Buscar</calcite-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

import "@esri/calcite-components/dist/custom-elements/bundles/input";
import "@esri/calcite-components/dist/custom-elements/bundles/select";
import "@esri/calcite-components/dist/custom-elements/bundles/switch";
import "@esri/calcite-components/dist/custom-elements/bundles/button";
import Loader from "@/components/layouts/Loader.vue";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import Graphic from "@arcgis/core/Graphic";

export default defineComponent({
  name: "ViewDEEP",
  components: { Loader },
  setup(_, {emit}) {
    let app;
    let localidadGraphics = [];
    let graphicsLayer;
    let principalLayer;

    // --- Options for Selects --- //
    const nameValue = ref('');
    const error = ref();
    let localidadItems = ref([]);
    const localidadSelected = ref();
    let localidadGraphicSelected;

    const loading = ref(false);

    onMounted(async () => {
      app = await import("../../data/map");
      graphicsLayer = new GraphicsLayer();
      app.view.map.add(graphicsLayer);

      principalLayer = new FeatureLayer({
        url: "https://services2.arcgis.com/EK0CumERYSQlzENC/arcgis/rest/services/Distritos_Creativos/FeatureServer/0",
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
          console.log(response.extent);
          app.view.goTo(response.extent);
        });

      generateQueryLocalidades();
      localidadSelected.value.addEventListener("calciteSelectChange", () =>
        zoomToLocalidad()
      );
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

    function zoomToLocalidad() {
      localidadGraphicSelected = localidadGraphics.find(
        (graphic) =>
          graphic.attributes.codLocalidad ===
          localidadSelected.value.selectedOption.value
      );
      app.view.goTo(localidadGraphicSelected);
    }

    function queryByLocalidad() {
      let res;
      var queryParamas = principalLayer.createQuery();
      queryParamas.geometry = localidadGraphicSelected.geometry;
      principalLayer.queryFeatures(queryParamas)
        .then((results) => {
          res = [...results.features]
          for (const feature of results.features) {
            app.view.goTo({
              target: feature.geometry,
              tilt: 70
            }, {
              duration: 1000,
              easing: "in-out-expo"
            });
          }
        }).then( () => {
          emit('contentTable', res);
        });
    }

    function searchClick() {
      if(localidadSelected.value.selectedOption.value == 'notselected' && nameValue.value == ''){
        error.value = 'Por favor digita una opción válida'
      }else{
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

    onMounted( () => {
      document.addEventListener('calciteInputChange', (e) => {
        nameValue.value = e.target.value
      })
    })

    return {
      searchClick,
      clearClick,
      localidadGraphics,
      loading,
      nameValue,
      localidadItems,
      localidadSelected,
      error
    };
  },
});
</script>
