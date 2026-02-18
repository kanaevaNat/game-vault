import {createRouter, createWebHistory} from 'vue-router'
import NotFoundPage from "@/shared/components/NotFoundPage.vue";

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
                        name: 'home',
                        component: {
                            template: '<div style="padding: 100px">Главная страница — список игр</div>'
                        }
                    },
                    {
                        path: 'games',
                        name: 'games',
                        component: () => import('@/entities/games/components/Grid.vue')
                    },
                    {
                        path: '/admin',
                        name: 'admin',
                        component: () => import('@/entities/admin/components/AdminView.vue'),
                        children: [
                            {
                                path: '',
                                redirect: '/admin/countries'
                            },
                            {
                                path: 'categories',
                                name: 'categories',
                                component: () => import('@/entities/category/CategoriesList.vue')
                            },
                            {
                                path: 'countries',
                                name: 'countries',
                                component: () => import('@/entities/country/CountriesList.vue')
                            },
                            {
                                path: 'studios',
                                name: 'studios',
                                component: () => import('@/entities/studio/StudiosList.vue')
                            }
                        ]
                    },
                    {
                        path: '/:pathMatch(.*)*',
                        name: 'not-found',
                        component: NotFoundPage
                    },
                ]
            }
        ]
    }
)

export default router