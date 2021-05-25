<template>
  <a-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <transition name="app" mode="out-in">
        <keep-alive>
          <component class="view" :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </a-config-provider>
</template>

<script>
import { reactive, toRefs, watch, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import Cookies from "js-cookie";
import zhCN from "ant-design-vue/es/locale/zh_CN";
export default {
  name: "App",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const data = reactive({
      component: "DefaultLayout",
      // currentRoute:router.getCurrentRoute()
    });
    const locale = reactive(zhCN);
    onBeforeMount(() => {
      if (!store.getters.getUserInfo) {
        let userInfo = Cookies.get("user");
        if (userInfo) {
          let user = JSON.parse(userInfo);
          store.dispatch("SET_USER_INFO", user);
        } else {
          router.push("/login");
        }
      }
    });
    watch(
      () => route.path,
      (val) => {
        store.state.activeTab = val.split("/")[1];
        if (val == "/login") {
          data.component = val.split("/")[1];
        } else {
          data.component = "DefaultLayout";
        }
      }
    );
    return {
      locale,
      ...toRefs(data),
    };
  },
};
</script>
