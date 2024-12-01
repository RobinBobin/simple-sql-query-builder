import type { ISqlFlavorOptions } from '../../flavors/types'
import type { TClauseEntry, TColumnValue } from './types'

import { isString } from 'radashi'
import { ArrayStringifier, quoteIfString } from 'simple-common-utils'

import { ConditionalArray } from '../../helpers/ConditionalArray'

class ValueArrayStringifier extends ArrayStringifier<TColumnValue> {
  constructor(
    array: readonly TColumnValue[],
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>
  ) {
    super(array)

    this.setPrefix('(').setPostfix(')')
  }

  protected override getStringifiedElement(
    __: number,
    element: TColumnValue
  ): string {
    return quoteIfString(element, {
      quotingSymbol: this.flavorOptions.quotingSymbol
    }).toString()
  }
}

export class WhereBuilderArrayStringifier extends ArrayStringifier<TClauseEntry> {
  constructor(
    array: readonly TClauseEntry[],
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>
  ) {
    super(array, ' ')

    this.setPrefix(' WHERE ')
  }

  protected override getStringifiedElement(
    __: number,
    element: TClauseEntry
  ): string {
    if (isString(element)) {
      return element
    }

    const [columnName, operator, value, ...rest] = element

    switch (operator) {
      case 'IN':
        return [
          columnName,
          operator,
          new ValueArrayStringifier(value, this.flavorOptions)
        ].join(' ')

      case 'IS NOT NULL':
      case 'IS NULL':
        return element.join(' ')

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
    throw new Error(
      'WhereBuilderArrayStringifier.getStringifiedElement(): default'
    )
  }
}
