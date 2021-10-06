<template>
  <div>
    <h2 class="menu__title">Sistema de Convocatorias (SICON)</h2>
    <div class="mt-3">
      <calcite-label
        >Entidad
        <calcite-select></calcite-select>
      </calcite-label>
    </div>
    <div class="mt-3">
      <calcite-label
        >Año
        <calcite-select></calcite-select>
      </calcite-label>
    </div>
    <div class="mt-3">
      <calcite-label
        >Estado
        <calcite-select></calcite-select>
      </calcite-label>
    </div>
    <div class="mt-5">
      <calcite-button iconStart="search" width="full" @click="searchClick()"
        >Buscar</calcite-button
      >
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted } from "vue";

import "@esri/calcite-components/dist/custom-elements/bundles/input";
import "@esri/calcite-components/dist/custom-elements/bundles/select";
import "@esri/calcite-components/dist/custom-elements/bundles/switch";
import "@esri/calcite-components/dist/custom-elements/bundles/button";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";

import API from "../../data/api";

export default defineComponent({
  name: "ViewSICON",

  setup() {
    let app;
    let localidadGraphics = [];
    let layer;

    onMounted(async () => {
      app = await import("../../data/map");
      generateQueryLocalidades();
    });

    onUnmounted(() => {
      if (layer) {
        app.view.map.remove(layer);
      }
    });

    function generateQueryLocalidades() {
      const queryParamas = new Query({
        outFields: ["*"],
        returnGeometry: true,
        where: "1=1",
      });
      query
        .executeQueryJSON(
          "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/Mapa_Referencia/MapServer/48",
          queryParamas
        )
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
          }
        });
    }

    async function populateFeatureLayer(arr) {
      for (let item of localidadGraphics) {
        const result = arr.filter(
          (row) => row.codLocalidad === parseInt(item.attributes.codLocalidad)
        );
        if (result.length > 0) {
          item.attributes.count = result[0].count;
          console.log(item.attributes.count);
        }
      }

      if (layer) {
        app.view.map.remove(layer);
      }

      const less35 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#fffcd4",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };

      const less50 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#b1cdc2",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };

      const more50 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#38627a",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };

      const more75 = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#0d2644",
        style: "solid",
        outline: {
          width: 0.2,
          color: [255, 255, 255, 0.5],
        },
      };

      const renderer = {
        type: "class-breaks", // autocasts as new ClassBreaksRenderer()
        field: "count",
        legendOptions: {
          title: "Cantidad de personas por localidad",
        },
        defaultSymbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: "black",
          style: "backward-diagonal",
          outline: {
            width: 0.5,
            color: [50, 50, 50, 0.6],
          },
        },
        defaultLabel: "Sin información",
        classBreakInfos: [
          {
            minValue: 1,
            maxValue: 25,
            symbol: less35,
            label: "1 - 25",
          },
          {
            minValue: 26,
            maxValue: 49,
            symbol: less50,
            label: "26 - 49",
          },
          {
            minValue: 50,
            maxValue: 74,
            symbol: more50,
            label: "50 - 74",
          },
          {
            minValue: 75,
            maxValue: 1000,
            symbol: more75,
            label: "> 75",
          },
        ],
      };

      layer = new FeatureLayer({
        source: localidadGraphics,
        renderer: renderer,
        fields: [
          {
            name: "codLocalidad",
            alias: "Codigo Localidad",
            type: "string",
          },
          {
            name: "nombreLocalidad",
            alias: "Nombre Localidad",
            type: "string",
          },
          {
            name: "count",
            alias: "Cantidad",
            type: "integer",
          },
        ],
        objectIdField: "codLocalidad",
        geometryType: "polygon",
      });

      app.view.map.add(layer);
    }

    function searchClick() {
      var params = new FormData();
      params.append("username", "leonardo.briceno@scrd.gov.co");
      params.append("password", "ET65hG7iP5");
      params.append("entidad", "IDARTES");
      params.append("anio", "2020");
      params.append("estado", "Ganadora");

      API({
        method: "post",
        url: "http://sis.scrd.gov.co/crud_SCRD_pv/api/Intercambioinformacion/geo_sicon_propuestas",
        data: params,
      })
        .then(function (response) {
          let arr = [];
          for (let item of response.data) {
            const result = arr.filter(
              (row) => row.codLocalidad === item.localidad_ejecucion_cod
            );
            if (result.length > 0) {
              result[0].count += 1;
            } else {
              arr.push({
                codLocalidad: item.localidad_ejecucion_cod,
                count: 1,
              });
            }
          }
          populateFeatureLayer(arr);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });
    }

    return {
      searchClick,
      localidadGraphics,
    };
  },
});
</script>
