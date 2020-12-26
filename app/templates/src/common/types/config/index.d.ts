import { ConfigAll } from '@common/types/config/all'
import { ConfigTest } from '@common/types/config/test'
import { ConfigDevelopment } from '@common/types/config/development'
import { ConfigProduction } from '@common/types/config/production'

export interface ConfigIndex {
  [key: string]: object
  readonly all: ConfigAll
  readonly test: ConfigTest
  readonly development: ConfigDevelopment
  readonly production: ConfigProduction
}
