import type { IJoin, TJoinFunctionParamType } from '../types'

import { JoinArrayStringifier } from './JoinArrayStringifier'

export class FromBuilder {
  private readonly joins: IJoin[] = []

  constructor(private readonly tableName: string) {
    // Nothing to do
  }

  addJoin(join: Readonly<IJoin>): this {
    this.joins.push(join)

    return this
  }

  innerJoin(join: TJoinFunctionParamType): this {
    return this.addJoin({ ...join, type: 'INNER JOIN' })
  }

  leftOuterJoin(join: TJoinFunctionParamType): this {
    return this.addJoin({ ...join, type: 'LEFT OUTER JOIN' })
  }

  rightOuterJoin(join: TJoinFunctionParamType): this {
    return this.addJoin({ ...join, type: 'RIGHT OUTER JOIN' })
  }

  toString(): string {
    return this.tableName + new JoinArrayStringifier(this.joins).toString()
  }
}
