import { convertObjectArrayToIndexedMap } from './convertObjectArrayToIndexedMap'

describe('convertObjectArrayToIndexedMap', () => {
  test('success with 1 unique key', () => {
    const result = convertObjectArrayToIndexedMap({
      array: [
        {
          A: 'a-1',
          B: 'b-1',
          C: 'c-1',
        },
        {
          A: 'a-2',
          B: 'b-2',
          C: 'c-2',
        },
        {
          A: 'a-3',
          B: 'b-3',
          C: 'c-3',
        },
      ],
      indexKeys: ['A'],
      isUnique: true,
    })
    if (result.hasError) {
      throw new Error(JSON.stringify(result.error))
    }
    expect(result.value).toEqual({
      'a-1': {
        A: 'a-1',
        B: 'b-1',
        C: 'c-1',
      },
      'a-2': {
        A: 'a-2',
        B: 'b-2',
        C: 'c-2',
      },
      'a-3': {
        A: 'a-3',
        B: 'b-3',
        C: 'c-3',
      },
    })
  })

  test('success with 1 key (not unique)', () => {
    const result = convertObjectArrayToIndexedMap({
      array: [
        {
          A: 'a-1-1',
          B: 'b-1-1',
          C: 'c-1-1',
        },
        {
          A: 'a-1-1',
          B: 'b-1-2',
          C: 'c-1-2',
        },
        {
          A: 'a-2-1',
          B: 'b-2-1',
          C: 'c-2-1',
        },
        {
          A: 'a-3-1',
          B: 'b-3-1',
          C: 'c-3-1',
        },
        {
          A: 'a-4-1',
          B: 'b-3-1',
          C: 'c-4-1',
        },
      ],
      indexKeys: ['A'],
      isUnique: false,
    })
    if (result.hasError) {
      throw new Error(JSON.stringify(result.error))
    }
    expect(result.value).toEqual({
      'a-1-1': [
        {
          A: 'a-1-1',
          B: 'b-1-1',
          C: 'c-1-1',
        },
        {
          A: 'a-1-1',
          B: 'b-1-2',
          C: 'c-1-2',
        },
      ],
      'a-2-1': [
        {
          A: 'a-2-1',
          B: 'b-2-1',
          C: 'c-2-1',
        },
      ],
      'a-3-1': [
        {
          A: 'a-3-1',
          B: 'b-3-1',
          C: 'c-3-1',
        },
      ],
      'a-4-1': [
        {
          A: 'a-4-1',
          B: 'b-3-1',
          C: 'c-4-1',
        },
      ],
    })
  })

  test('success with multiple unique key', () => {
    const result = convertObjectArrayToIndexedMap({
      array: [
        {
          A: 'a-1-1',
          B: 'b-1-1',
          C: 'c-1-1',
        },
        {
          A: 'a-1-1',
          B: 'b-1-2',
          C: 'c-1-2',
        },
        {
          A: 'a-2-1',
          B: 'b-2-1',
          C: 'c-2-1',
        },
        {
          A: 'a-2-1',
          B: 'b-2-2',
          C: 'c-3-1',
        },
        {
          A: 'a-3-1',
          B: 'b-3-1',
          C: 'c-3-1',
        },
        {
          A: 'a-4-1',
          B: 'b-3-1',
          C: 'c-4-1',
        },
      ],
      indexKeys: ['A', 'B'],
      isUnique: true,
    })
    if (result.hasError) {
      throw new Error(JSON.stringify(result.error))
    }
    expect(result.value).toEqual({
      'a-1-1': {
        'b-1-1': {
          A: 'a-1-1',
          B: 'b-1-1',
          C: 'c-1-1',
        },
        'b-1-2': {
          A: 'a-1-1',
          B: 'b-1-2',
          C: 'c-1-2',
        },
      },
      'a-2-1': {
        'b-2-1': {
          A: 'a-2-1',
          B: 'b-2-1',
          C: 'c-2-1',
        },
        'b-2-2': {
          A: 'a-2-1',
          B: 'b-2-2',
          C: 'c-3-1',
        },
      },
      'a-3-1': {
        'b-3-1': {
          A: 'a-3-1',
          B: 'b-3-1',
          C: 'c-3-1',
        },
      },
      'a-4-1': {
        'b-3-1': {
          A: 'a-4-1',
          B: 'b-3-1',
          C: 'c-4-1',
        },
      },
    })
  })
})
