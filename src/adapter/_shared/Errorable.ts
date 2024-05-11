import { Errorable, E } from '../../domain/shared/Errors'

export const columnNotFoundErrorable = <T>(
  columnName: string,
): Errorable<T, E<'UnknownRuntimeError'>> => ({
  hasError: true,
  error: {
    type: 'UnknownRuntimeError',
    message: `column "${columnName}" not found in "AdministratorDistricts in Backend Server" sheet`,
  },
  value: null,
})
