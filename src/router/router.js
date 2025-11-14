import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter(
    {
        history: createWebHistory(),
        routes: [
            {
                path: '/',
                component: () => import('@/shared/ui/MainLayout.vue'),
                children: [
                    {
                        path: '',
                        component: {
                            template: '<div>Главная страница — список игр</div>'
                        },
                        name: 'home'
                    }
                ]
            },
        ]
    }
)

export default router