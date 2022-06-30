<template>
    <div>
        <calcite-button @click="$emit('otherChip')" appearance="transparent" class="menu__button menu__button--back"
            color="red">
            <calcite-icon icon="arrow-bold-left" scale="s" aria-hidden="true"></calcite-icon>
        </calcite-button>
        <h2 class="menu__title">SISBIC</h2>
        <h3>Búsqueda por CHIP</h3>
        <div class="divider">
            <h2 class="divider__title">Localización</h2>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Código de Lote</label>
                    <p class="divider__text">{{ data.codigo_lote || data.cod_id }}</p>
                </div>
                <div>
                    <label>Nombre</label>
                    <p class="divider__text">{{ data.nombre || '--' }}</p>
                </div>
            </div>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Localidad</label>
                    <p class="divider__text">{{ data.localidad || '--' }}</p>
                </div>
            </div>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Barrio</label>
                    <p class="divider__text">{{ data.barrio_1 || '--' }}</p>
                </div>
                <div>
                    <label>Dirección</label>
                    <p class="divider__text">{{ data.direccion || '--' }}</p>
                </div>
            </div>
        </div>

        <div class="divider" v-if="data.clase === 'inmueblenopemp'">
            <h2 class="divider__title">Información Patrimonial</h2>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Grupo Patrimonial</label>
                    <p class="divider__text">{{ data.grupo_patrimonial || '--' }}</p>
                </div>
                <div>
                    <label>Subgrupo Patrimonial</label>
                    <p class="divider__text">{{ data.subgrupo || '--' }}</p>
                </div>
            </div>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Categoría de Intervención</label>
                    <p class="divider__text">{{ data.categoria || '--' }}</p>
                </div>
                <div>
                    <label>SIC</label>
                    <p class="divider__text">{{ data.sic || '--' }}</p>
                </div>
            </div>
        </div>

        <div class="divider" v-if="data.clase === 'inmueble'">
            <h2 class="divider__title">Clasificación Tipológica</h2>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Grupo patrimonial</label>
                    <p class="divider__text">{{ data.grupo_patr || '--' }}</p>
                </div>
                <div>
                    <label>Subgrupo patrimonial</label>
                    <p class="divider__text">{{ data.subgrupo_p || '--' }}</p>
                </div>
            </div>
            <div class="flex flex--justify-content-space-between">
                <div>
                    <label>Grupo</label>
                    <p class="divider__text">{{ data.grupo || '--' }}</p>
                </div>
                <div>
                    <label>Categoría</label>
                    <p class="divider__text">{{ data.categoria || '--' }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-3">
        <calcite-button iconStart="search" width="full" @click="windowOpen" :loading="loading">Ir a ficha
        </calcite-button>
    </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ViewBuscarPorMapa',
    props: ['data'],
    setup(props) {
        function windowOpen() {
            const url = `https://sisbic.idpc.gov.co/${props.data.clase}/${props.data.id}`;
            window.open(url, '_blank');
        }

        return {
            windowOpen
        };
    }
})
</script>
