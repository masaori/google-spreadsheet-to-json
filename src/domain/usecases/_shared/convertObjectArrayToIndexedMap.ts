import { E, Errorable } from '../../shared/Errors'

type Obj = { [key: string]: unknown }
type Indexed =
  | Obj
  | Obj[]
  | {
      [key: string]: Obj | Obj[] | Indexed
    }
export const convertObjectArrayToIndexedMap = (
  config: {
    array: Obj[]
    indexKeys: string[]
    isUnique: boolean
  },
  targetValues: { [key: string]: unknown } = {},
): Errorable<
  Indexed,
  E<'NoKeySpecifiedError'> | E<'KeyNotFoundError'> | E<'UnknownRuntimeError'>
> => {
  const { array, indexKeys, isUnique } = config
  const correspondingObjs = array.filter((e) => {
    let isMatched = true
    for (const indexKey of Object.keys(targetValues)) {
      isMatched = isMatched && e[indexKey] === targetValues[indexKey]
    }
    return isMatched
  })
  if (indexKeys.length === 0) {
    if (correspondingObjs.length === 0) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `obj for ${JSON.stringify(targetValues)} not exist somehow`,
        },
        value: null,
      }
    }
    if (isUnique && correspondingObjs.length > 1) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `isUnique specified but multiple object detected ${JSON.stringify(
            correspondingObjs,
          )}`,
        },
        value: null,
      }
    }
    return {
      hasError: false,
      error: null,
      value: isUnique ? correspondingObjs[0] : correspondingObjs,
    }
  } else {
    const currentIndexKey = indexKeys[0]
    const currentTargetValues = Array.from(
      new Set(correspondingObjs.map((e) => e[currentIndexKey])),
    )
    const ret: Indexed = {}
    for (const targetValue of currentTargetValues) {
      const childObj = convertObjectArrayToIndexedMap(
        {
          array: correspondingObjs,
          indexKeys: [...indexKeys].slice(1),
          isUnique,
        },
        {
          ...targetValues,
          [currentIndexKey]: targetValue,
        },
      )
      if (childObj.hasError) {
        return childObj
      }
      if (typeof targetValue === 'number' || typeof targetValue === 'boolean') {
        ret[targetValue.toString()] = childObj.value
      } else if (typeof targetValue === 'string') {
        ret[targetValue] = childObj.value
      } else {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: `unknown value type detected ${typeof targetValue}`,
          },
          value: null,
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: ret,
    }
  }
}
