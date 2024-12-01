import type { ISqlFlavorOptions } from '../../flavors/types'
import type {
  TCellValue,
  TCellValues,
  TClauseEntries,
  TClauseEntry,
  TStandardOperator
} from './types'

import { isString } from 'radashi'
import { ArrayStringifier, quoteIfString } from 'simple-common-utils'

import { ConditionalArray } from '../../helpers/ConditionalArray'

class ValueArrayStringifier extends ArrayStringifier<TCellValue> {
  constructor(
    values: TCellValues,
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>
  ) {
    super(values)

    this.setPrefix('(').setPostfix(')')
  }

  protected override getStringifiedElement(
    __: number,
    value: TCellValue
  ): string {
    return quoteIfString(value, {
      quotingSymbol: this.flavorOptions.quotingSymbol
    }).toString()
  }
}

export class WhereBuilderStringifierBase extends ArrayStringifier<
  TClauseEntry<TStandardOperator>
> {
  constructor(
    clauses: TClauseEntries<TStandardOperator>,
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>
  ) {
    super(clauses, ' ')

    this.setPrefix(' WHERE ')
  }

  protected override getStringifiedElement(
    __: number,
    clauseEntry: TClauseEntry<TStandardOperator>
  ): string {
    if (isString(clauseEntry)) {
      return clauseEntry
    }

    const [columnName, operator, value, ...rest] = clauseEntry

    switch (operator) {
      case 'IN':
        return [
          columnName,
          operator,
          new ValueArrayStringifier(value, this.flavorOptions)
        ].join(' ')

      case 'IS NOT NULL':
      case 'IS NULL':
        return clauseEntry.join(' ')

      case 'LIKE': {
        const [isStartingWith = false, isEndingWith = false] = rest

        return [
          columnName,
          operator,
          quoteIfString(
            new ConditionalArray()
              .push('%', !isStartingWith)
              .push(value)
              .push('%', !isEndingWith)
              .toString(),
            { quotingSymbol: this.flavorOptions.quotingSymbol }
          )
        ].join(' ')
      }

      case '=':
      case '!=':
      case '<':
      case '<=':
      case '>':
      case '>=':
        return [
          columnName,
          operator,
          quoteIfString(value, {
            quotingSymbol: this.flavorOptions.quotingSymbol
          })
        ].join(' ')
    }

    // @ts-expect-error Fallback for forgotten operators
    throw new TypeError(
      `WhereBuilderStringifierBase.getStringifiedElement(): default (${operator as string})`
    )
  }
}
