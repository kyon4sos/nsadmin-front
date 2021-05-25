<template>
  <div>
    <a-card :loading="loading">
      <template #title>
        <div>
          <a-form layout="inline">
            <a-form-item>
              <a-input
                v-model:value="phone"
                placeholder="请输入手机号"
                @pressEnter="handleSearch"
              >
                <template #prefix>
                  <SearchOutlined style="color: rgba(0, 0, 0, 0.25)"
                /></template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSearch">
                <template #icon><SearchOutlined /></template>
                搜索
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleAdd">
                <template #icon><PlusOutlined /></template>
                新键用户
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </template>
      <a-table
        rowKey="id"
        :columns="columns"
        @change="pageChange"
        :data-source="table"
        :pagination="pagination"
        @expand="handleExpand"
      >
        <template #id="{ index }">
          {{ index + 1 }}
        </template>
        <template #expandedRowRender="{ record }">
          <a-spin v-if="record.spin" />
          <template v-else>
            <a-empty v-if="record.roles && record.roles.length == 0" />
            <a-tag
              v-else
              color="green"
              v-for="role in record.roles"
              :key="role.id"
            >
              {{ role.displayName }}
            </a-tag>
          </template>
        </template>
        <template #roles="{ record }">
          <a-tag color="green" v-for="role in record.roles" :key="role.id">
            {{ role.displayName }}
          </a-tag>
        </template>
        <template #action="{ record }">
          <span>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a> 查看记录</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link">
              <a>禁用</a>
            </a>
            <a-divider type="vertical" />
            <a @click="handleDel(record.id)">删除</a>
          </span>
        </template>
      </a-table>
    </a-card>
    <!-- 新增表单  -->
    <a-drawer
      :title="title"
      :width="720"
      :visible="drawerVisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :model="userForm" ref="formRef" :rules="rules" layout="vertical">
        <a-row :gutter="16">
          <a-form-item label="id" name="id" hidden>
            <a-input v-model:value="userForm.id" hidden />
          </a-form-item>
          <a-col :span="12">
            <a-form-item label="用户名" name="username">
              <a-input
                v-model:value="userForm.username"
                placeholder="请输入用户名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号" name="phone">
              <a-input
                v-model:value="userForm.phone"
                placeholder="请输入手机号"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="姓名" name="realname">
              <a-input
                v-model:value="userForm.realname"
                placeholder="请输入姓名"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="角色" name="roles">
              <a-select
                v-model:value="userForm.roleIds"
                show-search
                mode="multiple"
                placeholder="请选择角色"
                @change="handleSelect"
              >
                <a-select-option
                  v-for="role in roleList"
                  :value="role.id"
                  :key="role.id"
                >
                  {{ role.displayName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Description" name="description">
              <a-textarea
                v-model:value="userForm.description"
                :rows="4"
                placeholder="请输入角色描述"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="状态" name="disable">
              <a-switch
                checked-children="启用"
                un-checked-children="禁用"
                v-model:checked="userForm.disable"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
        <a-button type="primary" @click="handleOk">确定</a-button>
      </div>
    </a-drawer>
    <a-modal></a-modal>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onBeforeMount,
  computed,
} from "vue";
import { cloneDeep } from "lodash-es";
import {
  updateUser,
  getUsersByPage,
  getAllRoles,
  getUserByPhone,
  getRoleByUserId,
  addUser,
  delUser,
} from "@/request";
import { message } from "ant-design-vue";
const columns = [
  {
    title: "id",
    width: 70,
    slots: {
      customRender: "id",
    },
  },
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    title: "姓名",
    dataIndex: "realname",
  },
  {
    title: "手机号",
    dataIndex: "phone",
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
    const phone = ref("");
    const data = reactive({
      table: [],
      pageInfo: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
    });
    const roleList = ref([]);
    const pagination = computed(() => ({
      total: data.pageInfo.total,
      current: data.pageInfo.current,
      pageSize: data.pageInfo.size,
    }));
    const title = ref("新增用户");
    const drawerVisible = ref(false);
    const userForm = ref({
      username: "",
      password: "",
      roles: [],
      roleIds: [],
    });
    const roleMapName = computed(() => {
      return userForm.value.roles.map((r) => r.displayName);
    });
    const formRef = ref(null);
    const rules = {
      username: [
        {
          required: true,

          trigger: "blur",
          message: "请输入用户名",
        },
        {
          min: 6,
          max: 20,
          trigger: "blur",
          message: "用户名6-20字符",
        },
      ],
      realname: [
        {
          required: true,
          trigger: "blur",
          message: "请输入姓名",
        },
        {
          min: 2,
          max: 8,
          trigger: "blur",
          message: "姓名为2-8字符",
        },
      ],
      password: [
        {
          required: true,
          trigger: "blur",
          message: "请输入手机号",
        },
        {
          min: 6,
          max: 20,
          trigger: "blur",
          message: "密码长度为6-20个字符",
        },
      ],
      phone: [
        {
          required: true,
          trigger: "blur",
          message: "请输入手机号码",
        },
        {
          min: 6,
          max: 20,
          trigger: "blur",
          message: "用户名6-20字符",
        },
      ],
    };
    const handleSearch = () => {
      if (phone.value==0) {
        addRole()
        return
      }
      getUserByPhone(phone.value).then((res) => {
        data.table = res.data;
      });
    };
    const handleSelect = () => {};
    const handleAdd = () => {
      title.value = "新键用户";
      drawerVisible.value = true;
    };
    const handleEdit = (record) => {
      title.value = "编辑用户";
      drawerVisible.value = true;
      userForm.value = cloneDeep(record);
      userForm.value.roleIds = userForm.value.roles.map((r) => r.id);
    };
    const handleChange = () => {};
    const handleOk = () => {
      if (title.value == "新键用户") {
        formRef.value.validate().then(() => {
          addUser(userForm.value).then(() => {
            drawerVisible.value = false;
            initData(data.pageInfo);
          });
        }).catch(()=>{})
        return;
      }
      formRef.value.validate().then(() => {
        updateUser(userForm.value).then(() => {
          formRef.value.resetFields();
          initData(data.pageInfo);
        });
        drawerVisible.value = false;
      });
    };
    const handleExpand = (expand, record) => {
      record.spin = true;
      getRoleByUserId(record.id).then((res) => {
        userForm.value.roles = res.data;
        record.spin = false;
      });
    };
    const handleDel =(id)=>{
      delUser(id)
    }
    const initData = (pageInfo) => {
      getUsersByPage(pageInfo).then((res) => {
        data.table = res.data.records;
        data.pageInfo = { ...res.data };
        loading.value = false;
      });
      getAllRoles().then((res) => {
        roleList.value = res.data;
      });
    };
    const pageChange = (pageInfo) => {
      initData(pageInfo);
    };
    const onClose = () => {
      drawerVisible.value = false;
      formRef.value.resetFields();
    };

    onBeforeMount(() => {
      initData();
    });
    return {
      ...toRefs(data),
      roleList,
      userForm,
      handleSelect,
      drawerVisible,
      title,
      columns,
      loading,
      phone,
      onClose,
      formRef,
      rules,
      handleOk,
      pagination,
      handleChange,
      pageChange,
      handleSearch,
      handleEdit,
      roleMapName,
      handleExpand,
      handleAdd,
      handleDel
    };
  },
});
</script>