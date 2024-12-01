import type { TClause, TOperator } from './extraOperators'

import { SelectBuilderBase } from '../../builders/BuildersWithWhere/SelectBuilderBase'
import { FLAVOR_OPTIONS } from './flavorOptions'
import { jsonField } from './helpers'
import { arrayLength } from './helpers/array'
import { WhereBuilder } from './WhereBuilder'

export class SelectBuilder extends SelectBuilderBase<
  TOperator,
  TClause,
  WhereBuilder
> {
  constructor() {
    super(WhereBuilder, FLAVOR_OPTIONS)
  }

  arrayLength(
    columnName: string,
    dimension: number,
    alias?: string,
    shouldAdd = true
  ): this {
    return this.column(
      { alias, columnName: arrayLength(columnName, dimension) },
      shouldAdd
    )
  }

  jsonField(
    columnName: string,
    fieldName: string,
    alias = fieldName,
    shouldAdd = true
  ): this {
    return this.column(jsonField(columnName, fieldName), alias, shouldAdd)
  }
}
