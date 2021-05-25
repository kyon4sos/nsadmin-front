<template>
  <a-sub-menu :key="menuInfo.path" v-bind="$props">
    <template #title>
      <span>
        <span>{{ menuInfo.meta.title }}</span>
      </span>
    </template>
    <template v-for="item in menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.path" :title="item.meta.title">
        <a-icon type="pie-chart" />
        <span>{{ item.meta.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.path" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>

<script>
import { Menu } from "ant-design-vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "SubMenu",
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    // Cannot overlap with properties within Menu.SubMenu.props
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
});
</script>

<style lang="less" >
</style>
