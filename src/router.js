import {createRouter, createWebHashHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;