import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Recommend from '../views/Recommend.vue'
import HotSong from '../views/HotSong.vue'
import HomeSearch from '../views/HomeSearch.vue'
import SongDetails from '../views/SongDetails.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect:'/recommend',
    children:[{
      path:'recommend',
      component:Recommend,
    },
    {
      path:'HotSong',
      component:HotSong,
    },
    {
      path:'HomeSearch',
      component:HomeSearch,
    },
  ],
  
  },
  {
    path:'/SongDetails',
    component:SongDetails,
  }
]
const router = new VueRouter({
  routes
})

export default router
