<template>
  <div>
    <a-card :loading="loading">
      <template #title>
        <div>
          <a-form layout="inline">
            <a-form-item>
              <a-input
                v-model:value="searchName"
                @pressEnter="handleSearch"
                placeholder="请输入角色名称"
              >
                <template #prefix
                  ><SearchOutlined style="color: rgba(0, 0, 0, 0.25)"
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
                新增
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </template>
      <a-table
        :columns="columns"
        :data-source="table"
        rowKey="id"
        :pagination="pagination"
        @change="pageChange"
        :loading="tLoading"
        @expand="handleExpand"
      >
        <template #state="{ record }">
          <a-switch
            checked-children="启用"
            un-checked-children="禁用"
            v-model:checked="record.state"
            @change="handleStateChange(record)"
          />
        </template>
        <template #expandedRowRender="{ record }">
          <a-spin v-if="record.spin" />
          <template v-else>
            <a-empty v-if="record.sysMenus && record.sysMenus.length == 0" />
            <a-tag
              v-else
              color="green"
              v-for="menu in record.sysMenus"
              :key="menu.id"
            >
              {{ menu.name }}
            </a-tag>
          </template>
        </template>
        <template #action="{ record }">
          <span>
            <a @click="onEdit(record.id)">修改</a>
          </span>
        </template>
      </a-table>
    </a-card>
    <a-drawer
      :title="title"
      :width="720"
      :visible="drawerVisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :model="roleForm" ref="formRef" :rules="rules" layout="vertical">
        <a-row :gutter="16">
          <a-form-item label="id" name="id" hidden>
            <a-input v-model:value="roleForm.id" hidden />
          </a-form-item>
          <a-col :span="12">
            <a-form-item label="角色名称" name="name">
              <a-input
                v-model:value="roleForm.name"
                placeholder="请输入角色名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色中文名称" name="displayName">
              <a-input
                v-model:value="roleForm.displayName"
                placeholder="请输入角色中文名称"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="权限" name="menuIds">
              <a-tree-select
                v-model:value="roleForm.menuIds"
                search-placeholder="请选择权限"
                style="width: 100%"
                :tree-data="treeData"
                tree-checkable
                allow-clear
                multiple
                showSearch
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Description" name="description">
              <a-textarea
                v-model:value="roleForm.description"
                :rows="4"
                placeholder="请输入角色描述"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="状态" name="state">
              <a-switch
                checked-children="启用"
                un-checked-children="禁用"
                v-model:checked="roleForm.state"
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
        <a-button type="primary" @click="onOk">确定</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import {
  defineComponent,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
  computed,
} from "vue";
import { cloneDeep } from "lodash-es";
import {
  getRoleByPage,
  updateRole,
  getSysMenusTree,
  getRoleByName,
  getSysMenuById,
  updateRoleState,
  addRole
} from "@/request";
import { message } from "ant-design-vue";
const columns = [
  {
    title: "角色名称",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "中文名称",
    dataIndex: "displayName",
  },
  {
    title: "描述",
    dataIndex: "description",
  },
  {
    title: "状态",
    dataIndex: "state",
    slots: {
      customRender: "state",
    },
  },
  {
    title: "操作",
    slots: { customRender: "action" },
  },
];

export default defineComponent({
  setup() {
    const loading = ref(true);
    const spin = ref(true);
    const tLoading = ref(false);
    const searchName = ref("");
    const drawerVisible = ref(false);
    const formRef = ref();
    const data = reactive({
      table: [],
      pageInfo: {
        total: 0,
        current: 1,
        size: 10,
      },
    });
    const pagination = computed(() => ({
      total: data.pageInfo.total,
      current: data.pageInfo.current,
      pageSize: data.pageInfo.size,
    }));
    const roleForm = ref({
      id: "",
      name: "",
      description: "",
      menuIds: [],
      state: true,
    });
    const st = ref([]);
    // const sysMenus= ref();
    const defaultSelcet = computed(() => {
      return st;
    });
    const treeData = ref([]);
    const roleRules = {
      name: [
        {
          required: true,
          message: "请输入角色名",
        },
      ],
      displayName: [
        {
          required: true,
          message: "请输入角色中文名",
        },
      ],
      sysMenus: [
        {
          type: "array",
          required: true,
          message: "请选择权限",
        },
      ],
      description: [
        {
          required: true,
          message: "Please enter url description",
        },
      ],
    };
    const formConfig = reactive({
      title: "新增菜单",
      wrapperCol: { span: 14 },
      labelCol: { span: 4 },
    });

    const handleStateChange = (record) => {
      updateRoleState(record);
    };
    const rules = {
      name: [
        {
          required: true,
          min: 2,
          max: 20,
          message: "名称必填",
          trigger: "blur",
        },
      ],
      displayName: [
        {
          required: true,
          min: 3,
          max: 20,
          message: "请输入中文名称",
          trigger: "blur",
        },
      ],
      description: [
        {
          required: true,
          message: "请输入描述",
          trigger: "blur",
        },
      ],
    };
    const resetForm = () => {};
    const handleAdd = () => {
      formConfig.title = "新增角色";
      drawerVisible.value = true;
    };
    const onEdit = (id) => {
      formConfig.title = "编辑角色";
      const row = cloneDeep(data.table.find((item) => item.id == id));
      getSysMenuById(id).then((res) => {
        roleForm.value = row;
        roleForm.value.menuIds = res.data.map((m) => m.id);
      });
      drawerVisible.value = true;
    };
    const onClose = () => {
      formRef.value.resetFields();
      drawerVisible.value = false;
    };
    const onOk = () => {
      if( formConfig.title == "新增角色") {
        addRole(roleForm.value)
        return
      }
      formRef.value
        .validate()
        .then((res) => {
          // res.menuIds = sysMenuNames.value;
          updateRole(res).then(() => {
            formRef.value.resetFields();
            drawerVisible.value = false;
            initData(data.pageInfo);
          });
        })
        .catch((e) => {
          console.log(e);
          return;
        });
    };
    const handleSearch = () => {
      if (searchName.value.length == 0) {
        message.info("输入内容不能为空");
        return;
      }
      tLoading.value = true;
      console.log(data.pageInfo);
      getRoleByName(searchName.value, data.pageInfo).then((res) => {
        data.table = res.data.records;
        data.pageInfo = { ...res.data };
        tLoading.value = false;
      });
    };

    const pageChange = (page) => {
      data.pageInfo = page
      if (searchName.value.length == 0) {
        initData(page);
        return;
      }
      handleSearch();
    };
    const handleExpand = (expanded, record) => {
      record.spin = true;
      const id = record.id;
      getSysMenuById(id).then((res) => {
        let row = data.table.find((t) => t.id == id);
        row.sysMenus = res.data;
        record.spin = false;
      });
    };
    const listMapTree = (list) => {
      if (list instanceof Array) {
        return list.map((item) => ({
          value: item.id,
          label: item.name,
          children: listMapTree(item.children),
        }));
      }
      return [];
    };
    const initData = (pageInfo) => {
      tLoading.value = true;
      getRoleByPage(pageInfo).then((res) => {
        data.table = res.data.records;
        data.pageInfo = { ...res.data };
        tLoading.value = false;
        loading.value = false;
      });
    };
    onBeforeMount(() => {
      initData();
      getSysMenusTree().then((res) => {
        treeData.value = listMapTree(res.data);
      });
    });
    return {
      ...toRefs(data),
      ...toRefs(formConfig),
      spin,
      roleForm,
      handleExpand,
      searchName,
      treeData,
      columns,
      loading,
      tLoading,
      handleStateChange,
      formRef,
      rules,
      resetForm,
      onClose,
      onOk,
      drawerVisible,
      roleRules,
      handleAdd,
      onEdit,
      pagination,
      pageChange,
      handleSearch,
      defaultSelcet,
    };
  },
});
</script>