import { Errorable, E } from '../domain/shared/Errors'

export class ActiveSheetController {
  async getSheeetName(): Promise<
    Errorable<string, E<'UnknownRuntimeError', string>>
  > {
    try {
      const activeSpreadSheet = SpreadsheetApp.getActive()
      const activeSheet = activeSpreadSheet.getActiveSheet()
      return {
        hasError: false,
        error: null,
        value: activeSheet.getName(),
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
