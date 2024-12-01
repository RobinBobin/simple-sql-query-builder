import type { TWhereBuilderCallback, TWhereBuilderConstructor } from '../types'
import type { WhereBuilderBase } from '../WhereBuilderBase'
import type { TExtraClauseBase } from '../WhereBuilderBase/types'
import type { IBuilderWithWhere } from './types'

export class BuilderWithWhere<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>,
  TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>
> implements IBuilderWithWhere<TOperator, TExtraClause, TWhereBuilder>
{
  private readonly whereBuilder: TWhereBuilder

  constructor(
    WhereBuilderConstructor: TWhereBuilderConstructor<
      TOperator,
      TExtraClause,
      TWhereBuilder
    >
  ) {
    this.whereBuilder = new WhereBuilderConstructor()
  }

  toString(): string {
    return this.whereBuilder.toString()
  }

  where(
    whereBuilderCallback: TWhereBuilderCallback<
      TOperator,
      TExtraClause,
      TWhereBuilder
    >,
    shouldAdd = true
  ): this {
    if (shouldAdd) {
      whereBuilderCallback(this.whereBuilder)
    }

    return this
  }
}
