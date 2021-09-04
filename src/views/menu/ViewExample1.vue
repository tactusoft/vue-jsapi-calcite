<template>
    <div>
        <h2 class="menu__title">Lorem Ipsum</h2>
        <div class="mt-3">
            <calcite-label>Summary 
                <calcite-input placeholder="Lorem Ipsum"></calcite-input>
            </calcite-label>
        </div>
        <div class="mt-3">
            <calcite-label>Summary 
                <calcite-input placeholder="Lorem Ipsum"></calcite-input>
            </calcite-label>
        </div>
        <div class="mt-3">
            <calcite-input placeholder="Define X" maxLength="30" icon="analysis"></calcite-input>
            <calcite-input placeholder="Define Y" maxLength="30" icon="analysis" class="mt"></calcite-input>
        </div>
        
        <div class="mt-3 flex flex--align-items-center flex--justify-content-space-around">
            <div>
                <calcite-label>Summary</calcite-label>
                <div>
                    <calcite-switch></calcite-switch>
                </div>
            </div>
            <div>
                <calcite-label>Summary</calcite-label>
                <div>
                    <calcite-switch></calcite-switch>
                </div>
            </div>
            <div>
                <calcite-label>Summary</calcite-label>
                <div>
                    <calcite-switch></calcite-switch>
                </div>
            </div>
        </div>

        <div class="mt-5">
            <calcite-button iconStart="save" width="full">Save </calcite-button>
        </div>
        
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import '@esri/calcite-components/dist/custom-elements/bundles/input';
import '@esri/calcite-components/dist/custom-elements/bundles/switch';
import '@esri/calcite-components/dist/custom-elements/bundles/button';



export default defineComponent({
    name: 'ViewExample1'
})
</script>
