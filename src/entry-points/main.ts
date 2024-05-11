import { escape } from 'html-escaper'

import { Errorable } from '../domain/shared/Errors'
import { ConvertToJsonUsecase } from '../domain/usecases/ConvertToJsonUsecase'
import { ActiveSheetController } from '../adapter/ActiveSheetController'
import { SheetDataRepository } from '../adapter/SheetDataRepository'

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Convert to JSON')
    .addItem('Convert to JSON', 'convertToJson')
    .addToUi()
}

const showError = <T>(errorable: Errorable<T, any>) => {
  if (!errorable.error) {
    return
  }

  try {
    SpreadsheetApp.getUi().showModelessDialog(
      HtmlService.createHtmlOutput(
        `<p>Please contact App Script administrator 🙏</p>
        <p>Error: ${errorable.error.type}</p>
        <p>${JSON.stringify(errorable.error.message, null, 2)}</p>
        <p>${JSON.stringify(errorable.error.internalError, null, 2)}</p>
        `,
      ).setWidth(1024),
      'Sorry, something wrong!',
    )
  } catch {
    console.error(errorable.error.type)
    console.error(JSON.stringify(errorable.error.message, null, 2))
    console.error(JSON.stringify(errorable.error.internalError, null, 2))
  }
}

async function convertToJson() {
  const activeSheetController = new ActiveSheetController()
  const sheetDataRepository = new SheetDataRepository()
  const usecase = new ConvertToJsonUsecase(
    activeSheetController,
    sheetDataRepository,
  )

  const result = await usecase.run()

  if (result.hasError) {
    showError(result)
    return
  }

  try {
    const activeSheet = SpreadsheetApp.getActiveSheet()
    SpreadsheetApp.getUi().showModelessDialog(
      HtmlService.createHtmlOutput(
        `<pre>${escape(result.value)}</pre>`,
      ).setWidth(1024),
      activeSheet.getName(),
    )
  } catch {
    console.error('failed to show result json')
  }
}
