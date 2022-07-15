<template>
  <div v-show="!dataItems">
    <calcite-button @click="$emit('goHome')" appearance="transparent" class="menu__button menu__button--back"
      color="red">
      <calcite-icon icon="arrow-bold-left" scale="s" aria-hidden="true"></calcite-icon>
    </calcite-button>
    <Loader v-if="loading" menu />
    <h2 class="menu__title">DEEP</h2>
    <h3>Búsqueda de Bibliotecas por Distritos</h3>
    <div class="mt-3">
      <calcite-label>Nombre del distrito</calcite-label>
      <calcite-select ref="distritoSelectedValue">
        <calcite-option label="Ninguna" value="notselected"></calcite-option>
        <calcite-option v-for="item in distritosCreativosItems" :key="item.value" :value="item.value"
          :label="item.label">
        </calcite-option>
      </calcite-select>
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
  <div v-show="dataItems">
    <ViewTableBIBLIO :data="dataItems" @goBack="dataItems = null" @clickEvent="itemClick" />
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

import "@esri/calcite-components/dist/components/calcite-input";
import "@esri/calcite-components/dist/components/calcite-select";
import "@esri/calcite-components/dist/components/calcite-switch";
import "@esri/calcite-components/dist/components/calcite-button";
import "@esri/calcite-components/dist/components/calcite-combobox";

import Loader from "@/components/layouts/Loader.vue";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import Graphic from "@arcgis/core/Graphic";
import ViewTableBIBLIO from "./ViewTableBIBLIO.vue";

import * as popupUtils from "@arcgis/core/support/popupUtils";

export default defineComponent({
  name: "ViewDCBiblio",
  components: { Loader, ViewTableBIBLIO },
  setup() {
    let app;
    let distritosGraphics = [];
    let graphicsLayer;
    let principalLayer;
    let paraderosLibrosLayer;
    let biblioPublicasLayer;
    let bibliosEstacionLayer;
    let featuresResults = [];

    // --- Options for Selects --- //
    const error = ref();
    const dataItems = ref();
    let distritosCreativosItems = ref([]);
    const distritoSelectedValue = ref([])
    let distritoGraphicSelected;

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
                {
                  label: "Localidades",
                  fieldName: "localidades",
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

      loadLayersBiblio();
      generateQueryDistritosCreativos();
    });

    onMounted(() => {
      distritoSelectedValue.value.addEventListener("calciteSelectChange", () => {
        zoomToDistrito()
      });
    });

    onUnmounted(() => {
      app.view.popup.close();
      app.view.map.remove(graphicsLayer);
      app.view.map.remove(principalLayer);
    });

    function loadLayersBiblio() {
      paraderosLibrosLayer = new FeatureLayer({
        url: process.env.VUE_APP_URL_PARADEROSLIBROS,
      });
      app.view.map.add(paraderosLibrosLayer);

      biblioPublicasLayer = new FeatureLayer({
        url: process.env.VUE_APP_URL_BIBLIOPUBLICA,
      });
      app.view.map.add(biblioPublicasLayer);

      bibliosEstacionLayer = new FeatureLayer({
        url: process.env.VUE_APP_URL_BIBLIOESTACION,
      });
      app.view.map.add(bibliosEstacionLayer);

      app.view.whenLayerView(paraderosLibrosLayer).then(() => {
        const popupTemplate = createMyPopupTemplate(paraderosLibrosLayer)
        if (popupTemplate) {
          paraderosLibrosLayer.popupTemplate = popupTemplate;
        }
      });

      app.view.whenLayerView(bibliosEstacionLayer).then(() => {
        const popupTemplate = createMyPopupTemplate(bibliosEstacionLayer)
        if (popupTemplate) {
          bibliosEstacionLayer.popupTemplate = popupTemplate;
        }
      });

      app.view.whenLayerView(biblioPublicasLayer).then(() => {
        const popupTemplate = createMyPopupTemplate(biblioPublicasLayer)
        if (popupTemplate) {
          biblioPublicasLayer.popupTemplate = popupTemplate;
        }
      });
    }

    function createMyPopupTemplate(layer) {
      const config = {
        fields: layer.fields.map(field => (
          {
            name: field.name,
            type: field.type,
            alias: field.alias
          }
        )),
        title: layer.title
      };
      return popupUtils.createPopupTemplate(config);
    }

    function generateQueryDistritosCreativos() {
      const queryParamas = new Query({
        outFields: ["*"],
        returnGeometry: true,
        where: "1=1",
        outSpatialReference: app.view.spatialReference,
      });
      query
        .executeQueryJSON(process.env.VUE_APP_URL_DISTRITOSCREATIVOS, queryParamas)
        .then((results) => {
          for (const feature of results.features) {
            const graphic = new Graphic({
              geometry: feature.geometry,
              attributes: feature.attributes
            });
            distritosGraphics.push(graphic);

            distritosCreativosItems.value.push({
              value: feature.attributes.OBJECTID.toString(),
              label: feature.attributes.nombre,
            });
          }
        });
    }

    function generateByQueryDistritosCreativos() {
      const arr = [];

      const queryParamas = new Query();
      queryParamas.outFields = ["*"];
      queryParamas.where = '1=1';
      queryParamas.geometry = distritoGraphicSelected.geometry;
      queryParamas.outSpatialReference = app.view.spatialReference;
      queryParamas.returnGeometry = true;

      Promise.all([
        query
          .executeQueryJSON(
            'https://services2.arcgis.com/EK0CumERYSQlzENC/ArcGIS/rest/services/Bibliotecas/FeatureServer/0',
            queryParamas
          ),
        query
          .executeQueryJSON(
            'https://services2.arcgis.com/EK0CumERYSQlzENC/ArcGIS/rest/services/Bibliotecas/FeatureServer/2',
            queryParamas
          ),
        query
          .executeQueryJSON(
            'https://services2.arcgis.com/EK0CumERYSQlzENC/ArcGIS/rest/services/Bibliotecas/FeatureServer/3',
            queryParamas
          )
      ]).then(([paraderoResult, bilbiotecaResult, estacionResult]) => {
        if (paraderoResult.features.length > 0) {
          paraderoResult.features.forEach(item => {
            const object = {};
            object.OBJECTID = item.attributes.OBJECTID;
            object.nombre = item.attributes.Descrip;
            object.direccion = item.attributes.PPPDirecci;
            object.localidad = item.attributes.PppNomLoc;
            object.tipo = 'Paraderos para libros para parque';
            arr.push(object);
            item.attributes.tipo = 'Paraderos para libros para parque';
            item.layer = paraderosLibrosLayer;
          });
        }
        if (bilbiotecaResult.features.length > 0) {
          bilbiotecaResult.features.forEach(item => {
            const object = {};
            object.OBJECTID = item.attributes.OBJECTID;
            object.nombre = item.attributes.BpuNombre;
            object.direccion = item.attributes.BpuDirecci;
            object.localidad = item.attributes.BpuNomLoc;
            object.tipo = 'Bibliotecas Públicas';
            arr.push(object);
            item.attributes.tipo = 'Bibliotecas Públicas';
            item.layer = biblioPublicasLayer;
          });
        }
        if (estacionResult.features.length > 0) {
          estacionResult.features.forEach(item => {
            const object = {};
            object.OBJECTID = item.attributes.OBJECTID;
            object.nombre = item.attributes.BesNombre;
            object.direccion = item.attributes.BesDirecci;
            object.localidad = item.attributes.BesNomLoc;
            object.tipo = 'Biblioestaciones';
            arr.push(object);
            item.attributes.tipo = 'Biblioestaciones';
            item.layer = bibliosEstacionLayer;
          });
        }

        featuresResults = [...paraderoResult.features, ...bilbiotecaResult.features, ...estacionResult.features];
      }).then(() => {
        dataItems.value = arr;
      }).finally(() => {
        loading.value = false;
      });
    }

    function zoomToDistrito() {
      distritoGraphicSelected = distritosGraphics.find(
        (graphic) =>
          graphic.attributes.OBJECTID.toString() ===
          distritoSelectedValue.value.selectedOption.value
      );
      app.view.goTo(distritoGraphicSelected);
    }

    function searchClick() {
      distritosGraphics = [];
      graphicsLayer.removeAll();
      if (distritoSelectedValue.value.selectedOption.value == 'notselected') {
        error.value = 'Por favor digita una opción válida'
      } else {
        error.value = ''
        app.view.popup.close();
        generateByQueryDistritosCreativos();
      }
    }

    function clearClick() {
      graphicsLayer.removeAll();
      distritoSelectedValue.value = [];
      distritosGraphics.value = [];
    }

    function itemClick(feature) {
      app.view.popup.close();
      const result = featuresResults.filter(item => item.attributes.OBJECTID === feature.OBJECTID && item.attributes.tipo === feature.tipo);
      const graphic = result[0];
      graphic.popupTemplate = createMyPopupTemplate(graphic.layer);
      app.view.popup.open({
        location: graphic.geometry,
        features: [graphic]
      });
      app.view.goTo(graphic);
      console.log(graphic.geometry);
    }

    return {
      searchClick,
      clearClick,
      itemClick,
      loading,
      error,
      dataItems,
      distritosCreativosItems,
      distritoSelectedValue,
      distritosGraphics
    };
  },
});
</script>
