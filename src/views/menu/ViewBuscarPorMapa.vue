<template>
    <div>
        <h2 class="menu__title">SISBIC</h2>
        <h3>Búsqueda por Mapa</h3>
        <div class="mt-3">
            <calcite-label>
                Nombre
            </calcite-label>
            <p>{{data.nombre}}</p>
        </div>
        <div class="mt-3">
            <calcite-label>
                Apellidos
            </calcite-label>
            <p>{{data.apellidos}}</p>
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
