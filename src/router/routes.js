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
        meta: {
          keepAlive: true,
        },
      },
      {
        path: '/mvplay/:mvid',
        props: true,
        component: () => import('pages/MVPlay/MVPlay.vue'),
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
        path: '/playlist/:id',
        props: true,
        component: () => import('pages/LikeMusic/LikeMusic.vue'),
      },
      {
        path: '/artist/:id',
        props: true,
        component: () => import('pages/Artist/Artist.vue'),
      },
      {
        path: '/artist/:id/:type',
        props: true,
        component: () => import('pages/Artist/ArtistDetail.vue'),
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
