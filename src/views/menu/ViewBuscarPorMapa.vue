<template>
    <div>
        <calcite-button
        @click="$emit('otherChip')"
        appearance="transparent"
        class="menu__button menu__button--back"
        color="red"
        >
        <calcite-icon
          icon="arrow-bold-left"
          scale="s"
          aria-hidden="true"
        ></calcite-icon>
        </calcite-button>
        <h2 class="menu__title">SISBIC</h2>
        <h3>Búsqueda por Mapa</h3>
        <a href="https://sisbic.idpc.gov.co/inmueble/607" target="_blank">Ir a ficha</a>
        <div class="divider">
            <h2 class="divider__title">Localización</h2>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Nombre</label>
                    <p class="divider__text">{{data.nombre || '--'}}</p>
                </div>
                <div>
                    <label>Localidad</label>
                    <p class="divider__text">{{data.localidad || '--'}}</p>
                </div>
            </div>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Barrio</label>
                    <p class="divider__text">{{data.barrio_1 || '--'}}</p>
                </div>
                <div>
                    <label>Dirección</label>
                    <p class="divider__text">{{data.direccion || '--'}}</p>
                </div>
            </div>
        </div>

        <div class="divider">
            <h2 class="divider__title">Información patrimonial</h2>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Grupo patrimonial</label>
                    <p class="divider__text">{{data.grupo_patr || '--'}}</p>
                </div>
                <div>
                    <label>Subgrupo patrimonial</label>
                    <p class="divider__text">{{data.subgrupo_p || '--'}}</p>
                </div>
            </div>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Grupo</label>
                    <p class="divider__text">{{data.grupo || '--'}}</p>
                </div>
                <div>
                    <label>Categoría</label>
                    <p class="divider__text">{{data.categoria || '--'}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ViewBuscarPorMapa',
    props: ['data'],
})
</script>
