import request from '@/utils/request'

const MENU_API_PREFIX = '/system/menu'

// 查询菜单列表
export function getMenuList(query) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: query
  })
}

export const getSimpleMenuList = () => request({
  url: `${MENU_API_PREFIX}/simple-list`
})

export const getMenuIdsByRoleId = (roleId) => request({
  url: `${MENU_API_PREFIX}/list-by-role`,
  params: {
    roleId
  }
})

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/get',
    method: 'get',
    params: {
      id: menuId
    }
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'GET'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeSelect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'GET'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu/create',
    method: 'POST',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu/update',
    method: 'PUT',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/system/menu/delete',
    method: 'delete',
    params: {
      id: menuId
    }
  })
}
