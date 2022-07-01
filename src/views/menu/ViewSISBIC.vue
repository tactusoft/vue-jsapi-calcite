<template>
  <div v-if="!dataMapa">
    <calcite-button @click="$emit('goHome')" appearance="transparent" class="menu__button menu__button--back"
      color="red">
      <calcite-icon icon="arrow-bold-left" scale="s" aria-hidden="true"></calcite-icon>
    </calcite-button>
    <Loader v-if="loading" menu />
    <h2 class="menu__title">IDPC</h2>
    <h3>Búsqueda por CHIP</h3>
    <div class="mt-3">
      <calcite-label>Digite el CHIP *
        <calcite-input placeholder="AAA0032OLXR"></calcite-input>
      </calcite-label>
    </div>
    <p class="error" v-if="error">{{ error }}</p>
    <div class="mt-5">
      <calcite-button iconStart="search" width="full" @click="searchClick()" :loading="loading">Buscar</calcite-button>
    </div>
  </div>
  <div class="" v-else>
    <ViewBuscarPorMapa :data="dataMapa" @otherChip="dataMapa = null" />
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

import "@esri/calcite-components/dist/components/calcite-input";
import "@esri/calcite-components/dist/components/calcite-select";
import "@esri/calcite-components/dist/components/calcite-switch";
import "@esri/calcite-components/dist/components/calcite-button";
import Loader from "@/components/layouts/Loader.vue";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";

import axios from "axios";
import ViewBuscarPorMapa from "./ViewBuscarPorMapa.vue";

export default defineComponent({
  name: "ViewSISBIC",
  components: { Loader, ViewBuscarPorMapa },
  setup() {
    let app;
    let localidadGraphics = [];
    let graphicsLayer;
    let layerBIC;
    let layerBICNOPEMP;
    let clase;

    const loading = ref(false);
    const chip = ref('');
    const error = ref('');
    const dataMapa = ref();


    onMounted(async () => {
      app = await import("../../data/map");
      graphicsLayer = new GraphicsLayer();
      app.view.map.add(graphicsLayer);

      layerBIC = new FeatureLayer({
        url: process.env.VUE_APP_URL_IDPC + '0',
        lastEditInfoEnabled: false,
        popupTemplate: {
          title: "{NOMBRE}",
          actions: [
            {
              id: "action-detail-bic",
              title: "Detalle",
            },
          ],
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "DIRECCION",
                  label: "Dirección BIC",
                },
                {
                  fieldName: "LOCALIDAD",
                  label: "Nombre de la Localidad",
                },
                {
                  fieldName: "UPLNOMBRE",
                  label: "UPL",
                },
                {
                  fieldName: "BARRIO",
                  label: "Barrio",
                },
                {
                  fieldName: "LOTCODIGO",
                  label: "Código de Lote",
                },
              ],
            },
          ],
        },
      });
      app.view.map.add(layerBIC);

      layerBICNOPEMP = new FeatureLayer({
        url: process.env.VUE_APP_URL_IDPC + '1',
        lastEditInfoEnabled: false,
        popupTemplate: {
          title: "{NOMBRE}",
          actions: [
            {
              id: "action-detail-bic-nopemp",
              title: "Detalle",
            },
          ],
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "DIRECCION_",
                  label: "Dirección BIC",
                },
                {
                  fieldName: "LOCALIDAD",
                  label: "Nombre de la Localidad",
                },
                {
                  fieldName: "UPZ",
                  label: "UPZ",
                },
                {
                  fieldName: "SECTOR_CAT",
                  label: "Barrio",
                },
                {
                  fieldName: "CODIGO_LOT",
                  label: "Código de Lote",
                },
              ],
            },
          ],
        },
      });
      app.view.map.add(layerBICNOPEMP);

      layerBICNOPEMP
        .when(() => {
          const query = layerBICNOPEMP.createQuery();
          query.outSpatialReference = app.view.spatialReference;
          return layerBICNOPEMP.queryExtent(query);
        })
        .then((response) => {
          console.log(response.extent);
          app.view.goTo(response.extent);
        });

      const popup = app.view.popup;
      popup.viewModel.on("trigger-action", (event) => {
        if (event.action.id === "action-detail-bic") {
          loading.value = true;
          const attributesBIC = popup.viewModel.selectedFeature.attributes;
          generateQueryLotebyCodigoLote(completeCodigoLot(attributesBIC.LOTCODIGO));
        } else if (event.action.id === "action-detail-bic-nopemp") {
          loading.value = true;
          const attributesBICNOPEPMP = popup.viewModel.selectedFeature.attributes;
          generateQueryLotebyCodigoLote(completeCodigoLot(attributesBICNOPEPMP.CODIGO_LOT));
        }
      });
    });

    function completeCodigoLot(codigoLot) {
      if (codigoLot.length < 12) {
        return codigoLot.substring(0, 6) + '0' + codigoLot.substring(6, codigoLot.length - 2) + '0' + codigoLot.substring(codigoLot.length - 2);
      } else {
        return codigoLot;
      }
    }

    onUnmounted(() => {
      app.view.map.remove(graphicsLayer);
      app.view.map.remove(layerBIC);
      app.view.map.remove(layerBICNOPEMP);
    });

    function generateQueryLotebyCodigoLote(lotcodigo) {
      loading.value = true;
      const queryParamas = new Query({
        outFields: ["PRECHIP"],
        where: "BARMANPRE='" + lotcodigo + "'",
        returnDistinctValues: true,
      });
      query
        .executeQueryJSON(
          process.env.VUE_APP_URL_CODLOTE,
          queryParamas
        )
        .then((results) => {
          if (results.features.length > 0) {
            const feature = results.features[0];
            generateQueryBuscarChip(feature.attributes.PRECHIP);
          } else {
            loading.value = false;
          }
        })
        .catch(function (err) {
          loading.value = false;
          console.log(err);
        });
    }

    function generateQueryBuscarChip(chip) {
      axios({
        method: "get",
        url: process.env.VUE_APP_URL_CHIP + 'buscar_chip/' + chip,
      })
        .then(function (response) {
          if (response.data.length > 0) {
            clase = 'inmueblenopemp';
            let item = response.data[0];
            let urlApi = item.ruta.replace(/\\/g, '');
            if (urlApi.indexOf('inmueblenopemp') < 0) {
              clase = 'inmueble';
              if (urlApi.indexOf('inmuebletotal') < 0) {
                urlApi = urlApi.replace('inmueble', 'inmuebletotal');
              }
            }
            axios({
              method: "get",
              url: process.env.VUE_APP_URL_CHIP + urlApi
            })
              .then(function (responseDetail) {
                if (responseDetail.data.length > 0) {
                  dataMapa.value = responseDetail.data[0]
                  dataMapa.value.clase = clase;
                }
                loading.value = false;
              })
              .catch(function (response) {
                loading.value = false;
                console.log(response);
              });
          } else {
            loading.value = false;
          }
        })
        .catch(function (err) {
          loading.value = false;
          console.log(err);
          error.value = 'Parece que has enviado el chip de manera incorrecta...'
        });
    }

    function searchClick() {
      if (chip.value == '') {
        error.value = 'Parece que has enviado el chip de manera incorrecta...'
      } else {
        error.value = '';
        app.view.popup.close();
        loading.value = true;
        generateQueryBuscarChip(chip.value);
      }
    }

    function clearClick() {

    }

    onMounted(() => {
      document.addEventListener('calciteInputChange', (e) => {
        console.log(e.target.value)
        chip.value = e.target.value
      })
    })

    return {
      searchClick,
      clearClick,
      localidadGraphics,
      loading,
      error,
      dataMapa
    };
  },
});
</script>
