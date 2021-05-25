import { message } from 'ant-design-vue'
import axios from './axios.config'

const post = (url, params) => {
  return new Promise((resolve) => {
    axios
      .post(url, params)
      .then((res) => {
        message.info(res.msg)
        resolve(res)
      })
      .catch(() => {
        // notification.error({
        //   message: err.msg,
        // })
      })
  })
}

const put = (url, params) => {
  return new Promise((resolve) => {
    axios.put(url, params).then((res) => {
      message.info(res.msg)
      resolve(res)
    })
    .catch(()=>{})
  })
}
const del=(url)=>{
  return new Promise((resolve) => {
    axios
      .delete(url)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => console.log(err))
  })
}
const get = (url) => {
  return new Promise((resolve) => {
    axios
      .get(url)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => console.log(err))
  })
}

const login = (params) => {
  return post('/login', params)
}

const getUserByPhone = (phone) => {
  return get(`/user?phone=${phone}`)
}
const addUser = (params) => {
  return post('/user', params)
}
const addRole = (params) => {
  return post('/role', params)
}
const updateUser = (user) => {
  return put(`/user/${user.id}`, user)
}
const delUser=(id)=>{
  return del(`/user/${id}`)
}
const getUsersByPage = (pageInfo = {}) => {
  let { pageSize = 10, current = 1 } = pageInfo
  return get(`/users?page_size=${pageSize}&current=${current}`, pageInfo)
}

const addSysMenu = (params) => {
  return put('/sysmenu', params)
}
const getSysMenuByName = (name = '', pageInfo = {}) => {
  let { pageSize = 10, current = 1 } = pageInfo
  return get(`/sysmenu?name=${name}&page_size=${pageSize}&current=${current}`)
}

const getSysMenusByPage = (pageInfo = {}) => {
  let { pageSize = 10, current = 1 } = pageInfo
  return get(`/sysmenu?page_size=${pageSize}&current=${current}`)
}

const getSysMenusTree = () => {
  return get('/sysmenu/treedata')
}

const getAllRoles = () => {
  return get('/roles')
}

const getSysMenuById = (id) => {
  return get(`/sysmenu?role_id=${id}`)
}
const getRoleByName = (name, pageInfo = {}) => {
  let { pageSize = 10, current = 1 } = pageInfo
  return get(
    `/role?display_name=${name}&page_size=${pageSize}&current=${current}`
  )
}
const getRoleByUserId = (userId) => {
  return get(`/user/${userId}/role`)
}

const getRoleByPage = (pageInfo = {}) => {
  let { pageSize = 10, current = 1 } = pageInfo
  return get(`/roles?page_size=${pageSize}&current=${current}`, pageInfo)
}

const updateRole = (role) => {
  return put(`/role/${role.id}`, { ...role })
}

const updateRoleState = (role) => {
  return put(`/role/${role.id}/state`, { ...role })
}
const getAllRecords = (pageInfo={}) => {
  let { pageSize = 10,current =0} = pageInfo
  return get(`/audits?page_size=${pageSize}&current=${current}`,)
}
const getRoutes = () => {
  return get('/profile')
}
export {
  delUser,
  login,
  addSysMenu,
  getRoleByPage,
  getAllRoles,
  updateRole,
  getSysMenusTree,
  getSysMenusByPage,
  addUser,
  updateUser,
  getUsersByPage,
  getSysMenuByName,
  getUserByPhone,
  getRoleByName,
  getRoutes,
  getSysMenuById,
  updateRoleState,
  getRoleByUserId,
  addRole,
  getAllRecords
}
