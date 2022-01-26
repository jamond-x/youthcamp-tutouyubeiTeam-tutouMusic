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
        children: [
          {
            path: '/',
            redirect: 'personality'
          },
          {
            path: 'personality',
            component: () => import('pages/DiscoverMusic/childPages/Personality.vue')
          },
          {
            path: 'playlist',
            component: () => import('pages/DiscoverMusic/childPages/Playlist.vue')
          },
          {
            path: 'rank',
            component: () => import('pages/DiscoverMusic/childPages/Rank.vue')
          },
          {
            path: 'singer',
            component: () => import('pages/DiscoverMusic/childPages/Singer.vue')
          },
        ]
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
