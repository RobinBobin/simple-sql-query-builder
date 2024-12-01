import type { ISqlFlavorOptions } from '../../../flavors/types'
import type {
  TWhereBuilderCallback,
  TWhereBuilderConstructor
} from '../../types'
import type { WhereBuilderBase } from '../../WhereBuilderBase'
import type { TExtraClauseBase } from '../../WhereBuilderBase/types'
import type { IBuilderWithWhere } from '../types'

import { InsertBuilderBase } from '../../InsertBuilderBase'
import { BuilderWithWhere } from '../BuilderWithWhere'
import { PairArrayStringifier } from './PairArrayStringifier'

export class UpdateBuilderBase<
    TOperator extends string,
    TExtraClause extends TExtraClauseBase<TOperator>,
    TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>
  >
  extends InsertBuilderBase
  implements IBuilderWithWhere<TOperator, TExtraClause, TWhereBuilder>
{
  private readonly builderWithWhere: BuilderWithWhere<
    TOperator,
    TExtraClause,
    TWhereBuilder
  >

  constructor(
    WhereBuilderConstructor: TWhereBuilderConstructor<
      TOperator,
      TExtraClause,
      TWhereBuilder
    >,
    flavorOptions: Readonly<ISqlFlavorOptions>,
    tableName: string
  ) {
    super(flavorOptions, tableName)

    this.builderWithWhere = new BuilderWithWhere(WhereBuilderConstructor)
  }

  where(
    callback: TWhereBuilderCallback<TOperator, TExtraClause, TWhereBuilder>,
    shouldAdd = true
  ): this {
    this.builderWithWhere.where(callback, shouldAdd)

    return this
  }

  override toString(): string {
    return new PairArrayStringifier(
      this.pairs,
      this.tableName,
      this.builderWithWhere.toString()
    ).toString()
  }
}
