import { convertTableRowToObjectArray } from './convertTableRowToObjectArray'

describe('convertTableRowToObjectArray', () => {
  test('success', () => {
    const result = convertTableRowToObjectArray({
      headerConfigurations: [
        {
          name: 'test1',
          type: 'string',
          nullable: false,
        },
        {
          name: 'test2',
          type: 'string',
          nullable: false,
        },
        {
          name: 'test3',
          type: 'int',
          nullable: false,
        },
        {
          name: 'test4',
          type: 'boolean',
          nullable: false,
        },
      ],
      headerRow: ['test1', 'test2', 'test3', 'test4'],
      rows: [
        ['Test 1-1', 'Test 2-1', '1', 'True'],
        ['Test 1-2', 'Test 2-2', '2', 'TRUE'],
        ['Test 1-3', 'Test 2-3', '3', 'Yes'],
        ['Test 1-4', 'Test 2-4', '4', 'yes'],
        ['Test 1-5', 'Test 2-5', '5', 'False'],
        ['Test 1-6', 'Test 2-6', '6', 'FALSE'],
        ['Test 1-7', 'Test 2-7', '7', 'No'],
        ['Test 1-8', 'Test 2-8', '8', 'no'],
      ],
    })

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual<NonNullable<typeof result.value>>([
      {
        test1: 'Test 1-1',
        test2: 'Test 2-1',
        test3: 1,
        test4: true,
      },
      {
        test1: 'Test 1-2',
        test2: 'Test 2-2',
        test3: 2,
        test4: true,
      },
      {
        test1: 'Test 1-3',
        test2: 'Test 2-3',
        test3: 3,
        test4: true,
      },
      {
        test1: 'Test 1-4',
        test2: 'Test 2-4',
        test3: 4,
        test4: true,
      },
      {
        test1: 'Test 1-5',
        test2: 'Test 2-5',
        test3: 5,
        test4: false,
      },
      {
        test1: 'Test 1-6',
        test2: 'Test 2-6',
        test3: 6,
        test4: false,
      },
      {
        test1: 'Test 1-7',
        test2: 'Test 2-7',
        test3: 7,
        test4: false,
      },
      {
        test1: 'Test 1-8',
        test2: 'Test 2-8',
        test3: 8,
        test4: false,
      },
    ])
  })
})
