<template>
  <div>
    <Loader v-if="loading" menu />
    <div v-else>
      <h2 class="menu__title">Sistema de Convocatorias (SICON)</h2>
      <div class="mt-3">
        <calcite-label
          >Entidad
          <calcite-select ref="entidadSelected">
            <calcite-option label="-- Seleccione --" selected value="0"></calcite-option>
            <calcite-option
              v-for="item in entidadesItems"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></calcite-option>
          </calcite-select>
        </calcite-label>
      </div>
      <div class="mt-3">
        <calcite-label
          >Año
          <calcite-select ref="anioSelected">
            <calcite-option label="-- Seleccione --" select value="0" ></calcite-option>
            <calcite-option
              v-for="item in anioItems"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></calcite-option>
          </calcite-select>
        </calcite-label>
      </div>
      <div class="mt-3">
        <calcite-label
          >Estado
          <calcite-select ref="estadoSelected">
            <calcite-option label="-- Seleccione --" select value="0"></calcite-option>
            <calcite-option
              v-for="item in estadoItems"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></calcite-option>
          </calcite-select>
        </calcite-label>
      </div>
    </div>
    <div class="mt-5">
      <calcite-button
        iconStart="search"
        width="full"
        @click="searchClick()"
        :loading="loading"
        >Buscar</calcite-button
      >
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
import Graphic from "@arcgis/core/Graphic";
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";

import API from "../../data/api";

export default defineComponent({
  name: "ViewSICON",
  components: { Loader },
  setup() {
    let app;
    let localidadGraphics = [];
    let layer;
    let entidadesItems = ref([]);
    let anioItems = ref([]);
    let estadoItems = ref([]);
    let entidadSelected = ref();
    let anioSelected = ref();
    let estadoSelected = ref();
    const loading = ref(false);

    onMounted(async () => {
      app = await import("../../data/map");
      generateQueryLocalidades();
      populateCombo();
      window.addEventListener('calciteSelectChange', (e) => {
        console.log(e.target.selectedOption.value)
      })
    });

    onUnmounted(() => {
      if (layer) {
        app.view.map.remove(layer);
      }
    });

    function populateCombo() {
      var params = new FormData();
      params.append("username", "leonardo.briceno@scrd.gov.co");
      params.append("password", "ET65hG7iP5");
      loading.value = true;
      API({
        method: "post",
        url: "Intercambioinformacion/geo_sicon_propuestas",
        data: params,
      })
        .then(function (response) {
          loading.value = false;
          for (let item of response.data) {
            if (
              entidadesItems.value.filter((row) => row.value === item.nombre_entidad)
                .length === 0
            ) {
              entidadesItems.value.push({
                value: item.nombre_entidad,
                label: item.nombre_entidad,
              });
            }

            if (
              anioItems.value.filter((row) => row.value === item.anio).length === 0
            ) {
              anioItems.value.push({
                value: item.anio,
                label: item.anio.toString(),
              });
            }

            if (
              estadoItems.value.filter((row) => row.value === item.estado_propuesta)
                .length === 0
            ) {
              estadoItems.value.push({
                value: item.estado_propuesta,
                label: item.estado_propuesta,
              });
            }
          }

          entidadesItems.value.push({
            value: "IDARTES",
            label: "IDARTES",
          });

          anioItems.value.push({
            value: 2020,
            label: "2020",
          });
        })
        .catch(function (response) {
          //handle error
          loading.value = false;
          console.log(response);
        });
    }

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
          }
        });
    }

    async function populateFeatureLayer(arr, reangeArr) {
      for (let item of localidadGraphics) {
        const result = arr.filter(
          (row) => row.codLocalidad === item.attributes.codLocalidad
        );
        if (result.length > 0) {
          item.attributes.count = result[0].count;
          console.log(item.attributes.count);
        }
      }

      if (layer) {
        app.view.map.remove(layer);
      }

      const classBreakInfos = [];
      const colors = [
        { index: 0, color: [84, 10, 11, 0.85] },
        { index: 1, color: [99, 68, 38, 0.85] },
        { index: 2, color: [100, 100, 75, 0.85] },
        { index: 3, color: [67, 87, 64, 0.85] },
        { index: 4, color: [17, 51, 73, 0.85] },
      ];
      let index = 0;
      for (const item of reangeArr) {
        const color = colors.filter((item) => item.index === index)[0];
        const symbol = {
          type: "simple-fill",
          color: color.color,
          style: "solid",
          outline: {
            width: 0.2,
            color: [255, 255, 255, 0.5],
          },
        };

        const classBreakInfo = {
          minValue: item.minValue,
          maxValue: item.maxValue,
          symbol: symbol,
          label: item.minValue + " - " + item.maxValue,
        };

        classBreakInfos.push(classBreakInfo);
        index += 1;
      }

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
        classBreakInfos: classBreakInfos,
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
           {
            name: "anio",
            alias: "Año",
            type: "integer",
          },
        ],
        objectIdField: "codLocalidad",
        geometryType: "polygon",
        popupTemplate: {
          // autocasts as new PopupTemplate()
          title: "{nombreLocalidad}",
          content: [
            { type: "text", text: "Cantidad de personas: {count}" },
            {
              type: "media",
              mediaInfos: [
                {
                  title: "<b>Cantidad por Año</b>",
                  type: "pie-chart",
                  caption: "",
                  value: {
                    fields: ["count"],
                    normalizeField: null,
                    tooltipField: "nomLocalidad",
                  },
                },
              ],
            },
          ],
        },
      });

      app.view.map.add(layer);
    }

    function entidadSelectChange() {
      console.log("OKKK");
    }

    function searchClick() {
      var params = new FormData();
      params.append("username", "leonardo.briceno@scrd.gov.co");
      params.append("password", "ET65hG7iP5");
      params.append("entidad", "IDARTES");
      params.append("anio", "2020");
      params.append("estado", "Ganadora");
      if (entidadSelected.value.selectedOption.value != 0) params.append("entidad", entidadSelected.value.selectedOption.value);
      if (anioSelected.value.selectedOption.value != 0) params.append("anio", anioSelected.value.selectedOption.value);
      if (estadoSelected.value.selectedOption.value != 0) params.append("estado", estadoSelected.value.selectedOption.value);
      loading.value = true;
      API({
        method: "post",
        url: "Intercambioinformacion/geo_sicon_propuestas",
        data: params,
      })
        .then(function (response) {
          loading.value = false;
          let arr = [];
          let maxValue = 0;
          let minValue = 10000;
          for (let item of response.data) {
            const result = arr.filter(
              (row) =>
                row.codLocalidad === item.localidad_ejecucion_cod &&
                row.anio === item.anio
            );
            if (result.length > 0) {
              result[0].count += 1;
              if (result[0].count > maxValue) {
                maxValue = result[0].count;
              }
              if (result[0].count < minValue) {
                minValue = result[0].count;
              }
            } else {
              arr.push({
                codLocalidad: item.localidad_ejecucion_cod,
                anio: item.anio,
                count: 1,
              });
            }
          }

          const reangeArr = [];
          const incr = Math.ceil((maxValue - minValue) / 4);
          for (let index = minValue; index <= maxValue; index += incr) {
            if (index + incr < maxValue) {
              reangeArr.push({ minValue: index, maxValue: index + incr - 1 });
            } else {
              reangeArr.push({ minValue: index, maxValue: maxValue });
            }
          }

          populateFeatureLayer(arr, reangeArr);
        })
        .catch(function (response) {
          //handle error
          loading.value = false;
          console.log(response);
        });
    }

    return {
      searchClick,
      entidadSelectChange,
      localidadGraphics,
      loading,
      entidadesItems,
      entidadSelected,
      anioItems,
      anioSelected,
      estadoItems,
      estadoSelected,
    };
  },
});
</script>
