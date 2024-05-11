import { E, Errorable } from '../../shared/Errors'

export const convertStringToBoolean = (
  str: string,
): Errorable<boolean, E<'DataTypeInvalidError'>> => {
  const isTrue =
    str === 'TRUE' ||
    str === 'True' ||
    str === 'true' ||
    str === 'Yes' ||
    str === 'YES' ||
    str === 'yes'
  const isFalse =
    str === 'FALSE' ||
    str === 'False' ||
    str === 'false' ||
    str === 'No' ||
    str === 'NO' ||
    str === 'no'
  if (!isTrue && !isFalse) {
    return {
      hasError: true,
      error: {
        type: 'DataTypeInvalidError',
        message: `convertStringToBoolean: given string ${str} should be one of (TRUE|True|true|Yes|YES|yes|FALSE|False|false|No|NO|no)`,
      },
      value: null,
    }
  }
  return {
    hasError: false,
    error: null,
    value: isTrue,
  }
}
