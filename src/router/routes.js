const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
      },
      {
        path: '/discover',
        component: () => import('pages/DiscoverMusic/Discover.vue'),
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
        path: '/playlist',
        component: () => import('pages/Playlist/Playlist.vue'),
      },
      {
        path: '/LikeMusic',
        component: () => import('pages/LikeMusic/LikeMusic.vue'),
      },
      {
        path: '/entrance',
        component: () => import('pages/AuthPanel/AuthPanel.vue'),
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
