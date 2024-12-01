import type { ISqlFlavorOptions } from '../../../flavors/types'
import type {
  TWhereBuilderCallback,
  TWhereBuilderConstructor
} from '../../types'
import type { WhereBuilderBase } from '../../WhereBuilderBase'
import type { IBuilderWithWhere } from '../types'

import { InsertBuilderBase } from '../../InsertBuilderBase'
import { BuilderWithWhere } from '../BuilderWithWhere'
import { PairStringifier } from './PairStringifier'

export class UpdateBuilderBase<TWhereBuilder extends WhereBuilderBase>
  extends InsertBuilderBase
  implements IBuilderWithWhere<TWhereBuilder>
{
  private readonly builderWithWhere: BuilderWithWhere<TWhereBuilder>

  constructor(
    WhereBuilderConstructor: TWhereBuilderConstructor<TWhereBuilder>,
    flavorOptions: Readonly<ISqlFlavorOptions>,
    tableName: string
  ) {
    super(flavorOptions, tableName)

    this.builderWithWhere = new BuilderWithWhere(WhereBuilderConstructor)
  }

  where(
    callback: TWhereBuilderCallback<TWhereBuilder>,
    shouldAdd = true
  ): this {
    this.builderWithWhere.where(callback, shouldAdd)

    return this
  }

  override toString(): string {
    return new PairStringifier(
      this.flavorOptions,
      this.pairs,
      this.tableName,
      this.builderWithWhere.toString()
    ).toString()
  }
}
