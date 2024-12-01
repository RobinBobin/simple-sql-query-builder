import type { ISqlFlavorOptions } from '../../../flavors/types'
import type { TColumnOrder } from '../../TableBuilderBase/UniqueBuilder/types'
import type {
  TFromBuilderCallback,
  TWhereBuilderConstructor
} from '../../types'
import type { WhereBuilderBase } from '../../WhereBuilderBase'
import type {
  TCellValues,
  TExtraClauseBase
} from '../../WhereBuilderBase/types'
import type { IColumn } from './types'

import { isObject, isString } from 'radashi'
import { ArrayStringifier } from 'simple-common-utils'

import { pushAndReturnElement } from '../../../helpers/pushAndReturnElement'
import { BuilderWithWhere } from '../BuilderWithWhere'
import { ColumnArrayStringifier } from './ColumnArrayStringifier'
import { FromBuilder } from './FromBuilder'

export class SelectBuilderBase<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>,
  TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>
> extends BuilderWithWhere<TOperator, TExtraClause, TWhereBuilder> {
  private readonly columns: IColumn[] = []
  private readonly froms: FromBuilder[] = []
  private limitString = ''
  private offsetString = ''
  private readonly orderBys: string[] = []

  constructor(
    WhereBuilderConstructor: TWhereBuilderConstructor<
      TOperator,
      TExtraClause,
      TWhereBuilder
    >,
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>
  ) {
    super(WhereBuilderConstructor)
  }

  coalesce(values: TCellValues, alias?: string, shouldAdd = true): this {
    return this.column(
      {
        alias,
        columnName: new ArrayStringifier(values)
          .setPrefix('COALESCE(')
          .setPostfix(')')
          .toString()
      },
      shouldAdd
    )
  }

  column(
    columnOrColumnName: Readonly<IColumn> | string,
    shouldAdd?: boolean
  ): this
  column(columnName: string, alias: string, shouldAdd?: boolean): this

  column(
    columnOrColumnName: Readonly<IColumn> | string,
    aliasOrShouldAdd?: boolean | string,
    shouldAddRaw?: boolean
  ): this {
    let column: IColumn
    let shouldAdd: boolean

    if (isObject(columnOrColumnName)) {
      if (isString(aliasOrShouldAdd)) {
        throw new Error(
          'SelectBuilderBase.column(): isString(aliasOrShouldAdd)'
        )
      }

      column = columnOrColumnName
      shouldAdd = aliasOrShouldAdd ?? true
    } else if (isString(aliasOrShouldAdd)) {
      column = { alias: aliasOrShouldAdd, columnName: columnOrColumnName }
      shouldAdd = shouldAddRaw ?? true
    } else {
      column = { columnName: columnOrColumnName }
      shouldAdd = aliasOrShouldAdd ?? true
    }

    if (shouldAdd) {
      this.columns.push(column)
    }

    return this
  }

  from(tableName: string, fromCallback?: TFromBuilderCallback): this {
    const builder = pushAndReturnElement(this.froms, new FromBuilder(tableName))

    if (fromCallback) {
      fromCallback(builder)
    }

    return this
  }

  limit(limit: number, shouldAdd = true): this {
    if (shouldAdd) {
      this.limitString = ` LIMIT ${limit}`
    }

    return this
  }

  offset(offset: number, shouldAdd = true): this {
    if (shouldAdd) {
      this.offsetString = ` OFFSET ${offset}`
    }

    return this
  }

  orderBy(columnName: string, order: TColumnOrder = 'ASC'): this {
    this.orderBys.push([columnName, order].join(' '))

    return this
  }

  override toString(): string {
    return [
      new ColumnArrayStringifier(this.columns, this.flavorOptions),
      new ArrayStringifier(this.froms).setPrefix(' FROM '),
      super.toString(),
      new ArrayStringifier(this.orderBys).setPrefix(' ORDER BY '),
      this.limitString,
      this.offsetString
    ].join('')
  }
}
