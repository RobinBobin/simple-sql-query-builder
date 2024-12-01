import { ConditionalArray } from '../../../helpers/ConditionalArray'

export const toType = (
  value: number,
  type: string,
  isArray: boolean,
  addParentheses: boolean
): string => {
  return new ConditionalArray()
    .push('(', addParentheses)
    .push(value.toString())
    .push(')', addParentheses)
    .push('::')
    .push(type)
    .push('[]', isArray)
    .toString()
}
