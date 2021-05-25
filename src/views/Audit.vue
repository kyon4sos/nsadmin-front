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
                placeholder="请输入id名称"
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
        <template #time="{ record }">
          {{ dayjs(record.time).format("YYYY/MM/DD HH:mm:ss") }}
        </template>
        <template #expandedRowRender="{ record }">
          {{ record.data }}
        </template>
        <template #action="{ record }">
          <span>
            <a @click="handleExport(record.id)">下载</a>
          </span>
        </template>
      </a-table>
    </a-card>
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
import { getAllRecords } from "@/request";
import { cloneDeep } from "lodash-es";
import XLSX from "xlsx";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
const columns = [
  {
    title: "id",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "操作人",
    dataIndex: "username",
  },
  {
    title: "行为",
    dataIndex: "operation",
    slots: {
      customRender: "state",
    },
  },
  {
    title: "描述",
    dataIndex: "description",
  },
  {
    title: "时间",
    dataIndex: "time",
    slots: {
      customRender: "time",
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

    const handleExport = (id) => {
      let res = cloneDeep(data.table.filter((item) => item.id == id)).map((item) => {
        let obj = { ...item };
        obj.data = JSON.stringify(item.data);
        return obj;
      });

      let ws_name = "Sheet1";
      let filename = "record" + Date.now() + ".xlsx";
      let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(res);
      XLSX.utils.book_append_sheet(wb, ws, ws_name);
      XLSX.writeFile(wb, filename);
    };
    const handleAdd = () => {
      formConfig.title = "新增角色";
      drawerVisible.value = true;
    };
    const onClose = () => {
      formRef.value.resetFields();
      drawerVisible.value = false;
    };
    const handleSearch = () => {
      if (searchName.value.length == 0) {
        message.info("输入内容不能为空");
        return;
      }
      tLoading.value = true;
      getAllRecords(searchName.value, data.pageInfo).then((res) => {
        data.table = res.data.records;
        data.pageInfo = { ...res.data };
        tLoading.value = false;
      });
    };

    const pageChange = (page) => {
      data.pageInfo = page;
      if (searchName.value.length == 0) {
        initData(page);
        return;
      }
      handleSearch();
    };
    const handleExpand = (expanded, record) => {
      record.spin = true;
      const id = record.id;
      getAllRecords(id).then((res) => {
        let row = data.table.find((t) => t.id == id);
        row.sysMenus = res.data;
        record.spin = false;
      });
    };

    const initData = (pageInfo) => {
      tLoading.value = true;
      getAllRecords(pageInfo).then((res) => {
        data.table = res.data.records;
        data.pageInfo = { ...res.data };
        tLoading.value = false;
        loading.value = false;
      });
    };
    onBeforeMount(() => {
      initData();
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
      formRef,
      rules,
      handleExport,
      onClose,
      drawerVisible,
      roleRules,
      handleAdd,
      pagination,
      pageChange,
      handleSearch,
      defaultSelcet,
      dayjs,
    };
  },
});
</script>