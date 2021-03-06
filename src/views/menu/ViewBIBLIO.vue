<template>
  <div v-show="!dataItems">
    <Loader v-if="loading" menu />
    <h2 class="menu__title">Bibliotecas</h2>
    <h3>Buscar por Posición Actual</h3>
    <div class="mt-3">
      <p>Al hacer click en el botón, busca lugares de su posición actual.</p>
    </div>
    <div class="mt-3">
      <calcite-label>Kilómetros a la redonda
        <calcite-select ref="kmSelected">
          <calcite-option value="1" label="1"></calcite-option>
          <calcite-option value="5" label="5"></calcite-option>
          <calcite-option value="10" label="10"></calcite-option>
        </calcite-select>
      </calcite-label>
    </div>
    <div class="mt-5">
      <calcite-button iconStart="gps-on" width="full" @click="searchClick()" :loading="loading">Tu posición actual
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
import Loader from "@/components/layouts/Loader.vue";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Locate from "@arcgis/core/widgets/Locate";
import Point from "@arcgis/core/geometry/Point";
import Query from '@arcgis/core/rest/support/Query';

import * as query from '@arcgis/core/rest/query';
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import * as popupUtils from "@arcgis/core/support/popupUtils";

import ViewTableBIBLIO from "./ViewTableBIBLIO.vue";

export default defineComponent({
  name: "ViewBIBLIO",
  components: { Loader, ViewTableBIBLIO },
  setup() {
    const dataItems = ref();

    let app;
    let graphicsLayer;
    let paraderosLibrosLayer;
    //let puntosLecturaLayer;
    let bibliosEstacionLayer;
    //let biblioComunitariaLayer;
    let biblioPublicasLayer;
    let locate;
    let featuresResults = [];

    let kmSelected = ref();

    const loading = ref(false);

    onMounted(async () => {
      app = await import("../../data/map");
      graphicsLayer = new GraphicsLayer();
      app.view.map.add(graphicsLayer);

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

      /* puntosLecturaLayer = new FeatureLayer({
         url: 'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/recreaciondeporte/lectura/MapServer/4',
       });
       app.view.map.add(puntosLecturaLayer);
 
       biblioComunitariaLayer = new FeatureLayer({
         url: 'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/recreaciondeporte/lectura/MapServer/0',
       });
       app.view.map.add(biblioComunitariaLayer);*/

      app.view.whenLayerView(paraderosLibrosLayer).then(() => {
        const popupTemplate = createMyPopupTemplate(paraderosLibrosLayer)
        if (popupTemplate) {
          paraderosLibrosLayer.popupTemplate = popupTemplate;
        }
      });

      /*  app.view.whenLayerView(puntosLecturaLayer).then(() => {
          const popupTemplate = createMyPopupTemplate(puntosLecturaLayer)
          if (popupTemplate) {
            puntosLecturaLayer.popupTemplate = popupTemplate;
          }
        });*/

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

      /* app.view.whenLayerView(biblioComunitariaLayer).then(() => {
          const popupTemplate = createMyPopupTemplate(biblioComunitariaLayer)
          if (popupTemplate) {
            biblioComunitariaLayer.popupTemplate = popupTemplate;
          }
        });*/

      locate = new Locate({
        view: app.view,
        useHeadingEnabled: false,
        goToOverride: function (view, options) {
          options.target.scale = 1500; // Override the default map scale
          return app.view.goTo(options.target);
        }
      });
    });

    onUnmounted(() => {
      app.view.map.remove(graphicsLayer);
      app.view.map.remove(paraderosLibrosLayer);
      //app.view.map.remove(puntosLecturaLayer);
      app.view.map.remove(bibliosEstacionLayer);
      app.view.map.remove(biblioPublicasLayer);
      //app.view.map.remove(biblioComunitariaLayer);
      clearGraphics();
    });

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

    function searchClick() {
      clearGraphics();
      app.view.popup.close();
      loading.value = true;
      locate.locate().then(function (location) {
        const point = webMercatorUtils.geographicToWebMercator(new Point(location.coords.longitude, location.coords.latitude));
        bufferPoint(point);
      }).catch((e) => {
        loading.value = false;
        console.log(e);
      });
    }

    function clearClick() {
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

    function bufferPoint(point) {
      const polySym = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [140, 140, 222, 0.3],
        outline: {
          color: [0, 0, 0, 0.5],
          width: 2
        }
      };

      point.hasZ = false;
      point.z = undefined;

      const km = kmSelected.value.selectedOption.value;
      const buffer = geometryEngine.geodesicBuffer(point, km, "kilometers");
      graphicsLayer.add(
        new Graphic({
          geometry: buffer,
          symbol: polySym
        })
      );

      intersectsLayers(buffer);
    }

    function intersectsLayers(buffer) {
      const arr = [];

      const queryParamas = new Query();
      queryParamas.outFields = ["*"];
      queryParamas.where = '1=1';
      queryParamas.geometry = buffer;
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

    function clearGraphics() {
      app.view.graphics.removeAll();
      graphicsLayer.removeAll();
      app.view.popup.close();
    }

    return {
      loading,
      dataItems,
      searchClick,
      clearClick,
      itemClick,
      kmSelected
    };
  },
});
</script>
