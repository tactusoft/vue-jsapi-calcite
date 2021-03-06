<template>
  <div>
    <Loader v-if="loading" menu />
    <h2 class="menu__title">Sistema de Convocatorias (SICON)</h2>
    <h3 >Búsqueda por Propuestas</h3>
    <div class="mt-3">
      <calcite-label
        >Año *
        <calcite-select ref="anioSelected">
          <calcite-option
            label="-- Seleccione --"
            selected
            disabled
          ></calcite-option>
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
        >Entidad *
        <calcite-select ref="entidadSelected">
          <calcite-option label="Ninguna" selected></calcite-option>
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
        >Estado de la propuesta *
        <calcite-select ref="estadoSelected">
          <calcite-option label="Ninguna" selected></calcite-option>
          <calcite-option
            v-for="item in estadoItems"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></calcite-option>
        </calcite-select>
      </calcite-label>
    </div>
    <div class="mt-3">
      <calcite-label
        >Localidad
        <calcite-select ref="localidadSelected">
          <calcite-option label="Ninguna" selected></calcite-option>
          <calcite-option
            v-for="item in localidadItems"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></calcite-option>
        </calcite-select>
      </calcite-label>
    </div>
    <!-- <div class="mt-3">
      <calcite-label
        >UPZ
        <calcite-select ref="upzSelected">
          <calcite-option label="Ninguna" selected></calcite-option>
          <calcite-option
            v-for="item in upzItems"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></calcite-option>
        </calcite-select>
      </calcite-label>
    </div>
    <div class="mt-3">
      <calcite-label
        >Barrio
        <calcite-select ref="barrioSelected">
          <calcite-option label="Ninguna" selected></calcite-option>
          <calcite-option value="Item 1" label="Item 1"></calcite-option>
          <calcite-option value="Item 2" label="Item 2"></calcite-option>
        </calcite-select>
      </calcite-label>
    </div>-->
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

import "@esri/calcite-components/dist/components/calcite-input";
import "@esri/calcite-components/dist/components/calcite-select";
import "@esri/calcite-components/dist/components/calcite-switch";
import "@esri/calcite-components/dist/components/calcite-button";
import Loader from "@/components/layouts/Loader.vue";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import PopupTemplate from "@arcgis/core/PopupTemplate";

import Chart from "chart.js/auto";

import API from "../../data/api";
import axios from "axios";
import useColors from "@/utils/useColors";

export default defineComponent({
  name: "ViewSICON",
  components: { Loader },
  setup() {
    let app;
    let localidadGraphics = [];
    let upzGraphics = [];
    let mode;
    let arrCharts = [];
    let chartTitle;
    let layer;

    // --- Options for Selects --- //
    let entidadesItems = ref([]);
    let anioItems = ref([]);
    let estadoItems = ref([]);
    let localidadItems = ref([]);
    let upzItems = ref([]);

    let entidadSelected = ref();
    let anioSelected = ref();
    let estadoSelected = ref();
    let localidadSelected = ref();
    let upzSelected = ref();

    let zupActive = ref(true);
    let barrioActive = ref(true);

    const loading = ref(false);
    const chartData = {
      type: "doughnut",
      data: {},
    };
    const color = useColors();

    onMounted(async () => {
      app = await import("../../data/map");
      generateQueryLocalidades();
      populateCombo();
      localidadSelected.value.addEventListener("calciteSelectChange", () =>
        generateQueryUPZ()
      );
      /* upzSelected.value.addEventListener(
        "calciteSelectChange",
        () => (barrioActive.value = false)
      );*/
    });

    onUnmounted(() => {
      if (layer) {
        app.view.map.remove(layer);
      }
    });

    function setYearsUntilCurrent() {
      const from = 2020;
      const currentYear = new Date().getFullYear();
      for (let year = from; year <= currentYear; year++) {
        anioItems.value.push({
          value: year.toString(),
          label: year.toString(),
        });
      }
    }

    async function setEstado() {
      try {
        const { data: estados } = await API.getParam("38");
        estados.map((estado) => {
          estadoItems.value.push({
            value: estado.detalle,
            label: estado.detalle,
          });
        });
      } catch (e) {
        console.log(e);
      }
    }

    async function setEntidad() {
      try {
        const { data: entidades } = await API.getParam("9");
        entidades.map((entidad) => {
          entidadesItems.value.push({
            value: entidad.detalle,
            label: entidad.detalle,
          });
        });
      } catch (e) {
        console.log(e);
      }
    }

    async function populateCombo() {
      loading.value = true;
      setYearsUntilCurrent();
      await setEstado();
      await setEntidad();
      loading.value = false;
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

            localidadItems.value.push({
              value: feature.attributes.LOCCODIGO,
              label: feature.attributes.LOCNOMBRE,
            });
          }
        });
    }

    function generateQueryUPZ() {
      upzItems = ref([]);
      upzGraphics = [];

      const localidadGraphicSelected = localidadGraphics.find(
        (graphic) =>
          graphic.attributes.codLocalidad ===
          localidadSelected.value.selectedOption.value
      );

      app.view.goTo(localidadGraphicSelected);

      const queryParamas = new Query({
        outFields: ["*"],
        returnGeometry: true,
        geometry: localidadGraphicSelected.geometry,
      });
      query
        .executeQueryJSON(process.env.VUE_APP_URL_QUERY_UPZ, queryParamas)
        .then((results) => {
          for (const feature of results.features) {
            const graphic = new Graphic({
              geometry: feature.geometry,
              attributes: {
                codUPZ: feature.attributes.CODIGO_UPZ,
                nombreUPZ: feature.attributes.NOMBRE,
                count: 0,
              },
            });
            upzGraphics.push(graphic);

            upzItems.value.push({
              value: feature.attributes.CODIGO_UPZ,
              label: feature.attributes.NOMBRE,
            });
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
          //console.log(item.attributes.count);
        }
      }

      if (layer) {
        app.view.map.remove(layer);
      }

      const classBreakInfos = [];
      const colors = [
        { index: 0, color: [172, 146, 235, 0.85] },
        { index: 1, color: [79, 193, 232, 0.85] },
        { index: 2, color: [160, 213, 104, 0.85] },
        { index: 3, color: [255, 195, 84, 0.85] },
        { index: 4, color: [237, 85, 100, 0.85] },
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
          title: "Cantidad de propuestas por localidad",
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

      let template = new PopupTemplate({
        title: "Localidad: {nombreLocalidad} - Número de Personas: {count}",
        content: setContentInfo,
      });

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
        popupTemplate: template,
      });

      app.view.map.add(layer);
    }

    async function populateFeatureLayerUPZ(arr, reangeArr) {
      for (let item of upzGraphics) {
        const result = arr.filter(
          (row) => row.codUPZ === item.attributes.codUPZ
        );
        if (result.length > 0) {
          item.attributes.count = result[0].count;
          //console.log(item.attributes.count);
        }
      }

      if (layer) {
        app.view.map.remove(layer);
      }

      const classBreakInfos = [];
      const colors = [
        { index: 0, color: [172, 146, 235, 0.85] },
        { index: 1, color: [79, 193, 232, 0.85] },
        { index: 2, color: [160, 213, 104, 0.85] },
        { index: 3, color: [255, 195, 84, 0.85] },
        { index: 4, color: [237, 85, 100, 0.85] },
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
          title: "Cantidad de propuestas por UPZ",
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

      let template = new PopupTemplate({
        title: "UPZ: {nombreUPZ} - Número de Personas: {count}",
        content: setContentInfo,
      });

      layer = new FeatureLayer({
        source: upzGraphics,
        renderer: renderer,
        fields: [
          {
            name: "codUPZ",
            alias: "Código UPZ",
            type: "string",
          },
          {
            name: "nombreUPZ",
            alias: "Nombre UPZ",
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
        objectIdField: "codUPZ",
        geometryType: "polygon",
        popupTemplate: template,
      });

      app.view.map.add(layer);
    }

    function setContentInfo(feature) {
      let node = document.createElement("div");
      let canvas = document.createElement("canvas");
      node.appendChild(canvas);
      setupDatasetCharts(feature);
      new Chart(canvas, { ...chartData });
      return node;
    }

    function searchClick() {
      app.view.popup.close();

      arrCharts = [];
      const params = new FormData();
      params.append("username", "leonardo.briceno@scrd.gov.co");
      params.append("password", "ET65hG7iP5");

      if (entidadSelected.value.selectedOption.value) {
        params.append("entidad", entidadSelected.value.selectedOption.value);
      }

      if (anioSelected.value.selectedOption.value) {
        params.append("anio", anioSelected.value.selectedOption.value);
      }

      if (estadoSelected.value.selectedOption.value) {
        const capital =
          estadoSelected.value.selectedOption.value.charAt(0).toUpperCase() +
          estadoSelected.value.selectedOption.value.slice(1);
        params.append("estado", capital);
      }

      if (localidadSelected.value.selectedOption.value) {
        params.append(
          "localidad_ejecucion_cod",
          localidadSelected.value.selectedOption.value
        );
      }

      if (
        entidadSelected.value.selectedOption.value &&
        anioSelected.value.selectedOption.value &&
        estadoSelected.value.selectedOption.value
      ) {
        mode = "convocatoria";
        chartTitle = "Por Convocatoria";
      } else if (!entidadSelected.value.selectedOption.value) {
        mode = "entidad";
        chartTitle = "Por Entidad";
      } else if (!estadoSelected.value.selectedOption.value) {
        mode = "estado";
        chartTitle = "Por Estado";
      }

      loading.value = true;
      axios({
        method: "post",
        url: process.env.VUE_APP_URL_API_SICON,
        data: params,
      })
        .then(function (response) {
          loading.value = false;
          let arr = [];
          let maxValue = 0;
          let minValue = 10000;
          for (let item of response.data) {
            if (!localidadSelected.value.selectedOption.value) {
              const result = arr.filter(
                (row) =>
                  row.codLocalidad === item.localidad_ejecucion_cod &&
                  row.anio === item.anio
              );

              populateArrCharts(item);

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
            } else {
              const result = arr.filter(
                (row) =>
                  row.codUPZ === item.upz_ejecucion_cod &&
                  row.anio === item.anio
              );

              populateArrChartsUPZ(item);

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
                  codUPZ: item.upz_ejecucion_cod,
                  anio: item.anio,
                  count: 1,
                });
              }
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

          if (!localidadSelected.value.selectedOption.value) {
            populateFeatureLayer(arr, reangeArr);
          } else {
            populateFeatureLayerUPZ(arr, reangeArr);
          }
        })
        .catch(function (response) {
          //handle error
          loading.value = false;
          console.log(response);
        });
    }

    function populateArrCharts(item) {
      let result;
      switch (mode) {
        case "convocatoria":
          result = arrCharts.filter(
            (row) =>
              row.codLocalidad === item.localidad_ejecucion_cod &&
              row.convocatoria === item.convocatoria
          );
          if (result.length === 0) {
            arrCharts.push({
              codLocalidad: item.localidad_ejecucion_cod,
              convocatoria: item.convocatoria,
              count: 1,
            });
          }
          break;
        case "entidad":
          result = arrCharts.filter(
            (row) =>
              row.codLocalidad === item.localidad_ejecucion_cod &&
              row.entidad === item.entidad
          );
          if (result.length === 0) {
            arrCharts.push({
              codLocalidad: item.localidad_ejecucion_cod,
              entidad: item.nombre_entidad,
              count: 1,
            });
          }
          break;
        case "estado":
          result = arrCharts.filter(
            (row) =>
              row.codLocalidad === item.localidad_ejecucion_cod &&
              row.estado === item.estado
          );
          if (result.length === 0) {
            arrCharts.push({
              codLocalidad: item.localidad_ejecucion_cod,
              estado: item.estado_propuesta,
              count: 1,
            });
          }
          break;
      }

      if (result.length > 0) {
        result[0].count += 1;
      }
    }

    function populateArrChartsUPZ(item) {
      let result;
      switch (mode) {
        case "convocatoria":
          result = arrCharts.filter(
            (row) =>
              row.codUPZ === item.upz_ejecucion_cod &&
              row.convocatoria === item.convocatoria
          );
          if (result.length === 0) {
            arrCharts.push({
              codUPZ: item.upz_ejecucion_cod,
              convocatoria: item.convocatoria,
              count: 1,
            });
          }
          break;
        case "entidad":
          result = arrCharts.filter(
            (row) =>
              row.codUPZ === item.upz_ejecucion_cod &&
              row.entidad === item.entidad
          );
          if (result.length === 0) {
            arrCharts.push({
              codUPZ: item.upz_ejecucion_cod,
              entidad: item.nombre_entidad,
              count: 1,
            });
          }
          break;
        case "estado":
          result = arrCharts.filter(
            (row) =>
              row.codUPZ === item.upz_ejecucion_cod &&
              row.estado === item.estado
          );
          if (result.length === 0) {
            arrCharts.push({
              codUPZ: item.upz_ejecucion_cod,
              estado: item.estado_propuesta,
              count: 1,
            });
          }
          break;
      }

      if (result.length > 0) {
        result[0].count += 1;
      }
    }

    function setupDatasetCharts(feature) {
      const arrChartsByLocalidad = arrCharts.filter(
        (row) => row.codLocalidad === feature.graphic.attributes.codLocalidad
      );

      let arr = [];
      let labels = [];
      for (let item of arrChartsByLocalidad) {
        const result = arr.filter((row) => row.title === item[mode]);

        if (result.length > 0) {
          result[0].sum += item.count;
        } else {
          labels.push(item[mode]);
          arr.push({
            title: item[mode],
            sum: item.count,
          });
        }
      }

      chartData.options = {
        responsive: true,
        parsing: {
          key: "sum",
        },
      };

      const dataLength = arr.length;

      const COLORS = color.interpolateColors(dataLength);

      const dataset = {
        label: chartTitle,
        data: arr,
        backgroundColor: COLORS,
        hoverBackgroundColor: COLORS,
      };
      chartData.data.labels = labels;
      chartData.data.datasets = [dataset];
    }

    return {
      searchClick,
      localidadGraphics,
      loading,
      entidadesItems,
      entidadSelected,
      anioItems,
      anioSelected,
      estadoItems,
      estadoSelected,
      localidadItems,
      upzItems,
      localidadSelected,
      upzSelected,
      zupActive,
      barrioActive,
    };
  },
});
</script>
