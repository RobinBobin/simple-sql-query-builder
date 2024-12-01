import type {
  TClauseEntries,
  TClauseEntry
} from '../../builders/WhereBuilderBase/types'
import type { TClause, TOperator } from './extraOperators'

import { WhereBuilderStringifierBase } from '../../builders/WhereBuilderBase/WhereBuilderStringifierBase'
import { isStandardClauseEntry } from '../isStandardClauseEntry'
import { ExtraOperator } from './extraOperators'
import { FLAVOR_OPTIONS } from './flavorOptions'
import { array } from './helpers/array'

export class WhereBuilderStringifier extends WhereBuilderStringifierBase {
  constructor(clauses: TClauseEntries<TOperator, TClause>) {
    super(clauses as TClauseEntry<TOperator>[], FLAVOR_OPTIONS)
  }

  protected override getStringifiedElement(
    index: number,
    clauseEntry: TClauseEntry<TOperator, TClause>
  ): string {
    if (isStandardClauseEntry(clauseEntry, Object.keys(ExtraOperator))) {
      return super.getStringifiedElement(index, clauseEntry)
    }

    const [columnName, operator, rest] = clauseEntry

    switch (operator) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      case '@>':
        return [columnName, operator, array(rest)].join(' ')
    }

    // @ts-expect-error Fallback for forgotten operators
    throw new TypeError(
      `postgres WhereBuilderStringifier.getStringifiedElement(): default (${operator as string})`
    )
  }
}
