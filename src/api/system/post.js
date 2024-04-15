import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/system/post/page',
    method: 'GET',
    params: query
  })
}


export const getSimplePostList = () => request({
  url: '/system/post/simple-list'
})

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/system/post/get',
    method: 'GET',
    params: {
      id: postId
    }
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/system/post/create',
    method: 'POST',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/system/post/update',
    method: 'PUT',
    data: data
  })
}

// 删除岗位
export function delPost(postIds) {
  return request({
    url: '/system/post/delete-batch',
    method: 'DELETE',
    data: postIds
  })
}
