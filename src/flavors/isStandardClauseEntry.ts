import type {
  TClauseEntry,
  TExtraClauseBase,
  TStandardClause,
  TStandardOperator
} from '../builders/WhereBuilderBase/types'

import { isString } from 'radashi'

export const isStandardClauseEntry = <
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>
>(
  clauseEntry: TClauseEntry<TOperator, TExtraClause>,
  extraOperators: readonly string[]
): clauseEntry is TClauseEntry<TStandardOperator, TStandardClause> => {
  return isString(clauseEntry) || !extraOperators.includes(clauseEntry[1])
}
