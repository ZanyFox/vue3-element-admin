<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入菜单名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable style="width: 200px">
          <el-option
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="+dict.label"
              :value="+dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="loadMenuPage">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['system:menu:add']"
        >新增
        </el-button>

        <el-button
            type="info"
            plain
            icon="Sort"
            @click="toggleExpandAll"
        >展开/折叠
        </el-button>
        <el-button circle icon="Refresh" @click="loadMenuPage"/>
      </el-form-item>
    </el-form>

    <!--    <el-row :gutter="10" class="mb8">-->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--            type="primary"-->
    <!--            plain-->
    <!--            icon="Plus"-->
    <!--            @click="handleAdd"-->
    <!--            v-hasPermi="['system:menu:add']"-->
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
    <!--        <el-button circle icon="Refresh" @click="loadMenuPage" />-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60"></el-table-column>
      <el-table-column prop="perm" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:menu:edit']">
            修改
          </el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['system:menu:add']">
            新增
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:menu:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="680px" append-to-body>
      <el-form ref="menuRef" :model="menuFormData" :rules="menuFormRules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-tree-select
                  v-model="menuFormData.parentId"
                  :data="menuOptions"
                  :props="{ value: 'id', label: 'name', children: 'children' }"
                  value-key="id"
                  placeholder="选择上级菜单"
                  check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="menuFormData.type">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="2">菜单</el-radio>
                <el-radio :label="3">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="menuFormData.type !== 3">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                  placement="bottom-start"
                  :width="540"
                  trigger="click"
              >
                <template #reference>
                  <el-input v-model="menuFormData.icon" placeholder="点击选择图标" @blur="showSelectIcon" readonly>
                    <template #prefix>
                      <svg-icon
                          v-if="menuFormData.icon"
                          :icon-class="menuFormData.icon"
                          class="el-input__icon"
                          style="height: 32px;width: 16px;"
                      />
                      <el-icon v-else style="height: 32px;width: 16px;">
                        <search/>
                      </el-icon>
                    </template>
                  </el-input>
                </template>
                <icon-select ref="iconSelectRef" @selected="selected" :active-icon="menuFormData.icon"/>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="menuFormData.name" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="menuFormData.sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuFormData.type !== 3">
            <el-form-item>
              <template #label>
                        <span>
                           <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                              <el-icon><question-filled/></el-icon>
                           </el-tooltip>是否外链
                        </span>
              </template>
              <el-radio-group v-model="menuFormData.isFrame">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuFormData.type !== 3">
            <el-form-item prop="path">
              <template #label>
                        <span>
                           <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                                       placement="top">
                              <el-icon><question-filled/></el-icon>
                           </el-tooltip>
                           路由地址
                        </span>
              </template>
              <el-input v-model="menuFormData.path" placeholder="请输入路由地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuFormData.type == 2">
            <el-form-item prop="component">
              <template #label>
                        <span>
                           <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                                       placement="top">
                              <el-icon><question-filled/></el-icon>
                           </el-tooltip>
                           组件路径
                        </span>
              </template>
              <el-input v-model="menuFormData.component" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuFormData.type !== 1">
            <el-form-item>
              <el-input v-model="menuFormData.perm" placeholder="请输入权限标识" maxlength="100"/>
              <template #label>
                        <span>
                           <el-tooltip
                               content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                               placement="top">
                              <el-icon><question-filled/></el-icon>
                           </el-tooltip>
                           权限字符
                        </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuFormData.type == 2">
            <el-form-item>
              <el-input v-model="menuFormData.query" placeholder="请输入路由参数" maxlength="255"/>
              <template #label>
                        <span>
                           <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                              <el-icon><question-filled/></el-icon>
                           </el-tooltip>
                           路由参数
                        </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuFormData.type == 2">
            <el-form-item>
              <template #label>
                        <span>
                           <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                                       placement="top">
                              <el-icon><question-filled/></el-icon>
                           </el-tooltip>
                           是否缓存
                        </span>
              </template>
              <el-radio-group v-model="menuFormData.isCache">
                <el-radio :label="true">缓存</el-radio>
                <el-radio :label="false">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuFormData.type !== 3">
            <el-form-item>
              <template #label>
                        <span>
                           <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                              <el-icon><question-filled/></el-icon>
                           </el-tooltip>
                           显示状态
                        </span>
              </template>
              <el-radio-group v-model="menuFormData.visible">
                <el-radio :label="true">显示</el-radio>
                <el-radio :label="false">隐藏</el-radio>
<!--                <el-radio-->
<!--                    v-for="dict in sys_show_hide"-->
<!--                    :key="dict.value"-->
<!--                    :label="dict.value"-->
<!--                >{{ dict.label }}-->
<!--                </el-radio>-->
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <template #label>
                        <span>
                           <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                              <el-icon><question-filled/></el-icon>
                           </el-tooltip>
                           菜单状态
                        </span>
              </template>
              <el-radio-group v-model="menuFormData.status">
                <el-radio
                    v-for="dict in sys_normal_disable"
                    :key="+dict.value"
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
import {addMenu, delMenu, getMenu, getMenuList, updateMenu} from "@/api/system/menu";
import * as MenuApi from '@/api/system/menu.js';
import {handleTree} from "@/utils/util.js";

import SvgIcon from "@/components/SvgIcon/SvgIcon.vue";
import IconSelect from "@/components/IconSelect/index.vue";

defineOptions({
  name: 'SysMenuView'
})


const {proxy} = getCurrentInstance();
const {sys_show_hide, sys_normal_disable} = proxy.useDict("sys_show_hide", "sys_normal_disable");

const menuList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const menuOptions = ref([]);
const isExpandAll = ref(false);
const refreshTable = ref(true);
const iconSelectRef = ref(null);
const menuRef = ref()

const menuFormData = ref({
  id: undefined,
  parentId: 0,
  type: 1,
  name: undefined,
  icon: undefined,
  perm: undefined,
  menuType: "M",
  sort: undefined,
  isFrame: false,
  isCache: true,
  visible: true,
  status: 0
})

const queryParams = reactive({
  name: undefined,
  visible: undefined
})


const menuFormRules = reactive({
  name: [{required: true, message: "菜单名称不能为空", trigger: "blur"}],
  sort: [{required: true, message: "菜单顺序不能为空", trigger: "blur"}],
  path: [{required: true, message: "路由地址不能为空", trigger: "blur"}]
})

onMounted(() => loadMenuPage())

/** 查询菜单列表 */
async function loadMenuPage() {
  loading.value = true
  menuList.value = handleTree(await getMenuList(queryParams))
  loading.value = false
}

/** 查询菜单下拉树结构 */
function getTreeSelect() {
  menuOptions.value = [];
  getMenuList().then(data => {
    const menu = {id: 0, name: "主类目", children: []};
    menu.children = proxy.handleTree(data);
    menuOptions.value.push(menu);
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  menuFormData.value = {
    id: undefined,
    parentId: 0,
    name: undefined,
    icon: undefined,
    type: 1,
    menuType: "M",
    sort: undefined,
    isFrame: false,
    isCache: true,
    visible: true,
    status: 0
  };
  proxy.resetForm("menuRef");
}

/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset();
}

/** 选择图标 */
function selected(name) {
  menuFormData.value.icon = name;
}

/** 搜索按钮操作 */
const handleQuery = () => loadMenuPage();


/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  loadMenuPage();
}

/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  getTreeSelect();
  if (row != null && row.id) {
    menuFormData.value.parentId = row.id;
  } else {
    menuFormData.value.parentId = 0;
  }
  open.value = true;
  title.value = "添加菜单";
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
  await getTreeSelect();
  getMenu(row.id).then(data => {
    menuFormData.value = data;
    open.value = true;
    title.value = "修改菜单";
  });
}

/** 提交按钮 */
async function submitForm() {

  const valid = await menuRef.value.validate()
  if (!valid) return

  try {
    if (menuFormData.value.id != undefined) {
      await MenuApi.updateMenu(menuFormData.value)
      proxy.$modal.msgSuccess("修改成功");
    } else {
      await MenuApi.addMenu(menuFormData.value)
      proxy.$modal.msgSuccess("新增成功");
    }
    loadMenuPage();
  } finally {
    open.value = false;
  }


  // proxy.$refs["menuRef"].validate(valid => {
  //   if (valid) {
  //     if (menuFormData.value.id != undefined) {
  //       updateMenu(menuFormData.value).then(response => {
  //         proxy.$modal.msgSuccess("修改成功");
  //         open.value = false;
  //         loadMenuPage();
  //       });
  //     } else {
  //       addMenu(menuFormData.value).then(response => {
  //         proxy.$modal.msgSuccess("新增成功");
  //         open.value = false;
  //         loadMenuPage();
  //       });
  //     }
  //   }
  // })
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项?').then(function () {
    return delMenu(row.id);
  }).then(() => {
    loadMenuPage();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

</script>
