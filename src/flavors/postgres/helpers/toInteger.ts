import { toType } from './toType'

export const toInteger = (
  value: number,
  isArray: boolean,
  addParentheses: boolean
): string => {
  return toType(value, 'integer', isArray, addParentheses)
}
