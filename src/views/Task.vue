<template>
  <a-card :loading="loading">
    <template #title>
      <div>
        <a-form layout="inline" :model="formState">
          <a-form-item>
            <a-input v-model:value="username" placeholder="请输入名称">
              <template #prefix
                ><SearchOutlined style="color: rgba(0, 0, 0, 0.25)"
              /></template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary">
              <template #icon><SearchOutlined /></template>
              搜索
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </template>
    <a-table :columns="columns" :data-source="data">
      <template #username="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #customTitle>
        <span> Name </span>
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
          <a>修改</a>
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
import { defineComponent, onMounted, reactive, ref } from "vue";
const columns = [
  {
    title: "任务名称",
    dataIndex: "taskname",
    key: "taskname",
  },
  {
    title: "启动时间",
    dataIndex: "startTime",
    key: "startTime",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
  },
  {
    title: "状态",
    key: "state",
    dataIndex: "state",
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];

export default defineComponent({
  setup() {
    const loading = ref(true);
    const username = ref("");
    const handleClick = () => {
      loading.value = !loading.value;
    };
    const tableData = reactive();
    onMounted(() => {
      setTimeout(() => {
        handleClick();
      }, 1000);
    });
    return {
      tableData,
      columns,
      loading,
      username,
    };
  },
});
</script>