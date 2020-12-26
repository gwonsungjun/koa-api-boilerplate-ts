import { AwilixContainer } from 'awilix'
import Debug from 'debug'
import { initContainer } from '@container'
import { initDB } from '@infrastructure/typeorm'
import koa from '@infrastructure/koa'
import config from '@common/config'
import { ConfigAll } from '@common/types/config/all'

const logging = Debug('app:server')

export const startServer = async (container: AwilixContainer): Promise<void> => {
  const { env, port, host }: ConfigAll = config

  const app = await koa(container)

  app.listen(port, host, () => logging(`Koa server listening on ${host}:${port}, in ${env} mode`))
}

initDB()
  .then(() => initContainer())
  .then((container: AwilixContainer) => startServer(container))
  .catch((err: Error) => {
    // eslint-disable-next-line no-console
    console.error('Server failed to start due to error: %s', err)
  })
