const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        // component: () => import('pages/Index.vue'),
        redirect: '/discover',
      },
      {
        path: '/discover',
        component: () => import('pages/DiscoverMusic/Discover.vue'),
      },
      {
        path: '/mvplay/:mvid',
        component: () => import('pages/MVplay/MVplay.vue'),
      },
      {
        path: '/user/:uid',
        props: true,
        component: () => import('pages/User/User.vue'),
      },
      {
        path: '/user',
        component: () => import('pages/User/User.vue'),
      },
      {
        path: '/search/:keywords',
        props: true,
        component: () => import('pages/Search/Search.vue'),
      },
      {
        path: '/search/:keywords/:type',
        props: true,
        component: () => import('pages/Search/SearchDetail.vue'),
      },
      {
        path: '/playlist',
        component: () => import('pages/LikeMusic/LikeMusic.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
