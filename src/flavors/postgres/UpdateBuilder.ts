import type {
  TCellValue,
  TCellValues
} from '../../builders/WhereBuilderBase/types'
import type { TClause, TOperator } from './extraOperators'

import { isArray } from 'radashi'

import { UpdateBuilderBase } from '../../builders/BuildersWithWhere/UpdateBuilderBase'
import { FLAVOR_OPTIONS } from './flavorOptions'
import { array, arrayAppend, arrayRemove } from './helpers/array'
import { WhereBuilder } from './WhereBuilder'

export class UpdateBuilder extends UpdateBuilderBase<
  TOperator,
  TClause,
  WhereBuilder
> {
  constructor(tableName: string) {
    super(WhereBuilder, FLAVOR_OPTIONS, tableName)
  }

  columnValueAppend(
    columnName: string,
    data: TCellValue | TCellValues,
    shouldAdd = true
  ): this {
    const stringifiedData =
      isArray(data) ?
        [columnName, '||', array(data)].join(' ')
      : arrayAppend(columnName, data)

    return this.columnValue(columnName, stringifiedData, shouldAdd, false)
  }

  columnValueRemove(
    columnName: string,
    value: TCellValue,
    shouldRemove = true
  ): this {
    return this.columnValue(
      columnName,
      arrayRemove(columnName, value),
      shouldRemove,
      false
    )
  }
}
