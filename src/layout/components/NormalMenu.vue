<template>
  <a-menu
    :default-selected-keys="['1']"
    :default-open-keys="['2']"
    mode="inline"
    theme="dark"
    :inline-collapsed="collapsed"
    @click="handleNav"
  >
    <template v-for="item in menus" :key="item.path">
      <a-menu-item
        v-if="!item.children"
        :key="item.path"
        :title="item.meta.title"
      >
        <span>{{ item.meta.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.path" :menu-info="item" />
    </template>
  </a-menu>
</template>

<script>
import { defineComponent, ref, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import SubMenu from "./SubMenu";
export default defineComponent({
  name: "NormalMenu",
  components: {
    "sub-menu": SubMenu,
  },
  props: {
    menus: {
      default: () => [],
      type: Array,
    },
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const collapsed = ref(false);
    const handleNav = ({ key, item }) => {
      store.commit('SET_ACTIVE_TAB',{ key, title: item.title })
      store.commit("SET_TABS", { key, title: item.title });
      router.push(key.toLowerCase());
    };
    onBeforeMount(() => {
  
      const title = route.meta.title;
      const key = route.path;
      store.commit("SET_TABS", { key, title });
    });
    return {
      collapsed,
      handleNav,
    };
  },
});
</script>

<style lang="less" scoped>
</style>