<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="字典名称" prop="dictType">
        <el-select v-model="queryParams.dictType" w200px>
          <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="label">
        <el-input
            v-model="queryParams.label"
            placeholder="请输入字典标签"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="数据状态" clearable style="width: 200px">
          <el-option
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['system:dict:add']"
        >新增
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="success"-->
      <!--            plain-->
      <!--            icon="Edit"-->
      <!--            :disabled="single"-->
      <!--            @click="handleUpdate"-->
      <!--            v-hasPermi="['system:dict:edit']"-->
      <!--        >修改-->
      <!--        </el-button>·-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:dict:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:dict:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Close"
            @click="handleClose"
        >关闭
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="loadDictDataPage" :search="false"/>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="字典编码" align="center" prop="id"/>
      <el-table-column label="字典标签" align="center" prop="label">
        <template #default="scope">
          <span
              v-if="(scope.row.colorType == '' || scope.row.colorType == 'default') && (scope.row.cssClass == '' || scope.row.cssClass == null)">{{
              scope.row.label
            }}</span>
          <el-tag v-else :type="scope.row.colorType == 'primary' ? '' : scope.row.colorType"
                  :class="scope.row.cssClass">{{ scope.row.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="字典键值" align="center" prop="value"/>
      <el-table-column label="字典排序" align="center" prop="order"/>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dict:edit']">
            修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:dict:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="loadDictDataPage"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dataRef" :model="dictDataFormData" :rules="dictDataFormRules" label-width="80px">
        <el-form-item label="字典类型">
          <el-input v-model="dictDataFormData.dictType" :disabled="true"/>
        </el-form-item>
        <el-form-item label="数据标签" prop="label">
          <el-input v-model="dictDataFormData.label" placeholder="请输入数据标签"/>
        </el-form-item>
        <el-form-item label="数据键值" prop="value">
          <el-input v-model="dictDataFormData.value" placeholder="请输入数据键值"/>
        </el-form-item>
        <el-form-item label="样式属性" prop="cssClass">
          <el-input v-model="dictDataFormData.cssClass" placeholder="请输入样式属性"/>
        </el-form-item>
        <el-form-item label="显示排序" prop="order">
          <el-input-number v-model="dictDataFormData.order" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="回显样式" prop="colorType">
          <el-select v-model="dictDataFormData.colorType">
            <el-option
                v-for="item in colorTypeOptions"
                :key="item.value"
                :label="item.label + '(' + item.value + ')'"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dictDataFormData.status">
            <el-radio
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="+dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dictDataFormData.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
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
import useDictStore from '@/store/modules/dict'
import {getDictTypeSimpleList, getType} from "@/api/system/dict/type";
import * as DictDataApi from '@/api/system/dict/data.js';


defineOptions({
  name: 'SysDictDataView'
})

const {proxy} = getCurrentInstance();
const {sys_normal_disable} = proxy.useDict("sys_normal_disable");

const dataList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const defaultDictType = ref("");
const typeOptions = ref([]);
const route = useRoute();
const dataRef = ref()

// 数据标签回显样式
const colorTypeOptions = ref([
  {value: "default", label: "默认"},
  {value: "primary", label: "主要"},
  {value: "success", label: "成功"},
  {value: "info", label: "信息"},
  {value: "warning", label: "警告"},
  {value: "danger", label: "危险"}
]);


const dictDataFormRules = {
  label: [{required: true, message: "数据标签不能为空", trigger: "blur"}],
  value: [{required: true, message: "数据键值不能为空", trigger: "blur"}]
}


const queryParams = reactive({
  page: 1,
  size: 10,
  dictType: undefined,
  label: undefined,
  status: undefined
})

const dictDataFormData = ref({
  id: undefined,
  label: undefined,
  value: undefined,
  cssClass: undefined,
  colorType: "default",
  order: 0,
  status: 0,
  remark: undefined
})


onMounted(async () => {

  const typeId = route.params && route.params.dictId;
  const [{type}, typeList] = await Promise.all([getType(typeId), getDictTypeSimpleList()])
  queryParams.dictType = type
  defaultDictType.value = type
  typeOptions.value = typeList
  loadDictDataPage()
})


/** 查询字典数据列表 */
async function loadDictDataPage() {
  loading.value = true;
  const data = await DictDataApi.listData(queryParams)
  dataList.value = data.list
  total.value = data.total
  loading.value = false;
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  dictDataFormData.value = {
    id: undefined,
    label: undefined,
    value: undefined,
    cssClass: undefined,
    colorType: "default",
    order: 0,
    status: 0,
    remark: undefined
  };
  proxy.resetForm("dataRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.page = 1;
  loadDictDataPage();
}

/** 返回按钮操作 */
function handleClose() {
  const obj = {path: "/system/dict"};
  proxy.$tab.closeOpenPage(obj);
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.dictType = defaultDictType.value;
  handleQuery();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加字典数据";
  dictDataFormData.value.dictType = queryParams.dictType;
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  dictDataFormData.value = await DictDataApi.getData(row.id)
  open.value = true;
  title.value = "修改字典数据";
}

/** 提交按钮 */
async function submitForm() {

  const valid = dataRef.value.validate()
  if (!valid) return

  try {
    if (dictDataFormData.value.id != undefined) {
      await DictDataApi.updateData(dictDataFormData.value)
      useDictStore().removeDict(queryParams.dictType);
      proxy.$modal.msgSuccess("修改成功");
    } else {
      await DictDataApi.addData(dictDataFormData.value)
      useDictStore().removeDict(queryParams.dictType);
      proxy.$modal.msgSuccess("新增成功");
    }
    open.value = false;
    loadDictDataPage();
  } catch (e) {

  }

}

/** 删除按钮操作 */
async function handleDelete(row) {
  const dataIds = row.id || ids.value;
  await proxy.$modal.confirm('是否确认删除字典编码为"' + ids + '"的数据项？')
  await DictDataApi.delData(Array.isArray(dataIds) ? dataIds : [dataIds])
  loadDictDataPage();
  proxy.$modal.msgSuccess("删除成功");
  useDictStore().removeDict(queryParams.dictType);
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/dict/data/export", {
    ...queryParams
  }, `dict_data_${new Date().getTime()}.xlsx`);
}

</script>
