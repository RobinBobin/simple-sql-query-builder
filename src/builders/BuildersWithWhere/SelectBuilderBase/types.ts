import type { SetOptional } from 'type-fest'

interface IColumn {
  alias?: string | undefined
  columnName: string
}

type TJoinType = 'INNER JOIN' | 'LEFT OUTER JOIN' | 'RIGHT OUTER JOIN'

interface IJoin {
  field1: string
  field2: string
  table: string
  type: TJoinType
}

type TJoinFunctionParamType = Readonly<SetOptional<IJoin, 'type'>>

export type { IColumn, IJoin, TJoinFunctionParamType, TJoinType }
