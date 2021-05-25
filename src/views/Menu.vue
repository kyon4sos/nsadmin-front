<template>
  <div>
    <a-card :loading="loading">
      <template #title>
        <div>
          <a-form layout="inline">
            <a-form-item>
              <a-input
                v-model:value="searchContent"
                placeholder="请输入菜单名称"
                @pressEnter="handleSearch"
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
              <a-button type="primary" @click="addModelVisiable = true">
                <template #icon><PlusOutlined /></template>
                新增
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </template>
      <a-table
        :columns="columns"
        :data-source="menus"
        rowKey="id"
        childrenColumnName="false"
        :pagination="pagination"
        @change="handleTableChange"
        :loading="tLoading"
      >
        <template #expandedRowRender="{ record }">
          <span>{{ record.remark }}</span>
        </template>
        <template
          v-for="col in [
            'name',
            'url',
            'httpMethod',
            'permission',
            'remark',
            'permissionCode',
          ]"
          #[col]="{ text, record }"
          :key="col"
        >
          <div>
            <a-input
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][col]"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template #action="{ record }">
          <div class="editable-row-operations">
            <span v-if="editableData[record.id]">
              <a-popconfirm title="确定保存" @confirm="onSave(record.id)">
                <a>保存</a>
                <a-divider type="vertical" />
              </a-popconfirm>
              <a-popconfirm title="确定取消" @confirm="onCancel(record.id)">
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="onEdit(record.id)">编辑</a>
            </span>
          </div>
        </template>
      </a-table>
    </a-card>
    <!-- 新增表单弹窗  -->
    <a-modal
      style="top: 20px"
      v-model:visible="addModelVisiable"
      :title="title"
      @ok="onAddOk"
      @close="onClose"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="menuRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        ><a-form-item label="菜单名称" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="URL" name="url">
          <a-input v-model:value="formState.url" />
        </a-form-item>
        <a-form-item label="方法" name="httpMethod">
          <a-radio-group v-model:value="formState.httpMethod">
            <a-radio value="GET">GET</a-radio>
            <a-radio value="PUT">PUT</a-radio>
            <a-radio value="DEL">DEL</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="父级菜单" name="parentId">
          <a-select
            label-in-value
            v-model:value="value"
            placeholder="请选择父级菜单"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchParentId"
          >
            <template v-if="fetching" #notFoundContent>
              <a-spin size="small" />
            </template>
            <a-select-option v-for="d in data" :key="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="权限标识" name="permission">
          <a-input v-model:value="formState.permission" />
        </a-form-item>
        <a-form-item label="权限码" name="permissionCode">
          <a-input v-model:value="formState.permissionCode" />
        </a-form-item>
        <a-form-item label="描述" name="remark">
          <a-textarea v-model:value="formState.remark" />
        </a-form-item>
        <a-form-item label="启用" name="state">
          <a-switch v-model:checked="formState.state" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import {
  defineComponent,
  onBeforeMount,
  reactive,
  ref,
  toRaw,
  toRefs,
  computed,
} from "vue";
import { sortUrl, sortFirstWord } from "@/util";
import { cloneDeep } from "lodash-es";
import { addSysMenu, getSysMenusByPage, getSysMenuByName } from "@/request";
import { message } from "ant-design-vue";
const columns = [
  {
    title: "菜单名称",
    dataIndex: "name",
    width: "160px",
    slots: {
      customRender: "name",
    },
    defaultSortOrder: "descend",
    sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
  },
  {
    title: "url",
    dataIndex: "url",
    slots: {
      customRender: "url",
    },
    defaultSortOrder: "descend",
    sorter: (a, b) => sortUrl(a.url, b.url),
  },
  {
    title: "方法",
    slots: {
      customRender: "httpMethod",
    },
    width: "100px",
    dataIndex: "httpMethod",
  },
  {
    title: "权限标识",
    dataIndex: "permission",
    width: "140px",
    slots: {
      customRender: "permission",
    },
    defaultSortOrder: "descend",
    sorter: (a, b) => sortFirstWord(a.permission, b.permission),
  },
  {
    title: "权限码",
    dataIndex: "permissionCode",
    width: "120px",
    slots: {
      customRender: "permission",
    },
    defaultSortOrder: "descend",
    sorter: (a, b) => a.permissionCode - b.permissionCode,
  },
  {
    title: "操作",
    dataIndex: "action",
    slots: { customRender: "action" },
  },
];

export default defineComponent({
  setup() {
    const loading = ref(true);
    const tLoading = ref(true);
    const addModelVisiable = ref(false);
    const searchContent = ref();
    const formRef = ref();
    const showDrawer = ref();
    const data = reactive({
      menus: [],
      pageInfo: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
    });

    const formConfig = reactive({
      title: "新增菜单",
      wrapperCol: { span: 14 },
      labelCol: { span: 4 },
    });

    const pagination = computed(() => ({
      total: data.pageInfo.total,
      current: data.pageInfo.current,
      pageSize: data.pageInfo.size,
    }));

    const editableData = reactive({});

    const menuRules = {
      name: [
        {
          required: true,
          message: "请输入菜单名称",
          trigger: "blur",
        },
        {
          min: 2,
          max: 20,
          message: "范围2-20",
          trigger: "blur",
        },
      ],
      url: [
        {
          required: true,
          message: "请输入URL",
          trigger: "blur",
        },
        {
          min: 2,
          max: 20,
          message: "范围2-20",
          trigger: "blur",
        },
      ],
      httpMethod: [
        {
          required: true,
          message: "请选择方法",
          trigger: "change",
        },
      ],
      permission: [
        {
          required: true,
          message: "请输入权限",
          trigger: "blur",
        },
      ],
      permission_code: [
        {
          required: true,
          message: "请输入权限",
          trigger: "blur",
        },
      ],
      desc: [
        {
          required: true,
          message: "请输入描述",
          trigger: "blur",
        },
      ],
    };

    const formState = reactive({
      id: "",
      url: "",
      name: "",
      httpMethod: "",
      remark: "",
      permission: "",
      permissionCode: "",
      state: true,
    });

    const handleSearch = () => {
      tLoading.value = true;
      getSysMenuByName(searchContent.value, data.pageInfo).then((res) => {
        data.pageInfo = { ...res.data };
        data.menus = res.data.records;
        tLoading.value = false;
      });
    };

    const onEdit = (id) => {
      editableData[id] = cloneDeep(
        data.menus.filter((item) => id === item.id)[0]
      );
    };

    const onSave = (id) => {
      addSysMenu(toRaw(editableData[id])).then(() => {
        initData(data.pageInfo);
      });
      delete editableData[id];
    };

    const onCancel = (id) => {
      delete editableData[id];
    };

    const onAddOk = () => {
      formRef.value
        .validate()
        .then(() => {
          let menu = toRaw(formState);
          addSysMenu(menu).then(() => {
            formRef.value.resetFields();
          });
          //
          addModelVisiable.value = false;
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    const onAddMenu = () => {};

    const resetForm = () => {
      formRef.value.resetFields();
    };
    const fetchParentId = () => {};
    const initData = (page) => {
      tLoading.value = true;
      getSysMenusByPage(page).then((res) => {
        data.pageInfo = { ...res.data };
        data.menus = res.data.records;
        loading.value = false;
        tLoading.value = false;
      });
    };
    const handleTableChange = (pageInfo) => {
      data.pageInfo = pageInfo;
      if (searchContent.value.length == 0) {
        initData(pageInfo);
        return;
      }
      handleSearch();
    };
    const onClose = () => {};

    onBeforeMount(() => {
      initData(data.pageInfo);
    });

    return {
      ...toRefs(formConfig),
      ...toRefs(data),
      addModelVisiable,
      columns,
      loading,
      onAddOk,
      formRef,
      formState,
      menuRules,
      resetForm,
      showDrawer,
      editableData,
      onClose,
      onSave,
      onCancel,
      onEdit,
      onAddMenu,
      pagination,
      handleTableChange,
      fetchParentId,
      searchContent,
      handleSearch,
      tLoading,
    };
  },
});
</script>