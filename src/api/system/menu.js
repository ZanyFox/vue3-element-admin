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
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeSelect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}
