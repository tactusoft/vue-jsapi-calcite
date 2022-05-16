<template>
  <div>
    <Loader v-if="loading" menu />
    <h2 class="menu__title">IDPC</h2>
    <h3>Búsqueda por CHIP</h3>
    <div class="mt-3">
      <calcite-label
        >Digite el CHIP *
        <calcite-input></calcite-input>
      </calcite-label>
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
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";

import Chart from "chart.js/auto";

//import API from "../../data/api";
import axios from "axios";
import useColors from "@/utils/useColors";

export default defineComponent({
  name: "ViewSISBIC",
  components: { Loader },
  setup(_, { emit }) {
    let app;
    let localidadGraphics = [];
    let upzGraphics = [];
    let mode;
    let arrCharts = [];
    let chartTitle;
    let layer;
    let graphicsLayer;
    let bienesLayer;

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
      graphicsLayer = new GraphicsLayer();
      app.view.map.add(graphicsLayer);

      bienesLayer = new MapImageLayer({
        url: "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/recreaciondeporte/bienesinterescultural/MapServer",
        sublayers: [
          {
            id: 0,
            visible: true,
            popupTemplate: {
              title: "{TITULO_NOM}",
              actions: [
                {
                  id: "action-detail",
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
                      label: "UPZ",
                    },
                    {
                      fieldName: "SECTOR_CAT",
                      label: "Sector Catastral",
                    },
                    {
                      fieldName: "LOT_COD",
                      label: "Código de Lote",
                    },
                  ],
                },
              ],
            },
          },
          {
            id: 1,
            visible: true,
            popupTemplate: {
              title: "{NOMBIC}",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "DIRBIC",
                      label: "Dirección BIC",
                    },
                    {
                      fieldName: "ACTADMBIC",
                      label: "Acto Administrativo BIC",
                    },
                    {
                      fieldName: "AMBITOBIC",
                      label: "Ámbito BIC",
                    },
                    {
                      fieldName: "CATEGORIA",
                      label: "Categoría BIC fuera del Centro Histórico",
                    },
                    {
                      fieldName: "NOMSIC",
                      label: "Nombre del Sector de Interés Cultural",
                    },
                    {
                      fieldName: "NOMLOCALIDAD",
                      label: "Nombre de la Localidad",
                    },
                    {
                      fieldName: "NOMUPZ",
                      label: "UPZ",
                    },
                    {
                      fieldName: "NOMSECTCAT",
                      label: "Sector Catastral",
                    },
                    {
                      fieldName: "CODLOTE",
                      label: "Código de Lote",
                    },
                  ],
                },
              ],
            },
          },
          {
            id: 4,
            visible: true,
            popupTemplate: {
              title: "{NOMBRE}",
              actions: [
                {
                  id: "action-detail",
                  title: "Detalle",
                },
              ],
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "DIRECCION_DECLARATORIA",
                      label: "Dirección BIC",
                    },
                    {
                      fieldName: "ACTO_ADMIN",
                      label: "Acto Administrativo BIC",
                    },
                    {
                      fieldName: "AMBITO",
                      label: "Ámbito BIC",
                    },
                    {
                      fieldName: "CATEGORIABICNOPEMP",
                      label: "Categoría BIC fuera del Centro Histórico",
                    },
                    {
                      fieldName: "SIC",
                      label: "Nombre del Sector de Interés Cultural",
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
                      fieldName: "SECTOR_CATASTRAL",
                      label: "Sector Catastral",
                    },
                    {
                      fieldName: "CODIGO_LOTE",
                      label: "Código de Lote",
                    },
                    {
                      fieldName: "OBSERVACION",
                      label: "Observación",
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
      app.view.map.add(bienesLayer);
      const popup = app.view.popup;
      popup.viewModel.on("trigger-action", (event) => {
        if (event.action.id === "action-detail") {
          loading.value = true;
          const attributes = popup.viewModel.selectedFeature.attributes;
          generateQueryLotebyCodigoLote(attributes.LOT_COD);
        }
      });
    });

    onUnmounted(() => {
      app.view.map.remove(graphicsLayer);
      //app.view.map.remove(bienesLayer);
    });

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

    function generateQueryLote() {
      loading.value = true;
      const queryParamas = new Query({
        outFields: ["*"],
        where: "PRECHIP='AAA0030JPYN'",
      });
      query
        .executeQueryJSON(
          "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/catastro/lote/MapServer/3",
          queryParamas
        )
        .then((results) => {
          for (const feature of results.features) {
            generateQueryPredio(feature.attributes.BARMANPRE);
          }
        });
    }

    function generateQueryLotebyCodigoLote(lotcodigo) {
      loading.value = true;
      const queryParamas = new Query({
        outFields: ["PRECHIP"],
        where: "BARMANPRE='" + lotcodigo + "'",
        returnDistinctValues: true,
      });
      // -- Este emit no iría acá, iría en la linea 540 --
      emit("changeToBuscarMapaView", []);
      query
        .executeQueryJSON(
          "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/catastro/lote/MapServer/3",
          queryParamas
        )
        .then((results) => {
          for (const feature of results.features) {
            generateQueryBuscarChip(feature.attributes.PRECHIP);
          }
        });
    }

    function generateQueryBuscarChip(chip) {
      let data = [];
      loading.value = false;
      // GABI si buscas este chip AAA0055DUEP trae multiples resultados
      axios({
        method: "get",
        url: "https://sisbic.idpc.gov.co/api/buscar_chip/" + chip,
      })
        .then(function (response) {
          for (let item of response.data) {
            axios({
              method: "get",
              url: "https://sisbic.idpc.gov.co/api/inmuebletotal/" + item.id,
            })
              .then(function (responseDetail) {
                for (let itemDetail of responseDetail.data) {
                  data.push(itemDetail);
                }
              })
              .catch(function (response) {
                loading.value = false;
                console.log(response);
              });
          }
          //este emit si iría aquí: emit('changeToBuscarMapaView', data)
        })
        .catch(function (response) {
          loading.value = false;
          console.log(response);
        });
    }

    function generateQueryPredio(lotcodigo) {
      const polygonSymbol = {
        type: "simple-fill", // autocasts as SimpleFillSymbol
        color: "purple",
        style: "backward-diagonal",
        outline: {
          // autocasts as SimpleLineSymbol
          color: "purple",
          width: 3,
        },
      };

      const queryParamas = new Query({
        outFields: ["*"],
        where: "LOTCODIGO='" + lotcodigo + "'",
        returnGeometry: true,
      });
      query
        .executeQueryJSON(
          "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/catastro/lote/MapServer/0",
          queryParamas
        )
        .then((results) => {
          for (const feature of results.features) {
            const graphic = new Graphic({
              geometry: feature.geometry,
              symbol: polygonSymbol,
              attributes: {
                codLocalidad: feature.attributes.LOCCODIGO,
                nombreLocalidad: feature.attributes.LOCNOMBRE,
                count: 0,
              },
            });
            graphicsLayer.add(graphic);
            app.view.goTo(graphic);
            loading.value = false;
          }
        });
    }

    function searchClick() {
      app.view.popup.close();

      generateQueryLote();

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
        url: "http://sis.scrd.gov.co/crud_SCRD_pv/api/Intercambioinformacion/geo_sicon_propuestas",
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

    function clearClick() {
      graphicsLayer.removeAll();
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
      clearClick,
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
