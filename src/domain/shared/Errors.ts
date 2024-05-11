export type Errorable<T, TError> =
  | { hasError: false; value: T; error: null }
  | { hasError: true; value: null; error: TError }

export interface E<T, TMessage = string> {
  type: T
  message: TMessage
  stack?: any
  internalError?: E<any>
}

export const wrapError = <T>(internalError: E<T>, message: string): E<T> => {
  return {
    ...internalError,
    message,
    internalError,
  }
}

export const fromNativeError = <T>(
  type: T,
  error: unknown,
  message: string,
): E<T> => {
  return {
    type,
    message,
    stack: error instanceof Error ? error.stack : undefined,
    internalError: {
      type,
      message: error instanceof Error ? error.message : '',
      stack: error instanceof Error ? error.stack : undefined,
    },
  }
}

export const toPrettyString = <T>(error: E<T>) => {}
