<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <NormalMenu :menus="menus"></NormalMenu>
    </a-layout-sider>
    <a-layout>
      <NormalHeader v-model:collapsed="collapsed" />
      <NormalContent/>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  defineComponent,
  ref,
  onBeforeMount,
  reactive,
  toRefs,
} from "vue";
import { routes } from "@/router";
import { useStore } from "vuex";
import NormalMenu from "./components/NormalMenu";
import NormalHeader from "./components/NormalHeader";
import NormalContent from "./components/NormalContent";
export default defineComponent({
  nameL: "DefaultLayout",
  components: {
    NormalMenu,
    NormalHeader,
    NormalContent,
  },

  setup() {
    const data = reactive({
      menus: [],
    });
    const collapsed = ref(false);
    onBeforeMount(() => {
      data.menus = routes;
    });
    return {
      ...toRefs(data),
      collapsed,
    };
  },
});
</script>
<style lang="less">
.a-layout {
  width: 100%;
}
.site-layout .site-layout-background {
  background: #fff;
}
.logo {
  width: 100%;
  height: 78px;
}
.ant-layout-sider {
  min-height: 100vh;
}
</style>