<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptName">
        <el-input
            v-model="queryParams.deptName"
            placeholder="请输入部门名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable style="width: 200px">
          <el-option
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="+dict.label"
              :value="+dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>

        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['system:dept:add']"
        >新增
        </el-button>

        <el-button
            type="info"
            plain
            icon="Sort"
            @click="toggleExpandAll"
        >展开/折叠
        </el-button>
        <el-button circle icon="Refresh" @click="getList"/>

      </el-form-item>
    </el-form>

    <!--    <el-row :gutter="10" class="mb8">-->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--            type="primary"-->
    <!--            plain-->
    <!--            icon="Plus"-->
    <!--            @click="handleAdd"-->
    <!--            v-hasPermi="['system:dept:add']"-->
    <!--        >新增-->
    <!--        </el-button>-->
    <!--      </el-col>-->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--            type="info"-->
    <!--            plain-->
    <!--            icon="Sort"-->
    <!--            @click="toggleExpandAll"-->
    <!--        >展开/折叠-->
    <!--        </el-button>-->
    <!--      </el-col>-->

    <!--      <el-col :span="1.5">-->
    <!--        <el-button circle icon="Refresh" @click="getList"/>-->
    <!--      </el-col>-->
    <!--&lt;!&ndash;      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>&ndash;&gt;-->
    <!--    </el-row>-->

    <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="deptList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
      <el-table-column prop="order" label="排序" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">
            修改
          </el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['system:dept:add']">
            新增
          </el-button>
          <el-button v-if="scope.row.parentId != 0" link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:dept:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="deptRef" :model="deptFormData" :rules="deptFormRule" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="deptFormData.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <el-tree-select
                  v-model="deptFormData.parentId"
                  :data="deptOptions"
                  :props="{ value: 'id', label: 'deptName', children: 'children' }"
                  value-key="id"
                  placeholder="选择上级部门"
                  check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="deptFormData.deptName" placeholder="请输入部门名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="order">
              <el-input-number v-model="deptFormData.order" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="deptFormData.leader" placeholder="请输入负责人" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="deptFormData.mobile" placeholder="请输入联系电话" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="deptFormData.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="deptFormData.status">
                <el-radio
                    v-for="dict in sys_normal_disable"
                    :key="dict.value"
                    :label="+dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>

import * as DeptApi from '@/api/system/dept.js';


defineOptions({
  name: 'SysDeptView'
})

const {proxy} = getCurrentInstance();
const {sys_normal_disable} = proxy.useDict("sys_normal_disable");

const deptList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const deptOptions = ref([]);
const isExpandAll = ref(true);
const refreshTable = ref(true);


const queryParams = reactive({
  deptName: undefined,
  status: undefined
})

const deptFormRule = reactive({
  parentId: [{required: true, message: "上级部门不能为空", trigger: "blur"}],
  deptName: [{required: true, message: "部门名称不能为空", trigger: "blur"}],
  order: [{required: true, message: "显示排序不能为空", trigger: "blur"}],
  email: [{type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"]}],
  mobile: [{pattern: /^1[3|456789][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur"}]
})

const deptFormData = ref({
  id: undefined,
  parentId: undefined,
  deptName: undefined,
  order: 0,
  leader: undefined,
  mobile: undefined,
  email: undefined,
  status: 0
})

onMounted(() => getList())

/** 查询部门列表 */
function getList() {
  loading.value = true;
  DeptApi.listDept(queryParams.value).then(data => {
    deptList.value = proxy.handleTree(data);
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  deptFormData.value = {
    id: undefined,
    parentId: undefined,
    deptName: undefined,
    order: 0,
    leader: undefined,
    mobile: undefined,
    email: undefined,
    status: 0
  };
  proxy.resetForm("deptRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  DeptApi.listDept().then(data => {
    deptOptions.value = proxy.handleTree(data);
  });
  if (row != undefined) {
    deptFormData.value.parentId = row.id;
  }
  open.value = true;
  title.value = "添加部门";
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  const depts = await DeptApi.getDeptSimpleList()
  if (depts && Array.isArray(depts)) {
    let i = depts.indexOf(row.id)
    if (i !== -1)
      depts.splice(i, 1)
  }
  deptOptions.value = proxy.handleTree(depts);

  // listDeptExcludeChild(row.id).then(response => {
  //   deptOptions.value = proxy.handleTree(response.data, "id");
  // });
  DeptApi.getDept(row.id).then(data => {
    deptFormData.value = data;
    open.value = true;
    title.value = "修改部门";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["deptRef"].validate(valid => {
    if (valid) {
      if (deptFormData.value.id != undefined) {
        // 如果修改的是公司信息，那么不上传父部门id
        if (deptFormData.value.parentId === 0)
          deptFormData.value.parentId = undefined
        DeptApi.updateDept(deptFormData.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        DeptApi.addDept(deptFormData.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项?').then(function () {
    return DeptApi.delDept(row.id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

</script>
