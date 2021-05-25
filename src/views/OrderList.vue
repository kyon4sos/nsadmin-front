<template>
  <a-card :loading="loading">
    <template #title>
      <div>
        <a-form
          layout="inline"
          :model="formState"
        >
          <a-form-item>
            <a-input v-model:value="username" placeholder="请输入用户名">
              <template #prefix
                ><SearchOutlined style="color: rgba(0, 0, 0, 0.25)"
              /></template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit"> 搜索 </a-button>
          </a-form-item>
        </a-form>
      </div>
    </template>
    <a-table :columns="columns" :data-source="data">
      <template #username="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #customTitle>
        <span>
          Name
        </span>
      </template>
      <template #roles="{ text: roles }">
        <span>
          <a-tag
            v-for="role in roles"
            :key="role"
            :color="
              role === 'loser'
                ? 'volcano'
                : role.length > 5
                ? 'geekblue'
                : 'green'
            "
          >
            {{ role }}
          </a-tag>
        </span>
      </template>
      <template #action>
        <span>
          <a>修改角色</a>
          <a-divider type="vertical" />
          <a> 查看记录</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            <a>禁用</a>
          </a>
        </span>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
const columns = [
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
    slots: { customRender: "username" },
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "手机号",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "角色",
    key: "roles",
    dataIndex: "roles",
    slots: { customRender: "roles" },
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];

const data = [
  {
    key: "1",
    username: "mrwang",
    name: "老王1",
    phone:12345678901,
    roles: ["developer"],
  },
  {
    key: "2",
    username: "mrwang1",
    name: "老王2",
      phone:12345678901,
    roles: ["admin", "developer"],
  },
  {
    key: "3",
    username: "mrwang2",
    name: "老王3",
      phone:12345678901,
    roles: ["admin"],
  },
];

export default defineComponent({
  setup() {
    const loading = ref(true);
    const username = ref("");
    const handleClick = () => {
      loading.value = !loading.value;
    };
    onMounted(() => {
      setTimeout(() => {
        handleClick();
      }, 1000);
    });
    return {
      data,
      columns,
      loading,
      username,
    };
  },
});
</script>