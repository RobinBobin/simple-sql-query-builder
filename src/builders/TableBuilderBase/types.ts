import type { TCallback } from '../types'
import type { UniqueBuilder } from './UniqueBuilder'

type TForeignKeyAction =
  | 'CASCADE'
  | 'NO ACTION'
  | 'RESTRICT'
  | 'SET DEFAULT'
  | 'SET NULL'

type TUniqueCallback = TCallback<UniqueBuilder>

export type { TForeignKeyAction, TUniqueCallback }
