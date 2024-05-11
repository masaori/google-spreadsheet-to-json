import { convertStringToBoolean } from './convertStringToPrimitiveType'

describe('convertStringToBoolean', () => {
  test.each`
    str        | value    | hasError
    ${'TRUE'}  | ${true}  | ${false}
    ${'True'}  | ${true}  | ${false}
    ${'true'}  | ${true}  | ${false}
    ${'Yes'}   | ${true}  | ${false}
    ${'yes'}   | ${true}  | ${false}
    ${'YES'}   | ${true}  | ${false}
    ${'FALSE'} | ${false} | ${false}
    ${'False'} | ${false} | ${false}
    ${'false'} | ${false} | ${false}
    ${'No'}    | ${false} | ${false}
    ${'no'}    | ${false} | ${false}
    ${'NO'}    | ${false} | ${false}
    ${'TUER'}  | ${null}  | ${true}
    ${'fAlSe'} | ${null}  | ${true}
    ${''}      | ${null}  | ${true}
  `('str $str value $value hasError $hasError', ({ str, value, hasError }) => {
    const result = convertStringToBoolean(str)
    if (!hasError && result.hasError) {
      throw new Error(JSON.stringify(result.error))
    }
    expect(result.value).toEqual(value)
  })
})
