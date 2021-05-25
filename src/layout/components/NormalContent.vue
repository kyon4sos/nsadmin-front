<template>
  <RouterView>
    <template #default="{ Component, route }">
      <a-layout-content
        :style="{
          minHeight: '280px',
        }"
        ><transition
          name="move-fade"
          mode="out-in"
        >
          <keep-alive v-if="false">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
          <component v-else :is="Component" :key="route.fullPath" />
        </transition>
      </a-layout-content>
    </template>
  </RouterView>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "NormalContent",
  setup() {
    const store = useStore();
    return {
      page: computed(() => store.state.activeTab),
    };
  },
});
</script>

<style lang="less">
.view {
  width: 100%;
  height: 100%;
}
</style>