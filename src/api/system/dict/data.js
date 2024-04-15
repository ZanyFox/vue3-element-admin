import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/system/dict-data/page',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictDataId) {
  return request({
    url: '/system/dict-data/get',
    method: 'GET',
    params: {
      id: dictDataId
    }
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

export const getDictByByType = (type) => request({
  url: '/system/dict-data/get-by-type',
  params: {
    type
  }
})


// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/dict-data/create',
    method: 'POST',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/dict-data/update',
    method: 'PUT',
    data: data
  })
}

// 删除字典数据
export function delData(ids) {
  return request({
    url: '/system/dict-data/delete-batch',
    method: 'DELETE',
    data: ids
  })
}
