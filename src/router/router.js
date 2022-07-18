import {createRouter, createWebHashHistory} from 'vue-router';
let alreadyIn = false;
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/menu/Home.vue')

    },
    {
        path: '/sicon',
        name: 'SICON',
        component: () => import('@/views/menu/ViewSICON.vue')
    },
    {
        path: '/sisbic',
        name: 'SISBIC',
        component: () => import('@/views/menu/ViewSISBIC.vue')
    },
    {
        path: '/deep',
        name: 'DEEP',
        component: () => import('@/views/menu/ViewDEEP.vue')
    },
    {
        path: '/deepbiblio',
        name: 'DEEPBiblio',
        component: () => import('@/views/menu/ViewDEEPBiblio.vue')
    },
    {
        path: '/biblio',
        name: 'Biblio',
        component: () => import('@/views/menu/ViewBIBLIO.vue')
    },
    {
        path: '/vermas',
        name: 'verMas',
        component: () => import('@/views/menu/VerMas.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach( (to, from, next) => {
    if(alreadyIn)  next();
    else {
        alreadyIn = true;
        router.push('/')
    }
})

export default router;