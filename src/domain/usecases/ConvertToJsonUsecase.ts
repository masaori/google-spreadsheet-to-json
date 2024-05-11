import { E, Errorable } from '../shared/Errors'
import { convertObjectArrayToIndexedMap } from './_shared/convertObjectArrayToIndexedMap'
import { convertStringToBoolean } from './_shared/convertStringToPrimitiveType'
import {
  convertTableRowToObjectArray,
  ItemType,
} from './_shared/convertTableRowToObjectArray'

export interface IActiveSheetController {
  getSheeetName(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
}

export interface ISheetDataRepository {
  getAll(
    activeSheetName: string,
  ): Promise<
    Errorable<
      string[][],
      | E<'UnknownRuntimeError'>
      | E<'DataTypeInvalidError'>
      | E<'DataShapeInvalidError'>
      | E<'SheetNotFoundError'>
    >
  >
}

export class ConvertToJsonUsecase {
  constructor(
    private activeSheetController: IActiveSheetController,
    private sheetDataRepository: ISheetDataRepository,
  ) {}

  async run(): Promise<
    Errorable<
      string,
      | E<'DataTypeInvalidError'>
      | E<'UnknownRuntimeError'>
      | E<'DataShapeInvalidError'>
      | E<'SheetNotFoundError'>
    >
  > {
    const getActiveSheetNameResult =
      await this.activeSheetController.getSheeetName()
    if (getActiveSheetNameResult.hasError) {
      return getActiveSheetNameResult
    }

    const getSheetDataResult = await this.sheetDataRepository.getAll(
      getActiveSheetNameResult.value,
    )
    if (getSheetDataResult.hasError) {
      return getSheetDataResult
    }
    const sheetData = getSheetDataResult.value
    const headerRow = sheetData[0]
    const typeConfigurationRow = sheetData[1]
    const nullableConfigurationRow = sheetData[2]
    const indexConfigurationRow = sheetData[3]

    const headerConfigurations: Parameters<
      typeof convertTableRowToObjectArray
    >[0]['headerConfigurations'] = []
    const indexKeys: string[] = []
    let isUnique: boolean = false
    for (const [headerIndex, headerName] of headerRow.entries()) {
      if (!headerName || headerName === '') {
        continue
      }
      const typeConfiguration = typeConfigurationRow[headerIndex]
      if (
        !typeConfiguration ||
        (typeConfiguration !== 'string' &&
          typeConfiguration !== 'int' &&
          typeConfiguration !== 'boolean')
      ) {
        return {
          hasError: true,
          error: {
            type: 'DataTypeInvalidError',
            message: `column type configuration must be one of (string|int|boolean)`,
          },
          value: null,
        }
      }
      let nullable: boolean = false
      if (nullableConfigurationRow[headerIndex] === '') {
        nullable = false
      } else if (nullableConfigurationRow[headerIndex] === 'nullable') {
        nullable = true
      } else {
        return {
          hasError: true,
          error: {
            type: 'DataTypeInvalidError',
            message: `nullable configuration "${nullableConfigurationRow[headerIndex]}" should be "nullable" or empty`,
          },
          value: null,
        }
      }
      headerConfigurations.push({
        name: headerName,
        type: typeConfiguration,
        nullable,
      })

      const indexConfiguration = indexConfigurationRow[headerIndex]
      if (!indexConfiguration || indexConfiguration === '') {
        continue
      }
      if (
        indexConfiguration !== 'indexKey' &&
        indexConfiguration !== 'uniqueKey'
      ) {
        return {
          hasError: true,
          error: {
            type: 'DataTypeInvalidError',
            message: `index configuration must be one of (indexKey|uniqueKey)`,
          },
          value: null,
        }
      }
      indexKeys.push(headerName)
      isUnique = isUnique || indexConfiguration === 'uniqueKey'
    }

    const rows = sheetData.slice(4, sheetData.length).filter((v) => v[0] !== '')
    const convertToArrayResult = convertTableRowToObjectArray({
      headerConfigurations,
      headerRow,
      rows,
    })
    if (convertToArrayResult.hasError) {
      return convertToArrayResult
    }

    if (indexKeys.length === 0) {
      return {
        hasError: false,
        error: null,
        value: JSON.stringify(convertToArrayResult.value, null, 2),
      }
    } else {
      const indexedMapResult = convertObjectArrayToIndexedMap({
        array: convertToArrayResult.value,
        indexKeys,
        isUnique,
      })
      if (indexedMapResult.hasError) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: indexedMapResult.error.message,
          },
          value: null,
        }
      }
      if (indexKeys.length === 1) {
        const indexKey = indexKeys[0]
        const orderArray = convertToArrayResult.value.reduce<ItemType[]>(
          (prev, current) => {
            const value = current[indexKey]
            const existing = prev.find((e) => e === value)
            if (existing) {
              return prev
            } else {
              return [...prev, value]
            }
          },
          [],
        )
        return {
          hasError: false,
          error: null,
          value: [
            JSON.stringify(orderArray, null, 2),
            JSON.stringify(indexedMapResult.value, null, 2),
          ].join('\n\n'),
        }
      } else {
        return {
          hasError: false,
          error: null,
          value: JSON.stringify(indexedMapResult.value, null, 2),
        }
      }
    }
  }
}
