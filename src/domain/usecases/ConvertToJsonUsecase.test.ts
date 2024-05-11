import { E, Errorable } from '../shared/Errors'
import {
  ConvertToJsonUsecase,
  IActiveSheetController,
  ISheetDataRepository,
} from './ConvertToJsonUsecase'

describe('ConvertToJsonUsecase', () => {
  test('success with no index key', async () => {
    const activeSheetController: IActiveSheetController = {
      getSheeetName: jest.fn(async function (): Promise<
        Errorable<string, E<'UnknownRuntimeError', string>>
      > {
        return {
          hasError: false,
          error: null,
          value: 'lessons',
        }
      }),
    }
    const sheetDataRepository: ISheetDataRepository = {
      getAll: jest.fn(async function (
        sheetName: string,
      ): Promise<
        Errorable<
          string[][],
          E<'UnknownRuntimeError', string> | E<'DataTypeInvalidError', string>
        >
      > {
        return {
          hasError: false,
          error: null,
          value: [
            ['id', 'projectName', 'scenarioName', 'name', 'maxStarCount'],
            ['string', 'string', 'string', 'string', 'int'],
            ['', 'nullable', '', '', ''],
            ['', '', '', '', ''],
            [
              'lesson-id-1',
              'lesson-projectName-1',
              'lesson-scenarioName-1',
              'lesson-name-1',
              '1',
            ],
            [
              // will be ignored
              '',
              '',
              '',
              '',
              '',
            ],
            [
              'lesson-id-2',
              'lesson-projectName-2',
              'lesson-scenarioName-2',
              'lesson-name-2',
              '2',
            ],
            [
              'lesson-id-3',
              '', // will be null
              '', // will be empty string
              'lesson-name-3',
              '3',
            ],
          ],
        }
      }),
    }

    const usecase = new ConvertToJsonUsecase(
      activeSheetController,
      sheetDataRepository,
    )

    const result = await usecase.run()
    if (result.hasError) {
      throw new Error(JSON.stringify(result.error))
    }
    expect(result.value).toEqual(
      `[
  {
    "id": "lesson-id-1",
    "projectName": "lesson-projectName-1",
    "scenarioName": "lesson-scenarioName-1",
    "name": "lesson-name-1",
    "maxStarCount": 1
  },
  {
    "id": "lesson-id-2",
    "projectName": "lesson-projectName-2",
    "scenarioName": "lesson-scenarioName-2",
    "name": "lesson-name-2",
    "maxStarCount": 2
  },
  {
    "id": "lesson-id-3",
    "projectName": null,
    "scenarioName": "",
    "name": "lesson-name-3",
    "maxStarCount": 3
  }
]`,
    )
  })

  test('success with unique index', async () => {
    const activeSheetController: IActiveSheetController = {
      getSheeetName: jest.fn(async function (): Promise<
        Errorable<string, E<'UnknownRuntimeError', string>>
      > {
        return {
          hasError: false,
          error: null,
          value: 'lessons',
        }
      }),
    }
    const sheetDataRepository: ISheetDataRepository = {
      getAll: jest.fn(async function (
        sheetName: string,
      ): Promise<
        Errorable<
          string[][],
          E<'UnknownRuntimeError', string> | E<'DataTypeInvalidError', string>
        >
      > {
        return {
          hasError: false,
          error: null,
          value: [
            ['id', 'projectName', 'scenarioName', 'name', 'maxStarCount'],
            ['string', 'string', 'string', 'string', 'int'],
            ['', '', '', '', ''],
            ['uniqueKey', '', '', '', ''],
            [
              'lesson-id-1',
              'lesson-projectName-1',
              'lesson-scenarioName-1',
              'lesson-name-1',
              '1',
            ],
            [
              // will be ignored
              '',
              '',
              '',
              '',
              '',
            ],
            [
              'lesson-id-2',
              'lesson-projectName-2',
              'lesson-scenarioName-2',
              'lesson-name-2',
              '2',
            ],
          ],
        }
      }),
    }

    const usecase = new ConvertToJsonUsecase(
      activeSheetController,
      sheetDataRepository,
    )

    const result = await usecase.run()
    if (result.hasError) {
      throw new Error(JSON.stringify(result.error))
    }
    expect(result.value).toEqual(
      // order array will appear only when only 1 indexKey specified
      `[
  "lesson-id-1",
  "lesson-id-2"
]

{
  "lesson-id-1": {
    "id": "lesson-id-1",
    "projectName": "lesson-projectName-1",
    "scenarioName": "lesson-scenarioName-1",
    "name": "lesson-name-1",
    "maxStarCount": 1
  },
  "lesson-id-2": {
    "id": "lesson-id-2",
    "projectName": "lesson-projectName-2",
    "scenarioName": "lesson-scenarioName-2",
    "name": "lesson-name-2",
    "maxStarCount": 2
  }
}`,
    )
  })

  test('success with multiple unique index key', async () => {
    const activeSheetController: IActiveSheetController = {
      getSheeetName: jest.fn(async function (): Promise<
        Errorable<string, E<'UnknownRuntimeError', string>>
      > {
        return {
          hasError: false,
          error: null,
          value: 'lessons',
        }
      }),
    }
    const sheetDataRepository: ISheetDataRepository = {
      getAll: jest.fn(async function (
        sheetName: string,
      ): Promise<
        Errorable<
          string[][],
          E<'UnknownRuntimeError', string> | E<'DataTypeInvalidError', string>
        >
      > {
        return {
          hasError: false,
          error: null,
          value: [
            ['id', 'projectName', 'scenarioName', 'name', 'maxStarCount'],
            ['string', 'string', 'string', 'string', 'int'],
            ['', '', '', '', ''],
            ['', 'uniqueKey', 'uniqueKey', '', ''],
            [
              'lesson-id-1',
              'lesson-projectName-1',
              'lesson-scenarioName-1',
              'lesson-name-1',
              '1',
            ],
            [
              // will be ignored
              '',
              '',
              '',
              '',
              '',
            ],
            [
              'lesson-id-2',
              'lesson-projectName-2',
              'lesson-scenarioName-2',
              'lesson-name-2',
              '2',
            ],
            [
              'lesson-id-3',
              'lesson-projectName-2',
              'lesson-scenarioName-3',
              'lesson-name-3',
              '3',
            ],
          ],
        }
      }),
    }

    const usecase = new ConvertToJsonUsecase(
      activeSheetController,
      sheetDataRepository,
    )

    const result = await usecase.run()
    if (result.hasError) {
      throw new Error(JSON.stringify(result.error))
    }
    expect(result.value).toEqual(
      // order array will appear only when only 1 indexKey specified
      `{
  "lesson-projectName-1": {
    "lesson-scenarioName-1": {
      "id": "lesson-id-1",
      "projectName": "lesson-projectName-1",
      "scenarioName": "lesson-scenarioName-1",
      "name": "lesson-name-1",
      "maxStarCount": 1
    }
  },
  "lesson-projectName-2": {
    "lesson-scenarioName-2": {
      "id": "lesson-id-2",
      "projectName": "lesson-projectName-2",
      "scenarioName": "lesson-scenarioName-2",
      "name": "lesson-name-2",
      "maxStarCount": 2
    },
    "lesson-scenarioName-3": {
      "id": "lesson-id-3",
      "projectName": "lesson-projectName-2",
      "scenarioName": "lesson-scenarioName-3",
      "name": "lesson-name-3",
      "maxStarCount": 3
    }
  }
}`,
    )
  })

  test('success with n:n data structure', async () => {
    const activeSheetController: IActiveSheetController = {
      getSheeetName: jest.fn(async function (): Promise<
        Errorable<string, E<'UnknownRuntimeError', string>>
      > {
        return {
          hasError: false,
          error: null,
          value: 'lessons',
        }
      }),
    }
    const sheetDataRepository: ISheetDataRepository = {
      getAll: jest.fn(async function (
        sheetName: string,
      ): Promise<
        Errorable<
          string[][],
          E<'UnknownRuntimeError', string> | E<'DataTypeInvalidError', string>
        >
      > {
        return {
          hasError: false,
          error: null,
          value: [
            ['entityAId', 'entityBId'],
            ['string', 'string'],
            ['', ''],
            ['indexKey', ''],
            ['entity-a-id-1', 'entity-b-id-1'],
            [
              // will be ignored
              '',
              '',
            ],
            ['entity-a-id-1', 'entity-b-id-2'],
            ['entity-a-id-1', 'entity-b-id-3'],
            ['entity-a-id-2', 'entity-b-id-1'],
          ],
        }
      }),
    }

    const usecase = new ConvertToJsonUsecase(
      activeSheetController,
      sheetDataRepository,
    )

    const result = await usecase.run()
    if (result.hasError) {
      throw new Error(JSON.stringify(result.error))
    }
    expect(result.value).toEqual(
      // order array will appear only when only 1 indexKey specified
      `[
  "entity-a-id-1",
  "entity-a-id-2"
]

{
  "entity-a-id-1": [
    {
      "entityAId": "entity-a-id-1",
      "entityBId": "entity-b-id-1"
    },
    {
      "entityAId": "entity-a-id-1",
      "entityBId": "entity-b-id-2"
    },
    {
      "entityAId": "entity-a-id-1",
      "entityBId": "entity-b-id-3"
    }
  ],
  "entity-a-id-2": [
    {
      "entityAId": "entity-a-id-2",
      "entityBId": "entity-b-id-1"
    }
  ]
}`,
    )
  })
})
