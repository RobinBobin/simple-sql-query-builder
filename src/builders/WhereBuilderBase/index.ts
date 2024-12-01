import type {
  TAddClauseParameterType,
  TClauseEntry,
  TClauseFactory,
  TExtraClauseBase,
  TGrouping,
  TWhereBuilderStringifierConstructor
} from './types'

export class WhereBuilderBase<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator> = never
> {
  private readonly clauses: TClauseEntry<TOperator, TExtraClause>[] = []

  constructor(
    private readonly WhereBuilderStringifier: TWhereBuilderStringifierConstructor<
      TOperator,
      TExtraClause
    >
  ) {}

  and(...clause: TAddClauseParameterType<TOperator, TExtraClause>): this {
    return this.addClause(clause, 'AND')
  }

  andNot(...clause: TAddClauseParameterType<TOperator, TExtraClause>): this {
    return this.addClause(clause, 'AND NOT')
  }

  or(...clause: TAddClauseParameterType<TOperator, TExtraClause>): this {
    return this.addClause(clause, 'OR')
  }

  pop(): this {
    this.clauses.push(')')

    return this
  }

  push(...clause: TAddClauseParameterType<TOperator, TExtraClause>): this {
    return this.addClause(clause, this.clauses.length ? '(' : undefined)
  }

  toString(): string {
    return new this.WhereBuilderStringifier(this.clauses).toString()
  }

  private addClause(
    clause: TAddClauseParameterType<TOperator, TExtraClause>,
    grouping?: TGrouping
  ): this {
    if (grouping) {
      this.clauses.push(grouping)
    }

    const isClause = (
      cl: TAddClauseParameterType<TOperator, TExtraClause>
    ): cl is TClauseFactory<TOperator, TExtraClause> => {
      return Boolean(cl.length)
    }

    if (isClause(clause)) {
      this.clauses.push(clause)
    }

    return this
  }
}
