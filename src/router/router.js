import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter(
    {
        history: createWebHistory(),
        routes: [
            {
                path: '/',
                component: () => import('@/shared/components/MainLayout.vue'),
                children: [
                    {
                        path: '',
                        component: {
                            template: '<div style="padding: 100px">Главная страница — список игр</div>'
                        },
                        name: 'home'
                    },
                    {
                        path: 'games',
                        name: 'games',
                        component: () => import('@/entities/games/components/Grid.vue')
                    }
                ]
            },
        ]
    }
)

export default router