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
      <template #avatar="{ text }">
        <img :src="text" width="40" height="40"/>
      </template>
      <template #action>
        <span>
          <a>查看订单</a>
          <a-divider type="vertical" />
          <a>查看售后</a>
          <a-divider type="vertical" />
          <a>发红包</a>
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
    title: "昵称",
    key: "nickname",
    dataIndex: "nickname",
    slots: { customRender: "nickname" },
  },
  {
    title: "头像",
    key: "avatar",
    dataIndex: "avatar",
    slots: { customRender: "avatar" },
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
    phone: 12345678901,
    nickname: "隔壁老王",
    avatar:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2590128318,632998727&fm=26&gp=0.jpg"
  },
];

export default defineComponent({
  setup() {
    const loading = ref(true);
    const username = ref("");
    const handleClick = () => {
      loading.value = !loading.value;
    };
    const formState =reactive({})
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
      formState
    };
  },
});
</script>