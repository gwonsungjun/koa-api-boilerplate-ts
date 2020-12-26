import { AwilixContainer } from 'awilix'
import { loadControllers, scopePerRequest } from 'awilix-koa'
import checkHealth from 'koa-simple-healthcheck'
import koaBody from 'koa-body'
import jsend from 'koa-jsend'
import koaValidator from 'koa-async-validator'
import Koa, { Context, Next } from 'koa'
import Debug from 'debug'

export default async (container: AwilixContainer): Promise<Koa> => {
  const app = new Koa()
  const logging = Debug('http')

  app.use(jsend())
  app.use(koaBody({ jsonLimit: '100mb' }))
  app.use(koaValidator())

  app.use(async (ctx: Context, next: Next) => {
    const start = new Date().getTime()

    await next().then(() => {
      const elapsed = new Date().getTime() - start
      logging(`${ctx.request.method} ${ctx.request.url} ${JSON.stringify(ctx.response.status)} ${elapsed}ms`)
      logging(`[header] ${JSON.stringify(ctx.request.header)}`)
      logging(`[body] ${JSON.stringify(ctx.request.body)}`)
    })
  })

  app.use(scopePerRequest(container))

  app.use(
    async (ctx: Context, next: Next): Promise<void> => {
      try {
        await next()
      } catch (err) {
        ctx.status = err.status || 500
        const message = ctx.status === 500 ? 'Internal Server Error' : err.message
        ctx.error(message, null, err.code)
        ctx.app.emit('error', err, ctx)
      }
    },
  )

  app.use(loadControllers('../../web/rest/*Controller.{js,ts}', { cwd: __dirname }))

  // GET /healthcheck
  app.use(
    checkHealth({
      healthy() {
        return { healthy: true }
      },
    }),
  )

  app.on('error', (err: Error) => {
    // eslint-disable-next-line no-console
    console.error(err)
  })

  return app
}
