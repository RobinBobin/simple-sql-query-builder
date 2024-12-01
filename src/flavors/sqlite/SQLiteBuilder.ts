import { SqlBuilderBase } from '../../builders/SqlBuilderBase'
import { InsertBuilder } from './InsertBuilder'
import { SelectBuilder } from './SelectBuilder'
import { TableBuilder } from './TableBuilder'
import { UpdateBuilder } from './UpdateBuilder'
import { WhereBuilder } from './WhereBuilder'

export class SQLiteBuilder extends SqlBuilderBase<
  InsertBuilder,
  TableBuilder,
  WhereBuilder,
  SelectBuilder,
  UpdateBuilder
> {
  constructor() {
    super(
      InsertBuilder,
      SelectBuilder,
      TableBuilder,
      UpdateBuilder,
      WhereBuilder
    )
  }
}
