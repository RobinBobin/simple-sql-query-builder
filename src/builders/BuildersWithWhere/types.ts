import type { TWhereBuilderCallback } from '../types'
import type { WhereBuilderBase } from '../WhereBuilderBase'

interface IBuilderWithWhere<TWhereBuilder extends WhereBuilderBase> {
  where: (
    callback: TWhereBuilderCallback<TWhereBuilder>,
    shouldAdd?: boolean
  ) => void
}

export type { IBuilderWithWhere }
