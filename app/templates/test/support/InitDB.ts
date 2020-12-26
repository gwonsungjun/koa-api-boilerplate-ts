import { Connection, createConnection } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import config from '@common/config'

export default async (): Promise<Connection> => {
  const { db } = config
  const { uri, entitiesPath } = db

  const connection = await createConnection({
    ...db,
    url: uri,
    synchronize: true,
    dropSchema: true,
    entities: [entitiesPath],
    namingStrategy: new SnakeNamingStrategy(),
    logging: false,
  })

  const entities = connection.entityMetadatas.map(({ name, tableName }) => ({ name, tableName }))

  const queryRunner = connection.createQueryRunner()
  await Promise.all(entities.map(({ tableName }) => queryRunner.getTable(tableName))).then((tables) =>
    Promise.all(tables.map((table) => queryRunner.dropForeignKeys(table?.name || '', table?.foreignKeys || []))),
  )

  return connection
}
