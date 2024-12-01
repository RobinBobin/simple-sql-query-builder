import type { TWhereBuilderCallback } from '../types'
import type { WhereBuilderBase } from '../WhereBuilderBase'
import type { TExtraClauseBase } from '../WhereBuilderBase/types'

interface IBuilderWithWhere<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>,
  TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>
> {
  where: (
    callback: TWhereBuilderCallback<TOperator, TExtraClause, TWhereBuilder>,
    shouldAdd?: boolean
  ) => void
}

export type { IBuilderWithWhere }
