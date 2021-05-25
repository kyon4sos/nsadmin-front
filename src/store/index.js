import { createStore } from 'vuex'
import Cookies from 'js-cookie'
const state = {
  activeTab: null,
  routes: ['Home', 'About'],
  tabs: [],
  userInfo: null,
  token: null,
}

const mutations = {
  SET_ACTIVE_TAB: (state, playload) => {
    state.activeTab = playload
  },

  SET_TABS: (state, playload) => {
    let index = state.tabs.findIndex((t) => t.key == playload.key)
    if (index === -1) {
      state.tabs.push(playload)
    }
    mutations['SET_ACTIVE_TAB'](playload)
  },

  SET_USER_INFO: (state, user) => {
    if(user) {
      Cookies.set('user', JSON.stringify(user))
    }
    state.userInfo = user
  },

  SET_TOKEN: (state, token) => {
    if(token) {
      Cookies.set('token', token)
    }
    state.token = token
  },
  LOGOUT:(state)=>{
    Cookies.remove('user');
    Cookies.remove('token');
    state.token = null,
    state.userInfo = null
  }
}

const getters = {
  getActiveTab: (state) => {
    return state.activeTab
  },

  getUserInfo: (state) => {
    return state.userInfo
  },
}

const actions = {
  SET_USER_INFO(context, data) {
    context.commit('SET_USER_INFO', data)
  },
  
  SET_TOKEN(context, data) {
    context.commit('SET_TOKEN', data)
  },
  LOGOUT(context) {
    context.commit('LOGOUT')
  }
}

export default createStore({
  state,
  mutations,
  actions,
  getters,
})
