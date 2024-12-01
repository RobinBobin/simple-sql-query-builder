import type { TWhereBuilderCallback, TWhereBuilderConstructor } from '../types'
import type { WhereBuilderBase } from '../WhereBuilderBase'
import type { IBuilderWithWhere } from './types'

export class BuilderWithWhere<TWhereBuilder extends WhereBuilderBase>
  implements IBuilderWithWhere<TWhereBuilder>
{
  private readonly whereBuilder: TWhereBuilder

  constructor(
    WhereBuilderConstructor: TWhereBuilderConstructor<TWhereBuilder>
  ) {
    this.whereBuilder = new WhereBuilderConstructor()
  }

  toString(): string {
    return this.whereBuilder.toString()
  }

  where(
    whereBuilderCallback: TWhereBuilderCallback<TWhereBuilder>,
    shouldAdd = true
  ): this {
    if (shouldAdd) {
      whereBuilderCallback(this.whereBuilder)
    }

    return this
  }
}
