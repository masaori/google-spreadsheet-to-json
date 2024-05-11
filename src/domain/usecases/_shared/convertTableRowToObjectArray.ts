import { E, Errorable } from '../../shared/Errors'
import { convertStringToBoolean } from './convertStringToPrimitiveType'

export type ItemType = string | number | boolean | null
export const convertTableRowToObjectArray = (data: {
  headerConfigurations: {
    name: string
    type: 'string' | 'int' | 'boolean'
    nullable: boolean
  }[]
  headerRow: string[]
  rows: string[][]
}): Errorable<
  { [key: string]: ItemType }[],
  E<'DataShapeInvalidError'> | E<'DataTypeInvalidError'>
> => {
  const { headerConfigurations, headerRow, rows } = data

  if (rows.length === 0) {
    return {
      hasError: false,
      error: null,
      value: [],
    }
  }

  const ret: { [key: string]: ItemType }[] = []
  for (const [i, row] of rows.entries()) {
    if (headerRow.length !== row.length) {
      return {
        hasError: true,
        error: {
          type: 'DataShapeInvalidError',
          message: `headerRow.length !== rows[${i}].length`,
        },
        value: null,
      }
    }

    let obj: { [key: string]: ItemType } = {}
    for (const [j, item] of row.entries()) {
      const columnName = headerRow[j]
      if (!columnName || columnName === '') {
        continue
      }

      const itemInfo = headerConfigurations.find((c) => c.name === columnName)
      if (!itemInfo) {
        return {
          hasError: true,
          error: {
            type: 'DataTypeInvalidError',
            message: `configuration for ${columnName} should be defined in headerConfigurations`,
          },
          value: null,
        }
      }

      let value: ItemType
      if (itemInfo.nullable && item === '') {
        value = null
      } else if (itemInfo.type === 'int') {
        value = parseInt(item, 10)
        if (isNaN(value)) {
          return {
            hasError: true,
            error: {
              type: 'DataTypeInvalidError',
              message: `rows[${i}].${JSON.stringify(
                itemInfo,
              )} should be int but ${item}`,
            },
            value: null,
          }
        }
      } else if (itemInfo.type === 'boolean') {
        if (typeof item === 'boolean') {
          value = item
        } else {
          const boolValue = convertStringToBoolean(item)
          if (boolValue.hasError) {
            return boolValue
          }
          value = boolValue.value
        }
      } else {
        value = item
      }
      obj = {
        ...obj,
        [itemInfo.name]: value,
      }
    }

    ret.push(obj)
  }

  return {
    hasError: false,
    error: null,
    value: ret,
  }
}
