import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/util.js";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

export const getUserPage = (params) => request({
  url: 'system/user/page',
  params: params
})

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

export const getUserDetailById = (userId) => request({
  url: 'system/user/get',
  params: {
    id: userId
  }
})

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user/create',
    method: 'POST',
    data: data
  })
}

// 修改用户
export const updateUser = (data) => request({
  url: '/system/user/update',
  method: 'PUT',
  data: data
})


// 删除用户
export const deleteUserById = (userId) => {
  return request({
    url: '/system/user/delete',
    params: {
      id: userId
    },
    method: 'delete'
  })
}

export const deleteUserBatch = (ids) => request({
  url: '/system/user/delete-batch',
  data: ids,
  method: 'DELETE'
})

// 用户密码重置
export const resetUserPwd = (id, password) => {
  const data = {
    id,
    password
  }
  return request({
    url: '/system/user/update-password',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export const changeUserStatus = (id, status) => request({
  url: '/system/user/update-status',
  method: 'put',
  data: {
    id, status
  }
})


// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/system/user/authRole/' + userId,
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  })
}


// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}


// 查询被分配某一角色的用户分页
export const getAssignedRoleUsers = (params) => request({
  url: '/system/user/assigned-role',
  params
})

export const getUnAssignedRoleUsers = (params) => request({
  url: '/system/user/unassigned-role',
  params
})

// 获取路由
export const getRoutes = () => {
  return request({
    url: '/system/user/routes',
    method: 'get'
  })
}