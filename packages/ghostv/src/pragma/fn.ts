// TODO: stop using extend here
import _extend from 'extend'

export const extend = (...objs: any[]) => _extend(true, ...objs)

export const assign = (...objs: any[]) => _extend(false, ...objs)

export const reduceDeep = (arr: any[], fn: (r: any, v: any) => any, initial: any): any => {
  let result = initial
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i]
    if (Array.isArray(value)) {
      result = reduceDeep(value, fn, result)
    } else {
      result = fn(result, value)
    }
  }
  return result
}

export const mapObject = (obj: any, fn: (k: any, v: any) => any) => Object.keys(obj).map(
  (key) => fn(key, obj[key])
).reduce(
  (acc, curr) => extend(acc, curr),
  {}
)

export const deepifyKeys = (obj: any, modules: any) => mapObject(obj,
  (key, val) => {
    const dashIndex = key.indexOf('-')
    if (dashIndex > -1 && modules[key.slice(0, dashIndex)] !== undefined) {
      const moduleData = {
        [key.slice(dashIndex + 1)]: val
      }
      return {
        [key.slice(0, dashIndex)]: moduleData
      }
    }
    return { [key]: val }
  }
)

export const flatifyKeys = (obj: any): any =>
  mapObject(obj, (mod, data) =>
    !(typeof data === 'object' && data !== null)
      ? ({ [mod]: data })
      : mapObject(flatifyKeys(data), (key, val) =>
        ({ [`${mod}-${key}`]: val })
      )
  )

export const omit = (key: any, obj: any) => mapObject(obj,
  (mod, data) => mod !== key ? ({ [mod]: data }) : {}
)
