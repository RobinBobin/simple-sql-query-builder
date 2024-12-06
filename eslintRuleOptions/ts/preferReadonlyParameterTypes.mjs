const allow = [
  'FromBuilder',
  'InsertBuilder',
  'SelectBuilder',
  'TableBuilder',
  'UpdateBuilder',
  'UpsertBuilder',
  'WhereBuilder'
].flatMap(name => {
  return [
    {
      from: 'file',
      name
    },
    {
      from: 'package',
      name,
      package: 'simple-sql-query-builder'
    }
  ]
})

export const preferReadonlyParameterTypes = { allow }
