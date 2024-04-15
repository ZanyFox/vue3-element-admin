import request from '@/utils/request'

// 查询字典类型列表
export function getDictTypePage(query) {
  return request({
    url: '/system/dict-type/page',
    method: 'GET',
    params: query
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: '/system/dict-type/get',
    method: 'get',
    params: {
      id: dictId
    }
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/system/dict-type/create',
    method: 'POST',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/system/dict-type/update',
    method: 'PUT',
    data: data
  })
}

// 删除字典类型
export function delType(dictIds) {
  return request({
    url: '/system/dict-type/delete',
    data: dictIds,
    method: 'delete'
  })
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: '/system/dict/type/refreshCache',
    method: 'delete'
  })
}

// 获取字典选择框列表
export function getDictTypeSimpleList() {
  return request({
    url: '/system/dict-type/simple-list',
    method: 'GET'
  })
}


