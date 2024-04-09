import useDictStore from '@/store/modules/dict'
import {getDictByByType} from '@/api/system/dict/data'

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, _) => {
      res.value[dictType] = [];
      const dictStore = useDictStore()
      const dicts = dictStore.getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        // 如果本地没有该字典类型的数据，从后端获取
        getDictByByType(dictType).then(data => {
          res.value[dictType] = data.map(p => ({
            label: p.label,
            value: p.value,
            elTagType: p.colorType,
            elTagClass: p.cssClass
          }))
          dictStore.setDict(dictType, res.value[dictType]);
        })
      }
    })
    return toRefs(res.value);
  })()
}