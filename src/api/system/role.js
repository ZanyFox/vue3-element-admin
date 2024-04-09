import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

export const getRolePge = (params) => request({
  url: '/system/role/page',
  params
})

// 查询角色详细
export function getRoleById(roleId) {
  return request({
    url: '/system/role/get',
    method: 'get',
    params: {
      id: roleId
    }
  })
}


// 新增角色
export function addRole(data) {
  return request({
    url: '/system/role/create',
    method: 'POST',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/system/role/update',
    method: 'PUT',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

export const updateRoleDataScope = (data) => request({
  url: '/system/role/update-dept-data-scope',
  method: 'PUT',
  data
})

// 角色状态修改
export function changeRoleStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/role/update-status',
    method: 'PUT',
    data: data
  })
}

// 删除角色
export function delRole(ids) {
  return request({
    url: '/system/role/delete-batch',
    method: 'delete',
    data: ids
  })
}



// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/system/role/authUser/allocatedList',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: '/system/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/system/role/authUser/cancel',
    method: 'put',
    data: data
  })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request({
    url: '/system/role/authUser/cancelAll',
    method: 'put',
    params: data
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: data
  })
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId) {
  return request({
    url: '/system/role/deptTree/' + roleId,
    method: 'get'
  })
}


export const getSimpleRoleList = () => request({
  url: '/system/role/simple-list'
})


export const revokeUsersRole = (data) => request({
  url: '/system/role/revoke-users',
  method: 'PUT',
  data
})

export const assignUsers = (data) => request({
  url: '/system/role/assign-users',
  method: 'PUT',
  data
})