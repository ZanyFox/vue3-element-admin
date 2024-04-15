import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/get',
    method: 'get',
    params: {
      id: deptId
    }
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept/create',
    method: 'POST',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept/update',
    method: 'PUT',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/dept/delete',
    method: 'delete',
    params: {
      id: deptId
    }
  })
}

export const getDeptSimpleList = () => request({
  url: 'system/dept/simple-list'
})

export const getDeptTree = () => request({
  url: 'system/dept/tree'
})


export const getDeptListByRoleId = (roleId) => request({
  url: '/system/dept/list-by-role',
  params: {
    roleId
  }
})