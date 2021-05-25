import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import DefaultLayout from './layout/DefaultLayout.vue'
const routerHistory = createWebHistory()
import Cookies from 'js-cookie'
import { userStore} from 'vuex'
// const router = createRouter({
//   history: routerHistory,
//   routes: [
//     {
//       path: '/',
//       component: DefaultLayout,
//       redirect: '/home',
//       meta: { title: '根目录' },
//       children: [
//         {
//           path: '/home',
//           component: Home,
//           meta: { title: '主页1' },
//         },
//       ],
//     },
//     {
//       path: '/login',
//       component: Login,
//       meta: { title: '登录' },
//     },
//   ],
// })

// export default router

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: DefaultLayout,
    redirect: '/sysuser',
    meta: { title: '用户管理' },
    children: [
      {
        name: 'WxUser',
        path: '/wxuser',
        meta: { title: '微信用户' },
        component: () => import('@/views/WxUserList.vue'),
      },
      {
        name: 'SysUser',
        path: '/sysuser',
        meta: { title: '系统用户' },
        component: () => import('@/views/SysUserList.vue'),
      },
    ],
  },
  {
    path: '/system',
    component: DefaultLayout,
    redirect: '/menu',
    meta: { title: '系统管理' },
    children: [
      {
        name: 'Rule',
        path: '/menu',
        meta: { title: '菜单管理' },
        component: () => import('@/views/Menu.vue'),
      },
      {
        name: 'Role',
        path: '/role',
        meta: { title: '角色管理' },
        component: () => import('@/views/Role.vue'),
      },
      {
        name: 'task',
        path: '/task',
        meta: { title: '任务管理' },
        component: () => import('@/views/Task.vue'),
      },
    ],
  },
  {
    path: '/audit',
    component: DefaultLayout,
    redirect: '/record',
    meta: { title: '操作记录' },
    children: [
      {
        name: 'Record',
        path: '/record',
        meta: { title: '查询记录' },
        component: () => import('@/views/Audit.vue'),
      },
    ],
  },
]
const router = createRouter({
  history: routerHistory,
  routes,
})

const store = userStore

const whiteList = ["/login"]
router.beforeEach((to, from, next) => {
  for(let url of whiteList) {
     if(url ===to.fullPath) {
       next()
       return;
     }
  }
  let token = Cookies.get("token")
  if(token) {
    console.log("token",token);
    next()
    return  
  }
  return
})
export { router, routes }
