<template>
    <div class="menu__content__category">
        <h2 class="menu__title">Categorías</h2>
        <div class="flex flex--justify-content-space-around mt">
            <Category :color="currentMenuName === 'SICON' ? 'blue' : 'inverse' " icon="beaker" text="SICON" menuName="SICON" @routingMenu="menuHandler($event)" />
            <Category :color="currentMenuName === 'Bibliotecas' ? 'blue' : 'inverse' " icon="check-shield" text="Bibliotecas" menuName="Bibliotecas" @routingMenu="menuHandler($event)" />
            <Category :color="currentMenuName === 'Checking' ? 'blue' : 'inverse' " icon="analysis" text="SISBIC" menuName="Checking" @routingMenu="menuHandler($event)" />
        </div>
    </div>
    <div class="menu__content__list">
        <SubMenu @routing="routingHandler($event)" v-if="currentMenuName === 'SICON'" :subMenu="SICONSubMenu" />
        <SubMenu @routing="routingHandler($event)" v-if="currentMenuName === 'Bibliotecas'" :subMenu="SubMenu1" />
        <SubMenu @routing="routingHandler($event)" v-if="currentMenuName === 'Checking'" :subMenu="SubMenu2" />
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import  Category from '@/components/layouts/modals/menu/Category.vue'
import  SubMenu from '@/components/layouts/modals/menu/submenu/SubMenu.vue'

export default defineComponent({
    name: 'Home',
    components: {Category, SubMenu},
    emits: ['routingMenu', 'routing'],
    setup (_, { emit }) {
    const SICONSubMenu = [
      {
      title: 'Búsqueda por Propuestas',
      description: 'SICON',
      route: 'SICON'
    }
    ];
    const SubMenu1 = [
      {
      title: 'Lakes',
      description: 'Summary lorem ipsum 1',
      route: 'lakes'
    }
    ];
    const SubMenu2 = [
      {
      title: 'Mountain',
      description: 'Summary lorem ipsum 2',
      route: 'mountain'
    }
    ];
        const currentMenuName = ref('SICON');

        const routingHandler = (route) => emit('routing', route)
        
        const menuHandler = (menu) => currentMenuName.value = menu;

        return {routingHandler, currentMenuName, menuHandler, SICONSubMenu, SubMenu1, SubMenu2}
    }
})
</script>
