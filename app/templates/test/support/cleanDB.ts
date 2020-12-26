import { Connection, getConnection } from 'typeorm'

export default async () => {
  const connection: Connection = getConnection()

  const entities = connection.entityMetadatas.map(({ name, tableName }) => ({ name, tableName }))

  await Promise.all(
    entities.map(({ name }) => {
      const repository = connection.getRepository(name)
      return repository.clear()
    }),
  )
}
