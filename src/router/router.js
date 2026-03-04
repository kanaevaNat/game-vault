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
                        component: () => import('@/entities/games/components/Page.vue')
                    },
                    {
                        path:'/games/:id',
                        name: 'games-details',
                        component: () => import('@/entities/games/components/Details.vue')
                    },
                    {
                        path: 'news',
                        name: 'news',
                        component: () => import('@/entities/news/components/FeedGrid.vue')
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
                                path: 'games-admin',
                                name: 'games-admin',
                                component: () => import('@/entities/games/components/AdminPage.vue')
                            },
                            {
                                path: 'publishers',
                                name: 'publishers',
                                component: () => import('@/entities/publisher/PublishersList.vue')
                            },
                            {
                                path: 'categories',
                                name: 'categories',
                                component: () => import('@/entities/category/CategoriesList.vue')
                            },
                            {
                                path: 'news-admin',
                                name: 'news-admin',
                                component: () => import('@/entities/news/components/NewsList.vue')
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