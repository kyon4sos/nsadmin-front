<template>
  <a-layout-header
    class="normal-header"
    style="background: #fff; padding: 0; height: 84px"
  >
    <section>
      <section class="header-left">
        <div class="action-item">
          <menu-unfold-outlined
            :style="{ fontSize: '16px' }"
            v-if="collapsed"
            class="menu-trigger"
            @click="handleClick(false)"
          />
          <menu-fold-outlined
            :style="{ fontSize: '16px' }"
            v-else
            class="menu-trigger"
            @click="handleClick(true)"
          />
        </div>
        <a-breadcrumb>
          <a-breadcrumb-item
            href="item.path"
            v-for="item in breadcrumbs"
            :key="item"
          >
            {{ item.meta.title }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </section>
      <section class="header-right">
        <a-tooltip placement="bottom">
          <template #title>搜索</template>
          <div class="action-item" @click="showSearch = true">
            <SearchOutlined />
          </div>
        </a-tooltip>
        <div class="action-item">
          <CompressOutlined />
        </div>
        <div class="user-wrap action-item">
          <a-dropdown>
            <div>
              <a-avatar :size="24">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span class="username">{{ userInfo.username }}</span>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleLogout">
                  <a @click="hanldeLogout">退出登录</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">修改密码</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div class="action-item" @click="openSetting = true">
          <SettingOutlined class="hover-bg" />
        </div>
      </section>
    </section>
    <section>
      <Tabs
        type="editable-card"
        size="small"
        :animated="false"
        :hideAdd="true"
        :tabBarGutter="3"
        :activeKey="activeKey"
        @change="handleChange"
        @edit="handleEdit"
      >
        <template
          v-for="item in tabs"
          :key="item.query ? item.fullPath : item.key"
        >
          <TabPane :closable="!(item && item.meta && item.meta.affix)">
            <template #tab>
              {{ item.title }}
            </template>
          </TabPane>
        </template>
      </Tabs>
    </section>
  </a-layout-header>
  <a-drawer
    title="设置"
    placement="right"
    :closable="false"
    v-model:visible="openSetting"
  >
    <a-divider>主题颜色</a-divider>
    <section class="setting-item">
      <label>夜间模式</label>
      <a-switch
        v-model:checked="blackTheme"
        checked-children="开"
        un-checked-children="关"
      />
    </section>
    <a-divider>菜单颜色</a-divider>
    <section class="setting-item">
      <a-checkbox v-model:checked="checked">Checkbox</a-checkbox>
    </section>
    <section class="setting-item">
      <label>夜间模式</label>
      <a-switch
        v-model:checked="blackTheme"
        checked-children="开"
        un-checked-children="关"
      />
    </section>
  </a-drawer>
  <a-modal v-model:visible="showSearch" title="搜索" @ok="handleOk">
    <a-input placeholder="请输入搜索内容"></a-input>
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive, computed, toRefs } from "vue";
import { Tabs } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  name: "NormalHeader",
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
  },
  props: {
    collapsed: {
      default: false,
      type: Boolean,
    },
  },
  emits: ["update:collapsed"],
  setup(_, { emit }) {
    const router = useRouter();
    const store = useStore();
    const checked = ref(false);
    const showSearch = ref(false);
    const searchValue = ref("");

    const blackTheme = ref(false);
    const openSetting = ref(false);
    const data = reactive({});

    const breadcrumbs = computed(() => {
      const { matched } = router.currentRoute.value;
      return matched;
    });
    const tabs = computed(() => {
      return store.state.tabs;
    });
    const handleClick = (flag) => {
      emit("update:collapsed", flag);
    };
    const onSearch = () => {};
    const onBlur = () => {
      showSearch.value = false;
    };
    const activeKey = computed(() => {
      return store.getters.getActiveTab.key;
    });

    const remove = (targetKey) => {
      let lastIndex = 0;
      let tabs = store.state.tabs;
      let activeKey = store.getters.getActiveTab.key;
      if (tabs.length <= 1) {
        return;
      }
      tabs.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      tabs = tabs.filter((pane) => pane.key !== targetKey);
      if (tabs.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = data.panes[lastIndex].key;
        } else {
          activeKey = data.panes[0].key;
        }
      }
      store.state.tabs = tabs;
    };
    function handleEdit(targetKey) {
      remove(targetKey);
    }
    const userInfo = computed(() => store.getters.getUserInfo);
    const handleChange = (key) => {
      store.commit("SET_ACTIVE_TAB", key);
      router.push(key.toLowerCase());
    };
    const handleLogout=()=>{
      store.commit("LOGOUT");
      router.push("/login")
    }
    const handleOk = () => {};
    return {
      userInfo,
      openSetting,
      checked,
      blackTheme,
      searchValue,
      showSearch,
      activeKey,
      tabs,
      breadcrumbs,
      handleEdit,
      handleOk,
      selectedKeys: ref(["1"]),
      ...toRefs(data),
      handleClick,
      onSearch,
      onBlur,
      handleChange,
      handleLogout
    };
  },
});
</script>

<style lang="less">
.ant-layout-header > section {
  height: 60%;
  border-bottom: 1px solid #ededed;
  display: flex;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
}
.ant-layout-header > section:nth-child(1) {
  height: 55%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ant-layout-header .header-left {
  display: flex;
  align-items: center;
  height: 100%;
}
.ant-layout-header .header-right {
  display: flex;
  align-items: center;
  height: 100%;
}
.ant-layout-header > section:nth-child(2) {
  height: 45%;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.action-item {
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 8px;
}
.action-item:hover {
  background-color: rgba(243, 243, 243, 0.473);
}
.user-wrap {
  height: 100%;
  color: #333;
  display: flex;
  align-items: center;
  // overflow: hidden;
  .username {
    margin-left: 8px;
    line-height: 0;
  }
}
.normal-header {
  .ant-menu-inline-collapsed > .ant-menu-item,
  .ant-menu-inline-collapsed
    > .ant-menu-item-group
    > .ant-menu-item-group-list
    > .ant-menu-item,
  .ant-menu-inline-collapsed
    > .ant-menu-item-group
    > .ant-menu-item-group-list
    > .ant-menu-submenu
    > .ant-menu-submenu-title,
  .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
    display: flex;
    justify-content: center;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    height: 100%;
    margin: 0;
    margin-right: 2px;
    margin-bottom: 1px;
    padding: 4px 16px;
    line-height: 0px;
    border: 1px solid #f0f0f0;
    border-radius: 2px 2px 2px 2px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container {
    height: 100%;
  }
  .ant-tabs-bar {
    margin: 0 0 0px 0;
    border: none;
    outline: none;
    transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
</style>
