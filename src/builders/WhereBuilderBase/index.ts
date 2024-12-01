import type { ISqlFlavorOptions } from '../../flavors/types'
import type {
  TAddClauseParameterType,
  TClause,
  TClauseEntry,
  TGrouping
} from './types'

import { WhereBuilderArrayStringifier } from './WhereBuilderArrayStringifier'

export class WhereBuilderBase {
  private readonly clauses: TClauseEntry[] = []

  constructor(private readonly flavorOptions: Readonly<ISqlFlavorOptions>) {}

  and(...clause: TAddClauseParameterType): this {
    return this.addClause(clause, 'AND')
  }

  andNot(...clause: TAddClauseParameterType): this {
    return this.addClause(clause, 'AND NOT')
  }

  or(...clause: TAddClauseParameterType): this {
    return this.addClause(clause, 'OR')
  }

  pop(): this {
    this.clauses.push(')')

    return this
  }

  push(...clause: TAddClauseParameterType): this {
    return this.addClause(clause, this.clauses.length ? '(' : undefined)
  }

  toString(): string {
    return new WhereBuilderArrayStringifier(
      this.clauses,
      this.flavorOptions
    ).toString()
  }

  private addClause(clause: readonly unknown[], grouping?: TGrouping): this {
    if (grouping) {
      this.clauses.push(grouping)
    }

    if (clause.length) {
      this.clauses.push(clause as TClause)
    }

    return this
  }
}
