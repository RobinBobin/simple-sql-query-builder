// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const preferReadonlyParameterTypes = (isLocal = false) => {
  const allow = [
    'FromBuilder',
    'InsertBuilder',
    'SelectBuilder',
    'TableBuilder',
    'UpdateBuilder',
    'UpsertBuilder',
    'WhereBuilder'
  ].map(name => {
    const base = {
      from: isLocal ? 'file' : 'package',
      name
    }

    return isLocal ? base : (
        {
          ...base,
          package: 'simple-sql-query-builder'
        }
      )
  })

  return {
    '@typescript-eslint/prefer-readonly-parameter-types': [
      'error',
      {
        allow
      }
    ]
  }
}
