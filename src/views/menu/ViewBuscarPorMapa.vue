<template>
    <div>
        <h2 class="menu__title">SISBIC</h2>
        <h3>Búsqueda por Mapa</h3>
        <div class="mt-3">
            <calcite-label>
                Localidad:
            </calcite-label>
            <p>{{data.localidad}}</p>
        </div>
        <div class="mt-3">
            <calcite-label>
                Sector Catastral:
            </calcite-label>
            <p>{{data.barrio_1}}</p>
        </div>
        <div class="mt-3">
            <calcite-label>
                Dirección Actual:
            </calcite-label>
            <p>{{data.direccion}}</p>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ViewBuscarPorMapa',
    props: ['data'],
    setup() {
        
    },
})
</script>
