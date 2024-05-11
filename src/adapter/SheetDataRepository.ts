import { Errorable, E } from '../domain/shared/Errors'
import { convertTableRowToObjectArray } from '../domain/usecases/_shared/convertTableRowToObjectArray'

export class SheetDataRepository {
  async getAll(
    activeSheetname: string,
  ): Promise<
    Errorable<
      string[][],
      | E<'UnknownRuntimeError', string>
      | E<'SheetNotFoundError', string>
      | E<'DataShapeInvalidError'>
      | E<'DataTypeInvalidError', string>
    >
  > {
    try {
      const targetSheet =
        SpreadsheetApp.getActive().getSheetByName(activeSheetname)
      if (!targetSheet) {
        return {
          hasError: true,
          error: {
            type: 'SheetNotFoundError',
            message: `sheet with name "${activeSheetname}" not found`,
          },
          value: null,
        }
      }
      const values = targetSheet.getDataRange().getValues()

      if (values.length === 0) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'sheet has no data',
          },
          value: null,
        }
      }
      return {
        hasError: false,
        error: null,
        value: values,
      }
    } catch (e) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: JSON.stringify(e),
        },
        value: null,
      }
    }
  }
}
