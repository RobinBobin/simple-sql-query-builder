export const jsonField = (columnName: string, fieldName: string): string => {
  return `${columnName}->>'${fieldName}'`
}
